import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { requestId, verifierAddress, status, reason } = req.body;

    if (!requestId || !verifierAddress || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/api/verification/verify`, {
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to process verification");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error processing verification:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

