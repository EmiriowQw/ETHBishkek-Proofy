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
    console.log(`📤 Proxying to Backend: Fetching achievements for ${address}`);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(
      `${backendUrl}/api/achievements/my-achievements?address=${address}`
    );

    const backendData = await backendResponse.json();

    console.log(`✅ Backend Response: Found ${backendData.achievements?.length || 0} achievements`);

    if (!backendResponse.ok) {
      throw new Error(backendData.error || "Backend request failed");
    }

    res.status(200).json(backendData);
  } catch (error: any) {
    console.error("❌ Error fetching achievements:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

