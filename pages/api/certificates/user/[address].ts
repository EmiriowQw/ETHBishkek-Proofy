import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    console.log(`📤 Proxying to Backend: Fetching certificates for ${address}`);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(`${backendUrl}/api/certificates/user/${address}`);

    const backendData = await backendResponse.json();

    console.log(`✅ Backend Response: Found ${backendData.certificates?.length || 0} certificates`);

    if (!backendResponse.ok) {
      throw new Error(backendData.error || "Backend request failed");
    }

    res.status(200).json({
      success: true,
      certificates: backendData.certificates || [],
    });
  } catch (error: any) {
    console.error("❌ Error fetching certificates:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
