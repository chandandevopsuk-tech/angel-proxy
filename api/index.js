export default async function handler(req, res) {
  try {
    const ANGEL_API_KEY = process.env.ANGEL_API_KEY;
    const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

    if (!ANGEL_API_KEY || !ACCESS_TOKEN) {
      return res.status(500).json({
        error: "Missing API key or access token"
      });
    }

    const angelRes = await fetch(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getProfile",
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-PrivateKey": ANGEL_API_KEY,
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": "127.0.0.1",
          "X-ClientPublicIP": "127.0.0.1",
          "X-MACAddress": "00:00:00:00:00:00"
        }
      }
    );

    const rawText = await angelRes.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(angelRes.status || 500).json({
        error: "Angel API did not return JSON",
        status: angelRes.status,
        contentType: angelRes.headers.get("content-type"),
        preview: rawText.slice(0, 500)
      });
    }

    return res.status(angelRes.status).json(data);
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
}
