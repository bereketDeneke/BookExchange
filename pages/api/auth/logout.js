export default async function handler(req, res) {
    // Clear the cookie containing the token
    res.setHeader('Set-Cookie', 'authorization=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict');
    res.status(200).json({ message: 'Logged out successfully' });
  }
  