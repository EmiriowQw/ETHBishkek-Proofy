import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  order: number;
}

export default function CreateCourse() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Course form state
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New lesson state
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDescription, setNewLessonDescription] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const addLesson = () => {
    if (!newLessonTitle || !newLessonContent) {
      toast.error("Please fill in lesson title and content");
      return;
    }

    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: newLessonTitle,
      description: newLessonDescription,
      content: newLessonContent,
      order: lessons.length + 1,
    };

    setLessons([...lessons, newLesson]);
    setNewLessonTitle("");
    setNewLessonDescription("");
    setNewLessonContent("");
    setShowLessonForm(false);
    toast.success("Lesson added!");
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
    toast.success("Lesson removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseTitle || !courseDescription) {
      toast.error("Please fill in all course details");
      return;
    }

    if (lessons.length === 0) {
      toast.error("Please add at least one lesson");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creating course...", { id: "create-course" });

    try {
      // TODO: Call backend API to create course
      const response = await fetch("/api/courses/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDescription,
          duration: courseDuration,
          lessons: lessons,
          creatorAddress: address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      toast.success("Course created successfully!", { id: "create-course" });
      router.push("/my-courses");
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast.error(error.message || "Failed to create course", { id: "create-course" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to create a course
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Proofy</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-primary-600"
            >
              ← Back to Dashboard
            </button>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Course
          </h2>
          <p className="text-gray-600">
            Fill in the details and add lessons to your course
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Details */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Course Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g., Web3 Development Fundamentals"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Describe what students will learn in this course..."
                  rows={4}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (optional)
                </label>
                <input
                  type="text"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  placeholder="e.g., 4 weeks"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Lessons ({lessons.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowLessonForm(!showLessonForm)}
                className="btn-primary text-sm"
              >
                {showLessonForm ? "Cancel" : "➕ Add Lesson"}
              </button>
            </div>

            {/* Add Lesson Form */}
            {showLessonForm && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="e.g., Introduction to Smart Contracts"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newLessonDescription}
                    onChange={(e) => setNewLessonDescription(e.target.value)}
                    placeholder="Brief description of the lesson"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    value={newLessonContent}
                    onChange={(e) => setNewLessonContent(e.target.value)}
                    placeholder="Write your lesson content here..."
                    rows={6}
                    className="input"
                  />
                </div>

                <button
                  type="button"
                  onClick={addLesson}
                  className="btn-primary w-full"
                >
                  Add Lesson
                </button>
              </div>
            )}

            {/* Lessons List */}
            {lessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No lessons added yet. Click "Add Lesson" to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                          Lesson {index + 1}
                        </span>
                        <h4 className="font-semibold text-gray-900">
                          {lesson.title}
                        </h4>
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {lesson.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {lesson.content.substring(0, 100)}...
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLesson(lesson.id)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || lessons.length === 0}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

