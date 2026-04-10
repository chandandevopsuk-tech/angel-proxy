export default async function handler(req, res) {
  try {
    const ANGEL_API_KEY = "YOUR_API_KEY";
    const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";

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

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
