import React from "react";
import { Project, PullRequest } from "@/types";
import {
  ExternalLink,
  GitPullRequest,
  Check,
  Clock,
  Calendar,
  User,
  Code,
} from "lucide-react";
import Link from "next/link";

interface ProjectsProps {
  projects: Project[];
}

const PRStatusIcon = ({ status }: { status: PullRequest["status"] }) => {
  switch (status) {
    case "Merged":
      return <Check className="h-4 w-4 text-green-600" />;
    case "Open":
      return <GitPullRequest className="h-4 w-4 text-blue-600" />;
    case "Draft":
      return <Clock className="h-4 w-4 text-gray-600" />;
    default:
      return null;
  }
};

const ProjectCard = ({ project }: { project: Project }) => {
  const [activeTab, setActiveTab] = React.useState("overview");

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "challenges", label: "Challenges" },
    { value: "pullrequests", label: "Dev Timeline" },
  ];

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              {project.title}
            </h3>
            <div className="flex flex-wrap items-start mt-2 text-sm text-gray-600">
              <div className="flex items- mr-4 mb-1">
                <User className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{project.role}</span>
              </div>

              {project.timelineStart && project.timelineEnd && (
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>
                    {project.timelineStart} - {project.timelineEnd}
                  </span>
                </div>
              )}
            </div>
          </div>

          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0 self-start"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Project
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
            >
              <Code className="h-3 w-3 mr-1 flex-shrink-0" />
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {project.description}
            </p>

            {project.outcome && (
              <div className="mt-6 bg-gray-50 p-5 rounded-md border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Outcome</h4>
                <p className="text-gray-700">{project.outcome}</p>
              </div>
            )}

            {project.media && project.media.length > 0 && (
              <div className="mt-8">
                <h4 className="font-medium text-gray-800 mb-3 pb-2 border-b">
                  Project Media
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {project.media.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-md overflow-hidden border border-gray-200 bg-white"
                    >
                      {item.type === "image" ||
                      item.type === "diagram" ||
                      item.type === "workflow" ? (
                        <div className="relative h-full w-full overflow-hidden">
                          {item.url && !item.url.startsWith("blob:") ? (
                            <img
                              src={item.url}
                              alt={item.caption || `${project.title} media`}
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48 bg-gray-100 text-gray-500">
                              <p>Image unavailable</p>
                            </div>
                          )}
                        </div>
                      ) : item.type === "video" ? (
                        <div className="relative h-56 w-full overflow-hidden">
                          {item.url && !item.url.startsWith("blob:") ? (
                            <video
                              src={item.url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48 bg-gray-100 text-gray-500">
                              <p>Video unavailable</p>
                            </div>
                          )}
                        </div>
                      ) : null}
                      {item.caption && (
                        <div className="p-3 bg-white">
                          <p className="text-sm text-gray-600">
                            {item.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "challenges" && (
          <div>
            {project.challenges && project.challenges.length > 0 ? (
              <div className="space-y-6">
                {project.challenges.map((challenge, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-md border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h4 className="font-medium text-gray-800">
                        Challenge {index + 1}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Obstacle
                        </p>
                        <p className="text-sm text-gray-700">
                          {challenge.obstacle}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Approach
                        </p>
                        <p className="text-sm text-gray-700">
                          {challenge.approach}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Resolution
                        </p>
                        <p className="text-sm text-gray-700">
                          {challenge.resolution}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Lessons Learned
                        </p>
                        <p className="text-sm text-gray-700">
                          {challenge.lessonsLearned}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-md border border-gray-200">
                <Clock className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p>No challenges documented for this project.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "pullrequests" && (
          <div>
            {project.pullRequests && project.pullRequests.length > 0 ? (
              <div className="relative py-4">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>

                <div className="space-y-8">
                  {project.pullRequests.map((pr, index) => (
                    <div key={index} className="relative pl-16">
                      {/* Timeline node */}
                      <div
                        className={`absolute left-0 top-3 h-8 w-8 rounded-full border-2 border-white flex items-center justify-center ${
                          pr.status === "Merged"
                            ? "bg-green-100"
                            : pr.status === "Open"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <PRStatusIcon status={pr.status} />
                      </div>

                      {/* Date - positioned above the card */}
                      <div className="text-sm text-gray-500 font-medium mb-2">
                        {pr.date || "N/A"}
                      </div>

                      {/* PR Card */}
                      <div className="bg-white rounded-md border border-gray-200 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-800">
                            {pr.title}
                          </span>
                          <span
                            className={`ml-auto text-xs px-2 py-0.5 rounded-md ${
                              pr.status === "Merged"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : pr.status === "Open"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-gray-50 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {pr.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {pr.description}
                        </p>
                        {pr.link && (
                          <Link
                            href={pr.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                          >
                            <GitPullRequest className="h-3 w-3 mr-1" />
                            View Pull Request
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-md border border-gray-200">
                <GitPullRequest className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p>No pull requests documented for this project.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            No Projects Found
          </h3>
          <p className="text-gray-500">
            There are no projects to display at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="md:py-10 py-5 px-4 md:px-8">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          <span className="border-b-2 border-gray-800 pb-1">Projects</span>
        </h2>
        <p className="text-gray-600">
          Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
