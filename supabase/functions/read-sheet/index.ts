const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getAccessToken(sa: any): Promise<string> {
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const now = Math.floor(Date.now() / 1000);
  const claim = btoa(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const message = new TextEncoder().encode(`${header}.${claim}`);

  // Import private key
  const pemBody = sa.private_key.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\n/g, '');
  const binaryDer = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", binaryDer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, message);
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${header}.${claim}.${sig}`;
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await resp.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    if (!saJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
    const sa = JSON.parse(saJson);
    const token = await getAccessToken(sa);

    const SPREADSHEET_ID = "1TTgYNAgy2TXxmz_zz18iDX9h51xBGXkBy6_6EIV39S8";
    const metaResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?includeGridData=false`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meta = await metaResp.json();

    const results = [];
    for (const sheet of meta.sheets || []) {
      const title = sheet.properties.title;
      const valResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(title)}!1:1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vals = await valResp.json();
      results.push({ sheet: title, headers: vals.values?.[0] || [] });
    }

    return new Response(JSON.stringify(results, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
