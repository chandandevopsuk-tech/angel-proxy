export default async function handler(req, res) {
  try {
    // 🔐 Secure env variables (Vercel se aayenge)
    const ANGEL_API_KEY = process.env.ANGEL_API_KEY;
    const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

    if (!ANGEL_API_KEY || !ACCESS_TOKEN) {
      return res.status(500).json({
        error: "Missing API key or access token"
      });
    }

    // 🔁 Angel One API call
    const angelRes = await fetch(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/market/v1/optionGreek",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-PrivateKey": ANGEL_API_KEY,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          name: "SENSEX",
          expiry: "16APR2026"
        })
      }
    );

    const data = await angelRes.json();

    // 🧠 Basic validation
    if (!angelRes.ok) {
      return res.status(angelRes.status).json({
        error: "Angel API error",
        details: data
      });
    }

    // ✅ Success response
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
}
