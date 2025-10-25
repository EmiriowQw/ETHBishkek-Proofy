import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Call backend API
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/api/verification/requests`);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch verification requests" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching verification requests:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

