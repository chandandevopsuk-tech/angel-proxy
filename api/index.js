export default async function handler(req, res) {
  try {
    const ANGEL_API_KEY = process.env.ANGEL_API_KEY;
    const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

    if (!ANGEL_API_KEY || !ACCESS_TOKEN) {
      return res.status(500).json({
        error: "Missing API key or access token"
      });
    }

    const url =
      "https://apiconnect.angelone.in/rest/secure/angelbroking/market/v1/optionGreek";

    const angelRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-PrivateKey": ANGEL_API_KEY,
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        name: "SENSEX",
        expiry: "16APR2026"
      })
    });

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

    if (!angelRes.ok) {
      return res.status(angelRes.status).json({
        error: "Angel API error",
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
}
