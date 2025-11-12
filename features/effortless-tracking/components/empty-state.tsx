"use client";

interface EmptyStateProps {
  onCreateClick: () => void;
}

const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl mb-4">
          🎯
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Habits Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Start building better habits today! Create your first habit and begin
          your journey to self-improvement.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Your First Habit
      </button>
    </div>
  );
};

export default EmptyState;
