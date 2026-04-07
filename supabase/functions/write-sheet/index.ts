const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getAccessToken(sa: any): Promise<string> {
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const now = Math.floor(Date.now() / 1000);
  const claim = btoa(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const message = new TextEncoder().encode(`${header}.${claim}`);
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

// Column headers in order - must match spreadsheet
const HEADERS = [
  "timestamp",
  "101","102","103","104","105",
  "201","202","203","204",
  "301","302","303","304",
  "401","402a","402b","402c","402d",
  "403a","403b","403c","403d","403e",
  "404a","404b","404c","404d","404e","404f","404g","404h","404i",
  "405",
  "501a","501b",
  "502a","502b","502c","502d","502e",
  "503a","503b","503c","503d","503e","503f","503g","503h",
  "504a","504b","504c","504d","504e","504f","504g",
  "601a","601b","601c","601d",
  "602a","602b","602c","602d",
  "603a","603b","603c","603d",
  "604a","604b","604c","604d",
  "605a","605b","605c","605d",
  "606a","606b","606c","606d",
  "607a","607b","607c","607d",
  "608a","608b","608c","608d",
  "609a","609b","609c","609d",
  "610a","610b","610c","610d",
  "611a","611b","611c","611d",
  "612a","612b","612c","612d",
  "613a","613b","613c","613d",
  "801a","801b","801c","801d","801e",
  "901",
  "902a","902b","902c","902d",
  "903a","903b","903c","903d","903e","903f",
  "1001a","1001b",
  "1002a","1002b","1002c","1002d","1002e",
  "catatan",
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { formData, blockData, checkboxData } = await req.json();

    // Flatten all data into a single row keyed by header
    const rowMap: Record<string, string> = {};
    rowMap["timestamp"] = new Date().toISOString();

    // formData: { sectionKey: { fieldKey: value } }
    for (const section of Object.values(formData || {}) as Record<string, string>[]) {
      for (const [k, v] of Object.entries(section)) {
        rowMap[k] = v;
      }
    }

    // blockData: { sectionKey: { blockId: { subKey: value } } }
    for (const section of Object.values(blockData || {}) as Record<string, Record<string, string>>[]) {
      for (const [blockId, fields] of Object.entries(section)) {
        for (const [sub, v] of Object.entries(fields)) {
          rowMap[`${blockId}${sub}`] = v;
        }
      }
    }

    // checkboxData: { sectionKey: { fieldKey: string[] } }
    for (const section of Object.values(checkboxData || {}) as Record<string, string[]>[]) {
      for (const [k, v] of Object.entries(section)) {
        rowMap[k] = Array.isArray(v) ? v.join(",") : v;
      }
    }

    // Build row array in header order
    const row = HEADERS.map(h => rowMap[h] || "");

    const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    if (!saJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
    const sa = JSON.parse(saJson);
    const token = await getAccessToken(sa);

    const SPREADSHEET_ID = "1TTgYNAgy2TXxmz_zz18iDX9h51xBGXkBy6_6EIV39S8";
    const SHEET_NAME = "Sheet1";

    // Check if headers exist, if not write them first
    const headerResp = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!1:1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const headerData = await headerResp.json();
    
    if (!headerData.values || headerData.values.length === 0 || headerData.values[0].length === 0) {
      // Write headers first
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A1?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ values: [HEADERS] }),
        }
      );
    }

    // Append the data row
    const appendResp = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A:A:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [row] }),
      }
    );
    const result = await appendResp.json();

    return new Response(JSON.stringify({ success: true, updates: result.updates }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
