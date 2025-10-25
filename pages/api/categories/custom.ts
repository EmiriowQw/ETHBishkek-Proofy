import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, icon, description, fields, creatorAddress } = req.body;

    if (!name || !fields) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("📤 Proxying to Backend: Creating custom category");
    console.log("📤 Name:", name);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(`${backendUrl}/api/categories/custom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        icon,
        description,
        fields,
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
    console.error("❌ Error creating custom category:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

