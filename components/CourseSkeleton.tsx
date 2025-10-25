import React from 'react';

export default function CourseSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gradient-to-br from-gray-300 to-gray-400 p-6 text-center h-48">
        <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-2"></div>
        <div className="w-20 h-6 bg-gray-400 rounded-full mx-auto"></div>
      </div>

      {/* Content skeleton */}
      <div className="p-6">
        {/* Title */}
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        
        {/* Description */}
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

        {/* Instructor */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Topics */}
        <div className="flex gap-1 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* Button */}
        <div className="h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
}

export function CourseSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <CourseSkeleton key={index} />
      ))}
    </div>
  );
}

