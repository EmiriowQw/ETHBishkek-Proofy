import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, description, duration, lessons, creatorAddress } = req.body;

    if (!title || !description || !lessons || !creatorAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/api/courses/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        duration,
        lessons,
        creatorAddress,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create course");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

