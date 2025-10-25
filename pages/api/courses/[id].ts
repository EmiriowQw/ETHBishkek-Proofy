import { NextApiRequest, NextApiResponse } from "next";
import { MockStorage } from "../_mockStorage";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Course ID is required" });
  }

  try {
    // Получаем курс из общего хранилища
    const course = MockStorage.courses.getById(id);

    if (!course) {
      // В реальном приложении - вызов бэкенда
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
      try {
        const response = await fetch(`${backendUrl}/api/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          return res.status(200).json(data);
        }
      } catch (error) {
        // Backend недоступен, используем mock данные
      }

      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error: any) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

