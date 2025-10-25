import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📤 Proxying to Backend: Fetching verification requests");

    // Получаем запросы из Backend
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(`${backendUrl}/api/verification/requests`);

    const backendData = await backendResponse.json();

    console.log(`✅ Backend Response: Found ${backendData.requests?.length || 0} requests`);

    if (!backendResponse.ok) {
      throw new Error(backendData.error || "Backend request failed");
    }

    res.status(200).json({
      success: true,
      requests: backendData.requests || [],
    });
  } catch (error: any) {
    console.error("❌ Error fetching verification requests:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

