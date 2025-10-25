import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { courseId, studentAddress, proofOfCompletion } = req.body;

    if (!courseId || !studentAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("📤 Proxying to Backend: Submitting for verification");
    console.log("📤 Course ID:", courseId);
    console.log("📤 Student:", studentAddress);

    // Отправляем запрос в Backend
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(`${backendUrl}/api/courses/submit-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId,
        studentAddress,
        proofOfCompletion,
      }),
    });

    const backendData = await backendResponse.json();

    console.log("✅ Backend Response:", backendData);

    if (!backendResponse.ok) {
      throw new Error(backendData.error || "Backend request failed");
    }

    res.status(200).json({
      success: true,
      message: backendData.message,
      verificationRequest: backendData.data.verificationRequest,
    });
  } catch (error: any) {
    console.error("❌ Error submitting for verification:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

