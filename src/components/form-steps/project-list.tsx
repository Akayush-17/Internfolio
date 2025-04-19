import React from "react";
import { Project } from "@/types";

interface ProjectListProps {
  projects: Project[];
  removeProject: (index: number) => void;
  removePR: (projectIndex: number, prIndex: number) => void;
  removeMedia: (projectIndex: number, mediaIndex: number) => void;
  removeChallenge: (projectIndex: number, challengeIndex: number) => void;
  removeJiraTicket: (projectIndex: number, ticketIndex: number) => void;
  removeDocs: (projectIndex: number, docIndex: number) => void;
  openPRModal: (projectIndex: number) => void;
  openMediaModal: (projectIndex: number) => void;
  openChallengeModal: (projectIndex: number) => void;
  openJiraModal: (projectIndex: number) => void;
  openDocsModal: (projectIndex: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  removeProject,
  removePR,
  removeMedia,
  removeChallenge,
  removeJiraTicket,
  openPRModal,
  openMediaModal,
  openChallengeModal,
  openJiraModal,
  openDocsModal,
  removeDocs,
}) => {
  const [expandedProjects, setExpandedProjects] = React.useState<number[]>([]);

  const toggleProject = (index: number) => {
    setExpandedProjects((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (projects.length === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      <h3 className="text-lg font-medium">Your added projects:</h3>

      {projects.map((project, index) => (
        <div key={index} className="p-4 border border-gray-300 rounded-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleProject(index)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform ${
                    expandedProjects.includes(index) ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <h4 className="text-lg font-medium">{project.title}</h4>
            </div>
            <button
              onClick={() => removeProject(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          {expandedProjects.includes(index) && (
            <>
              <p className="mt-2 text-gray-700">{project.description}</p>

              <div className="mt-2">
                <span className="font-medium">Your Role: </span>
                <span>{project.role}</span>
              </div>

              {project.technologies.length > 0 && (
                <div className="mt-2">
                  <span className="font-medium">Tools Used: </span>
                  <span>{project.technologies.join(", ")}</span>
                </div>
              )}

              {project.outcome && (
                <div className="mt-2">
                  <span className="font-medium">Outcome / Impact: </span>
                  <span>{project.outcome}</span>
                </div>
              )}

              {(project.timelineStart || project.timelineEnd) && (
                <div className="mt-2">
                  <span className="font-medium">Timeline: </span>
                  <span>
                    {project.timelineStart && project.timelineEnd
                      ? `${project.timelineStart} → ${project.timelineEnd}`
                      : project.timelineStart || project.timelineEnd}
                  </span>
                </div>
              )}

              {project.link && (
                <div className="mt-2">
                  <span className="font-medium">Link: </span>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {project.link}
                  </a>
                </div>
              )}

              {/* Media section */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Media:</h5>
                  <button
                    onClick={() => openMediaModal(index)}
                    className="px-2 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add Media
                  </button>
                </div>

                {project.media && project.media.length > 0 ? (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.media.map((media, mediaIndex) => (
                      <div
                        key={mediaIndex}
                        className="p-2 border border-gray-200 rounded-md"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{media.type}</span>
                          <button
                            onClick={() => removeMedia(index, mediaIndex)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                        {media.isUpload ? (
                          <div>
                            <p className="text-sm text-gray-600">
                              {media.file
                                ? `Uploaded: ${media.file.name}`
                                : "File uploaded"}
                            </p>
                            {media.url && media.type === "image" && (
                              <div className="mt-1">
                                <img
                                  src={media.url}
                                  alt={media.caption || "Uploaded image"}
                                  className="max-h-32 rounded-md w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View {media.type}
                          </a>
                        )}
                        {media.caption && (
                          <p className="text-sm text-gray-700 mt-1">
                            {media.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    No media added yet
                  </p>
                )}
              </div>

              {/* Challenges section */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Challenges:</h5>
                  <button
                    onClick={() => openChallengeModal(index)}
                    className="px-2 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add Challenge
                  </button>
                </div>

                {project.challenges && project.challenges.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {project.challenges.map((challenge, challengeIndex) => (
                      <div
                        key={challengeIndex}
                        className="p-2 border border-gray-200 rounded-md"
                      >
                        <div className="flex justify-between">
                          <div className="gap-4 flex">
                            <span className="font-medium mr-10">Challenge</span>
                            {challenge.tags &&
                              challenge.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className={`px-1 text-[10px] rounded-md bg-blue-50 flex justify-center items-center`}
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                          <button
                            onClick={() =>
                              removeChallenge(index, challengeIndex)
                            }
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-sm">
                          <p>
                            <strong>Obstacle:</strong> {challenge.obstacle}
                          </p>
                          <p>
                            <strong>Approach:</strong> {challenge.approach}
                          </p>
                          <p>
                            <strong>Resolution:</strong> {challenge.resolution}
                          </p>
                          {challenge.lessonsLearned && (
                            <p>
                              <strong>Lessons Learned:</strong>{" "}
                              {challenge.lessonsLearned}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    No challenges added yet
                  </p>
                )}
              </div>

              {/* Pull Requests section */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Pull Requests:</h5>
                  <button
                    onClick={() => openPRModal(index)}
                    className="px-2 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add PR
                  </button>
                </div>

                {project.pullRequests && project.pullRequests.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {project.pullRequests.map((pr, prIndex) => (
                      <div
                        key={prIndex}
                        className="p-2 border border-gray-200 rounded-md"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{pr.title}</span>
                          <div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                pr.status === "Merged"
                                  ? "bg-green-100 text-green-800"
                                  : pr.status === "Draft"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {pr.status}
                            </span>
                            <button
                              onClick={() => removePR(index, prIndex)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {pr.description}
                        </p>
                        {pr.link && (
                          <a
                            href={pr.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View PR
                          </a>
                        )}
                        {pr.date && (
                          <div className="text-xs text-gray-500 mt-1">
                            Date: {pr.date}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    No pull requests added yet
                  </p>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium">Tickets</h4>
                  <button
                    onClick={() => openJiraModal(index)}
                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    + Add Ticket
                  </button>
                </div>
                {project.tickets && project.tickets.length > 0 ? (
                  <div className="space-x-2 space-y-2 grid grid-cols-1 md:grid-cols-2">
                    {project.tickets.map((ticket, ticketIndex) => (
                      <div
                        key={ticketIndex}
                        className="bg-gray-50 p-3 rounded-md"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium">{ticket.title}</h5>
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                {ticket.type}
                              </span>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                {ticket.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {ticket.contribution}
                            </p>
                            {ticket.link && (
                              <a
                                href={ticket.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                              >
                                View Ticket →
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => removeJiraTicket(index, ticketIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No tickets added yet.
                  </p>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium">Docs</h4>
                  <button
                    onClick={() => openDocsModal(index)}
                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    + Add Docs
                  </button>
                </div>
                {project.docs && project.docs.length > 0 ? (
                  <div className="space-x-2 space-y-2 grid grid-cols-1 md:grid-cols-2">
                    {project.docs.map((docs, docIndex) => (
                      <div key={docIndex} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start space-x-2 mb-1">
                              <div className="flex flex-col gap-3">
                                <h5 className="font-medium">
                                  {docs.documentTitle}
                                </h5>
                                <h5 className="font-medium ">{docs.purpose}</h5>
                              </div>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                {docs.tags}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {docs.contribution}
                            </p>
                            {docs.link && (
                              <a
                                href={docs.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                              >
                                View Ticket →
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => removeDocs(index, docIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No Documents added yet.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
