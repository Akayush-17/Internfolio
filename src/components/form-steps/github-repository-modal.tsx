import React from "react";
import { GitHubRepository } from "@/types";
import GitHubRepositoryCard from "./github-repository-card";

interface GitHubRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositories: GitHubRepository[];
  onSelectRepository: (repo: GitHubRepository) => void;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const GitHubRepositoryModal: React.FC<GitHubRepositoryModalProps> = ({
  isOpen,
  onClose,
  repositories,
  onSelectRepository,
  isLoading,
  searchTerm,
  onSearchChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Select a Repository</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-180px)] p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading repository details...</span>
            </div>
          )}
          
          {!isLoading && repositories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No repositories found. Try adjusting your search.
            </div>
          )}

          {!isLoading && repositories.map((repo) => (
            <GitHubRepositoryCard
              key={repo.id}
              repo={repo}
              onClick={onSelectRepository}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubRepositoryModal;

