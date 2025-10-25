import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, description, category, specificData, creatorAddress } = req.body;

    if (!title || !category || !creatorAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("📤 Proxying to Backend: Creating achievement");
    console.log("📤 Title:", title);
    console.log("📤 Category:", category);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(`${backendUrl}/api/achievements/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        category,
        specificData,
        creatorAddress,
      }),
    });

    const backendData = await backendResponse.json();

    console.log("✅ Backend Response:", backendData);

    if (!backendResponse.ok) {
      throw new Error(backendData.error || "Backend request failed");
    }

    res.status(200).json(backendData);
  } catch (error: any) {
    console.error("❌ Error creating achievement:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

