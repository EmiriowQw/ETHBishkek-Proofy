import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { achievementId, studentAddress, proofOfCompletion, proofImage } = req.body;

    if (!achievementId || !studentAddress || !proofOfCompletion) {
      return res.status(400).json({ error: "Achievement ID, student address, and proof of completion are required" });
    }

    console.log("📤 Proxying to Backend: Submitting achievement for verification");
    console.log("📤 Achievement ID:", achievementId);
    console.log("📤 Student:", studentAddress);
    console.log("📤 Has proof image:", !!proofImage);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(`${backendUrl}/api/achievements/submit-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        achievementId,
        studentAddress,
        proofOfCompletion,
        proofImage,
      }),
    });

    const backendData = await backendResponse.json();

    console.log("✅ Backend Response:", backendData);

    if (!backendResponse.ok) {
      throw new Error(backendData.error || "Backend request failed");
    }

    res.status(200).json(backendData);
  } catch (error: any) {
    console.error("❌ Error submitting achievement for verification:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

