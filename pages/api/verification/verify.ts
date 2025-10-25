import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { requestId, verifierAddress, status, reason } = req.body;

    // Валидация
    if (!requestId || !verifierAddress || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (status !== "verified" && status !== "rejected") {
      return res.status(400).json({ error: "Invalid status. Must be 'verified' or 'rejected'" });
    }

    if (status === "rejected" && (!reason || reason.trim().length < 10)) {
      return res.status(400).json({ error: "Rejection reason is required and must be at least 10 characters" });
    }

    console.log("📤 Proxying to Backend: Processing verification");
    console.log("📤 Request ID:", requestId);
    console.log("📤 Status:", status);

    // Отправляем запрос в Backend
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(`${backendUrl}/api/verification/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId,
        verifierAddress,
        status,
        reason,
      }),
    });

    const backendData = await backendResponse.json();

    console.log("✅ Backend Response:", backendData);

    if (!backendResponse.ok) {
      throw new Error(backendData.error || "Backend request failed");
    }

    res.status(200).json(backendData);

  } catch (error: any) {
    console.error("❌ Error processing verification:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

