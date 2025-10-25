import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    console.log(`📤 Proxying to Backend: Fetching courses for ${address}`);

    // Получаем курсы из Backend
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const backendResponse = await fetch(`${backendUrl}/api/courses/my-courses?address=${address}`);

    const backendData = await backendResponse.json();

    console.log(`✅ Backend Response: Found ${backendData.courses?.length || 0} courses`);

    if (!backendResponse.ok) {
      throw new Error(backendData.error || "Backend request failed");
    }

    res.status(200).json({
      success: true,
      courses: backendData.courses || [],
    });
  } catch (error: any) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

