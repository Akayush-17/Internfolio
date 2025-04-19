import React, { useState } from "react";
import { Project, PullRequest } from "@/types";
import {
  GitPullRequest,
  Check,
  Clock,
  Calendar,
  User,
  Code,
  ExternalLink,
  Tags,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
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

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandMedia, setExpandMedia] = useState(false);

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

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "pullrequests", label: "Dev Timeline" },
    { value: "challenges", label: "Challenges" },
  ];

  const toggleProject = (index: number) => {
    if (expandedProject === index) {
      setExpandedProject(null);
      setActiveTab("overview");
    } else {
      setExpandedProject(index);
      setActiveTab("overview");
    }
  };

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

      {/* Grid Layout for Collapsed Project Cards */}
      {expandedProject === null && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              onClick={() => toggleProject(index)}
            >
              {/* Project Preview Card */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {project.title}
                  </h3>
                  <Maximize2 className="h-5 w-5 text-blue-700" />
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {project.description}
                </p>

                {project.timelineStart && project.timelineEnd && (
                  <div className="flex items-center mb-3 text-xs">
                    <Calendar className="h-3 w-3 mr-1 flex-shrink-0 text-blue-600" />
                    <span className="font-medium text-gray-700">
                      {project.timelineStart} - {project.timelineEnd}
                    </span>
                  </div>
                )}

                {/* Role */}
                <div className="flex items-center mb-4 text-xs">
                  <User className="h-3 w-3 mr-1 flex-shrink-0 text-gray-600" />
                  <span className="text-gray-700 line-clamp-1">
                    {project.role}
                  </span>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 mt-auto">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Preview Media */}
              {project.media && project.media.length > 0 && (
                <div className="h-40 w-full border-t border-gray-100 relative overflow-hidden bg-gray-50">
                  <div className="grid grid-cols-2 h-full gap-3">
                    {project.media.slice(0, 2).map((media, index) => (
                      <div key={index} className="relative">
                        {media.url && !media.url.startsWith("blob:") ? (
                          media.type === "video" ? (
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={media.url}
                              alt={media.caption || `${project.title} media`}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                            <p>Preview unavailable</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {project.media.length > 2 && (
                    <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                      +{project.media.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Expanded Project View */}
      {expandedProject !== null && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden">
          {/* Header with close button */}
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <div className="flex flex-col justify-between items-start">
              <div className="flex flex-row justify-between w-full">
                <h3 className="text-xl font-semibold text-gray-800">
                  {projects[expandedProject].title}
                </h3>
                <div className="flex items-center gap-3">
                  {projects[expandedProject].link && (
                    <Link
                      href={projects[expandedProject].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Project
                    </Link>
                  )}
                  <button
                    onClick={() => toggleProject(expandedProject)}
                    className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-start mt-2 gap-3 text-sm text-gray-600">
                <p className="text-gray-700 leading-relaxed">
                  {projects[expandedProject].description}
                </p>

                {projects[expandedProject].timelineStart &&
                  projects[expandedProject].timelineEnd && (
                    <div className="flex items-center mb-1">
                      <Calendar
                        color={"#155dfc"}
                        className="h-4 w-4 mr-1 flex-shrink-0"
                      />
                      <span className="font-semibold text-blue-600">
                        {projects[expandedProject].timelineStart} -{" "}
                        {projects[expandedProject].timelineEnd}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {projects[expandedProject].technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                >
                  <Code className="h-3 w-3 mr-1 flex-shrink-0" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.value
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    {tab.label}

                    {/* Blinking dot for inactive tabs (except the active one) */}
                    {activeTab !== tab.value && (
                      <span className="ml-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </div>

                  {activeTab === tab.value && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-start mr-4 mb-2">
                  <User className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{projects[expandedProject].role}</span>
                </div>

                {projects[expandedProject].outcome && (
                  <div className="mt-6 bg-green-50 p-5 rounded-md border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">Outcome</h4>
                    <p className="text-gray-700">
                      {projects[expandedProject].outcome}
                    </p>
                  </div>
                )}
                {projects[expandedProject].docs &&
                  projects[expandedProject].docs.length > 0 && (
                    <div className="mt-10">
                      <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Linked Documents
                      </h2>

                      <div className="flex flex-wrap gap-6">
                        {projects[expandedProject].docs.map((doc, index) => (
                          <a
                            href={doc.link}
                            target="_blank"
                            key={index}
                            className="relative w-[100px] md:w-[150px]"
                          >
                            {/* Document Image */}
                            <div className="w-full md:h-[180px] h-[120px] rounded-md shadow-md overflow-hidden relative bg-blue-100">
                              <img
                                src="/document.png"
                                alt="Document"
                                className="w-full h-full object-contain"
                              />

                              {/* Tag (optional) */}
                              {doc.tags && (
                                <div className="absolute md:top-2 md:left-2 left-1 top-[75%] bg-white/80 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 text-gray-700">
                                  <Tags className="w-3 h-3" />
                                  {doc.tags}
                                </div>
                              )}

                              {/* Link (top-right) */}
                              {doc.link && (
                                <div className="absolute md:top-2 md:right-2 top-1 right-1 bg-white text-blue-600 p-1 rounded-full shadow hover:bg-blue-50 transition">
                                  <ExternalLink className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* Document Info */}
                            <div className="mt-2 text-center">
                              <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                                {doc.documentTitle}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {doc.purpose}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {projects[expandedProject].media &&
                  projects[expandedProject].media.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-medium text-gray-800 mb-3 pb-2 border-b flex justify-between items-center">
                        <span>Project Media</span>
                        {projects[expandedProject].media.length > 3 && (
                          <button
                            onClick={() => setExpandMedia(!expandMedia)}
                            className="text-sm text-blue-600 font-normal hover:underline md:flex items-center hidden"
                          >
                            {expandMedia ? (
                              <>
                                Show Less <ChevronUp className="h-4 w-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Show All (
                                {projects[expandedProject].media.length}){" "}
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </>
                            )}
                          </button>
                        )}
                      </h4>

                      {/* Mobile Swipeable Carousel */}
                      <div className="md:hidden relative">
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
                          {projects[expandedProject].media.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="snap-center flex-shrink-0 w-4/5 rounded-md overflow-hidden border border-gray-200 bg-white"
                              >
                                {item.type === "image" ||
                                item.type === "diagram" ||
                                item.type === "workflow" ? (
                                  <div className="relative w-full overflow-hidden">
                                    {item.url &&
                                    !item.url.startsWith("blob:") ? (
                                      <img
                                        src={item.url}
                                        alt={
                                          item.caption ||
                                          `${projects[expandedProject].title} media`
                                        }
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-48 bg-gray-100 text-gray-500">
                                        <p>Image unavailable</p>
                                      </div>
                                    )}
                                  </div>
                                ) : item.type === "video" ? (
                                  <div className="relative w-full overflow-hidden">
                                    {item.url &&
                                    !item.url.startsWith("blob:") ? (
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
                            )
                          )}
                        </div>
                      </div>

                      {/* Desktop Grid Layout */}
                      <div className="hidden md:grid grid-cols-3 gap-6 mt-4">
                        {projects[expandedProject].media
                          .slice(
                            0,
                            expandMedia
                              ? projects[expandedProject].media.length
                              : Math.min(
                                  3,
                                  projects[expandedProject].media.length
                                )
                          )
                          .map((item, index) => (
                            <div
                              key={index}
                              className="rounded-md overflow-hidden border border-gray-200 bg-white"
                            >
                              {item.type === "image" ||
                              item.type === "diagram" ||
                              item.type === "workflow" ? (
                                <div className="relative w-full overflow-hidden">
                                  {item.url && !item.url.startsWith("blob:") ? (
                                    <img
                                      src={item.url}
                                      alt={
                                        item.caption ||
                                        `${projects[expandedProject].title} media`
                                      }
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-48 bg-gray-100 text-gray-500">
                                      <p>Image unavailable</p>
                                    </div>
                                  )}
                                </div>
                              ) : item.type === "video" ? (
                                <div className="relative w-full overflow-hidden">
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
                {projects[expandedProject].challenges &&
                projects[expandedProject].challenges.length > 0 ? (
                  <div className="space-y-6">
                    {projects[expandedProject].challenges.map(
                      (challenge, index) => (
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
                            {challenge.lessonsLearned && (
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                  Lessons Learned
                                </p>
                                <p className="text-sm text-gray-700">
                                  {challenge.lessonsLearned}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
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
                {projects[expandedProject].pullRequests &&
                projects[expandedProject].pullRequests.length > 0 ? (
                  <div className="relative py-4">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>

                    <div className="space-y-8">
                      {projects[expandedProject].pullRequests.map(
                        (pr, index) => (
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
                                  {pr.link.toLowerCase().includes("commit")
                                    ? "View Commit"
                                    : "View Pull Request"}
                                </Link>
                              )}
                            </div>
                          </div>
                        )
                      )}
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
      )}
    </section>
  );
};

export default Projects;
