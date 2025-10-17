import React from 'react';
import Image from 'next/image';
import { PullRequest } from '@/types';

interface ProjectModalsProps {
  showPRModal: boolean;
  showMediaModal: boolean;
  showChallengeModal: boolean;
  setShowPRModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMediaModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChallengeModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentProjectIndex: number | null;
  newPR: PullRequest;
  setNewPR: React.Dispatch<React.SetStateAction<PullRequest>>;
  newMedia: {
    type: 'image' | 'diagram' | 'workflow' | 'video';
    url: string;
    file?: File;
    caption: string;
    isUpload: boolean;
  };
  setNewMedia: React.Dispatch<
    React.SetStateAction<{
      type: 'image' | 'diagram' | 'workflow' | 'video';
      url: string;
      file?: File;
      caption: string;
      isUpload: boolean;
    }>
  >;
  newChallenge: {
    obstacle: string;
    approach: string;
    resolution: string;
    lessonsLearned: string;
    tags: string[];
  };
  setNewChallenge: React.Dispatch<
    React.SetStateAction<{
      obstacle: string;
      approach: string;
      resolution: string;
      lessonsLearned: string;
      tags: string[];
    }>
  >;
  handleAddPR: (projectIndex: number) => void;
  handleAddMedia: (projectIndex: number) => void;
  handleAddChallenge: (projectIndex: number) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleMediaInputType: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  showTagDropdown: boolean;
  setShowTagDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  showJiraModal: boolean;
  setShowJiraModal: React.Dispatch<React.SetStateAction<boolean>>;
  newJiraTicket: {
    title: string;
    type: string;
    status: string;
    contribution: string;
    link: string;
  };
  setNewJiraTicket: React.Dispatch<
    React.SetStateAction<{
      title: string;
      type: string;
      status: string;
      contribution: string;
      link: string;
    }>
  >;
  handleAddJiraTicket: (projectIndex: number) => void;
  showDocModal: boolean;
  setShowDocModal: React.Dispatch<React.SetStateAction<boolean>>;
  newDoc: {
    documentTitle: string;
    purpose: string;
    contribution: string;
    tags?: string;
    link?: string;
  };
  setNewDoc: React.Dispatch<
    React.SetStateAction<{
      documentTitle: string;
      purpose: string;
      contribution: string;
      tags?: string;
      link?: string;
    }>
  >;
  handleAddDocs: (projectIndex: number) => void;
}

const ProjectModals: React.FC<ProjectModalsProps> = ({
  showPRModal,
  showMediaModal,
  showChallengeModal,
  setShowPRModal,
  setShowMediaModal,
  setShowChallengeModal,
  currentProjectIndex,
  newPR,
  setNewPR,
  newMedia,
  setNewMedia,
  newChallenge,
  setNewChallenge,
  handleAddPR,
  handleAddMedia,
  handleAddChallenge,
  handleFileChange,
  toggleMediaInputType,
  fileInputRef,
  isUploading,
  showTagDropdown,
  setShowTagDropdown,
  showJiraModal,
  setShowJiraModal,
  newJiraTicket,
  setNewJiraTicket,
  handleAddJiraTicket,
  showDocModal,
  setShowDocModal,
  handleAddDocs,
  newDoc,
  setNewDoc
}) => {
  const renderDocModal = () => {
    if (!showDocModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Add Document Created</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Document Title</label>
              <input
                type="text"
                value={newDoc.documentTitle}
                onChange={(e) => setNewDoc({ ...newDoc, documentTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Implement login functionality"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Purpose</label>
              <input
                type="text"
                value={newDoc.purpose}
                onChange={(e) => setNewDoc({ ...newDoc, purpose: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Implement login functionality"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Contribution</label>
              <input
                type="text"
                value={newDoc.contribution}
                onChange={(e) => setNewDoc({ ...newDoc, contribution: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Implement login functionality"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Tags (Optional)</label>
              <select
                value={newDoc.tags}
                onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Design">Design</option>
                <option value="Backend">Backend</option>
                <option value="Planning">Planning</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Link (Optional)</label>
              <input
                type="url"
                value={newDoc.link}
                onChange={(e) => setNewDoc({ ...newDoc, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourcompany.atlassian.net/browse/PROJ-123"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentProjectIndex !== null) {
                    handleAddDocs(currentProjectIndex);
                  }
                }}
                disabled={!newDoc.documentTitle || !newDoc.contribution}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTicketModal = () => {
    if (!showJiraModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Add Jira Ticket</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Title / Summary</label>
              <input
                type="text"
                value={newJiraTicket.title}
                onChange={(e) => setNewJiraTicket({ ...newJiraTicket, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Implement login functionality"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Type (Optional)</label>
              <select
                value={newJiraTicket.type}
                onChange={(e) => setNewJiraTicket({ ...newJiraTicket, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Story">Story</option>
                <option value="Bug">Bug</option>
                <option value="Task">Task</option>
                <option value="Feature">Feature</option>
                <option value="Epic">Epic</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Status</label>
              <select
                value={newJiraTicket.status}
                onChange={(e) => setNewJiraTicket({ ...newJiraTicket, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Contribution</label>
              <textarea
                value={newJiraTicket.contribution}
                onChange={(e) =>
                  setNewJiraTicket({ ...newJiraTicket, contribution: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your contribution to this ticket..."
                rows={2}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Link (Optional)</label>
              <input
                type="url"
                value={newJiraTicket.link}
                onChange={(e) => setNewJiraTicket({ ...newJiraTicket, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourcompany.atlassian.net/browse/PROJ-123"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowJiraModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentProjectIndex !== null) {
                    handleAddJiraTicket(currentProjectIndex);
                  }
                }}
                disabled={!newJiraTicket.title || !newJiraTicket.contribution}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Add Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // PR Modal
  const renderPRModal = () => {
    if (!showPRModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Add Pull Request</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">PR Title</label>
              <input
                type="text"
                value={newPR.title}
                onChange={(e) => setNewPR({ ...newPR, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Fix bug in login component"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Description</label>
              <textarea
                value={newPR.description}
                onChange={(e) => setNewPR({ ...newPR, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What this PR accomplishes..."
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">PR Link (Optional)</label>
              <input
                type="url"
                value={newPR.link}
                onChange={(e) => setNewPR({ ...newPR, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/org/repo/pull/123"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Status</label>
              <select
                value={newPR.status}
                onChange={(e) =>
                  setNewPR({
                    ...newPR,
                    status: e.target.value as 'Open' | 'Merged' | 'Draft'
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="Merged">Merged</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Date (Optional)</label>
              <input
                type="date"
                value={newPR.date}
                onChange={(e) => setNewPR({ ...newPR, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPRModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentProjectIndex !== null) {
                    handleAddPR(currentProjectIndex);
                  }
                }}
                disabled={!newPR.title || !newPR.description}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Add PR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Media Modal
  const renderMediaModal = () => {
    if (!showMediaModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Add Media</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Media Type</label>
              <select
                value={newMedia.type}
                onChange={(e) =>
                  setNewMedia({
                    ...newMedia,
                    type: e.target.value as 'image' | 'diagram' | 'workflow' | 'video'
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="image">Image</option>
                <option value="diagram">Diagram</option>
                <option value="workflow">Workflow</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-gray-700">
                  {newMedia.isUpload ? 'Upload File' : 'External URL'}
                </label>
                <button
                  type="button"
                  onClick={toggleMediaInputType}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {newMedia.isUpload ? 'Use external URL instead' : 'Upload file instead'}
                </button>
              </div>

              {newMedia.isUpload ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept={
                      newMedia.type === 'image'
                        ? 'image/*'
                        : newMedia.type === 'video'
                          ? 'video/*'
                          : '*/*'
                    }
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </button>
                    <span className="text-sm text-gray-600">
                      {newMedia.file ? newMedia.file.name : 'No file selected'}
                    </span>
                  </div>

                  {isUploading && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  )}

                  {newMedia.url && newMedia.type === 'image' && (
                    <div className="mt-2">
                      <Image
                        src={newMedia.url}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="max-h-40 object-contain rounded-md"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  value={newMedia.url}
                  onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Caption (Optional)</label>
              <input
                type="text"
                value={newMedia.caption}
                onChange={(e) => setNewMedia({ ...newMedia, caption: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this media..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentProjectIndex !== null) {
                    handleAddMedia(currentProjectIndex);
                  }
                }}
                disabled={isUploading || (!newMedia.url && !newMedia.file)}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Add Media
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Challenge Modal
  const renderChallengeModal = () => {
    if (!showChallengeModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Add Challenge</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Obstacle</label>
              <textarea
                value={newChallenge.obstacle}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    obstacle: e.target.value
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What challenge did you face?"
                rows={2}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Approach</label>
              <textarea
                value={newChallenge.approach}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    approach: e.target.value
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How did you approach solving it?"
                rows={2}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Resolution</label>
              <textarea
                value={newChallenge.resolution}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    resolution: e.target.value
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What was the outcome?"
                rows={2}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Lessons Learned (Optional)
              </label>
              <textarea
                value={newChallenge.lessonsLearned}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    lessonsLearned: e.target.value
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What did you learn from this experience?"
                rows={2}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Tags (Optional)</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                  onClick={() => setShowTagDropdown((prev) => !prev)}
                >
                  {newChallenge.tags.length > 0 ? newChallenge.tags.join(', ') : 'Select Tags'}
                </button>

                {showTagDropdown && (
                  <div className="absolute z-20 bg-white border border-gray-300 rounded-md bottom-full mb-1 w-full max-h-60 overflow-y-auto shadow-lg">
                    {['frontend', 'backend', 'team', 'time', 'infra'].map((tag) => (
                      <label
                        key={tag}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={newChallenge.tags.includes(tag)}
                          onChange={() => {
                            const updatedTags = newChallenge.tags.includes(tag)
                              ? newChallenge.tags.filter((t) => t !== tag)
                              : [...newChallenge.tags, tag];
                            setNewChallenge({
                              ...newChallenge,
                              tags: updatedTags
                            });
                          }}
                          className="mr-2 accent-blue-500"
                        />
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowChallengeModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentProjectIndex !== null) {
                    handleAddChallenge(currentProjectIndex);
                  }
                }}
                disabled={
                  !newChallenge.obstacle || !newChallenge.approach || !newChallenge.resolution
                }
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Add Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderPRModal()}
      {renderMediaModal()}
      {renderChallengeModal()}
      {renderTicketModal()}
      {renderDocModal()}
    </>
  );
};

export default ProjectModals;
