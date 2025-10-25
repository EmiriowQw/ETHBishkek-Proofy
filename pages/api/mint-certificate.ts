import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { courseId, courseName, studentName, studentAddress } = req.body;

    if (!courseId || !courseName || !studentName || !studentAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call backend API to mint certificate
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/api/certificates/mint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${req.headers.authorization?.replace("Bearer ", "")}`,
      },
      body: JSON.stringify({
        courseId,
        courseName,
        studentName,
        studentAddress,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to mint certificate");
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error minting certificate:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
