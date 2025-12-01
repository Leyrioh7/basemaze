export default async function handler(req, res) {
  const { fid } = req.query;

  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: {
        "api_key": process.env.NEYNAR_API_KEY
      }
    }
  );

  const data = await response.json();

  const user = data.users?.[0] || {};

  res.status(200).json({
    fid,
    username: user.username,
    wallet_address: user?.verifications?.[0] || null
  });
}
