export default async function handler(req, res) {
  const { castHash } = req.query;

  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/cast?identifier=${castHash}&type=hash`,
    {
      headers: {
        "api_key": process.env.NEYNAR_API_KEY
      }
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
