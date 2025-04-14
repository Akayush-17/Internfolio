import React, { useState, useRef } from "react";
import useFormStore from "@/store/useFormStore";
import { Project, PullRequest } from "@/types";
import Image from "next/image";
import useAuthStore, { supabase } from "@/store/auth";

const Projects: React.FC = () => {
  const { formData, addProject, removeProject, addPR, removePR } =
    useFormStore();
  const { projects } = formData;

  const [newProject, setNewProject] = useState<Project>({
    title: "",
    description: "",
    role: "",
    technologies: [],
    outcome: "",
    timelineStart: "",
    timelineEnd: "",
    link: "",
    pullRequests: [],
    media: [],
    challenges: [],
  });

  const [techInput, setTechInput] = useState("");
  const [showPRModal, setShowPRModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number | null>(
    null
  );
  const [newPR, setNewPR] = useState<PullRequest>({
    title: "",
    description: "",
    link: "",
    status: "Open",
    date: "",
  });

  const [newMedia, setNewMedia] = useState<{
    type: "image" | "diagram" | "workflow" | "video";
    url: string;
    file?: File;
    caption: string;
    isUpload: boolean;
  }>({
    type: "image",
    url: "",
    file: undefined,
    caption: "",
    isUpload: false,
  });

  const [newChallenge, setNewChallenge] = useState<{
    obstacle: string;
    approach: string;
    resolution: string;
    lessonsLearned: string;
  }>({
    obstacle: "",
    approach: "",
    resolution: "",
    lessonsLearned: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddTech = () => {
    if (techInput.trim()) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleSubmitProject = () => {
    if (newProject.title && newProject.description && newProject.role) {
      addProject(newProject);
      setNewProject({
        title: "",
        description: "",
        role: "",
        technologies: [],
        outcome: "",
        timelineStart: "",
        timelineEnd: "",
        link: "",
        pullRequests: [],
        media: [],
        challenges: [],
      });
    }
  };

  const handleAddPR = (projectIndex: number) => {
    if (newPR.title && newPR.description) {
      addPR(projectIndex, newPR);
      setNewPR({
        title: "",
        description: "",
        link: "",
        status: "Open",
        date: "",
      });
      setShowPRModal(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      // Create a local preview URL for immediate feedback
      const localPreviewUrl = URL.createObjectURL(file);

      // Update state with local preview while upload happens
      setNewMedia({
        ...newMedia,
        file,
        url: localPreviewUrl, // Temporary URL for preview
        isUpload: true,
      });

      // Upload to Supabase
      const { user } = useAuthStore.getState();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create unique filename to prevent collisions
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`;

      // First check if the bucket exists
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();

      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError);
        // Continue with local URL only
        console.log(
          "Using local file preview only due to bucket listing error"
        );
        return;
      }

      // Check if our target bucket exists
      const bucketName = "interfolio";
      const bucketExists = buckets.some((b) => b.name === bucketName);

      if (!bucketExists) {
        console.warn(`Bucket '${bucketName}' does not exist. Creating it...`);

        try {
          // Try to create the bucket
          const { data: newBucket, error: createError } =
            await supabase.storage.createBucket(bucketName, {
              public: true,
            });

          if (createError) {
            console.error("Failed to create bucket:", createError);
            // Continue with local URL only
            console.log(
              "Using local file preview only due to bucket creation error"
            );
            return;
          }

          console.log("Successfully created bucket:", newBucket);
        } catch (bucketCreateError) {
          console.error("Error creating bucket:", bucketCreateError);
          // Continue with local URL only
          console.log(
            "Using local file preview only due to bucket creation error"
          );
          return;
        }
      }

      // Now try to upload to the bucket
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error.message, error);

        // Show a more specific error message to the user
        if (error.message.includes("security policy")) {
          alert(
            "Upload failed due to permission issues. Please check if you're logged in."
          );
        } else {
          alert(`Upload failed: ${error.message}`);
        }

        // Continue with local URL only
        console.log("Using local file preview only due to upload error");
        return;
      }

      console.log("Upload successful, data:", data);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      console.log("Public URL:", urlData.publicUrl);

      // Update media with the permanent Supabase URL
      setNewMedia((prev) => ({
        ...prev,
        url: urlData.publicUrl, // This is the permanent URL
      }));
    } catch (error) {
      // Improved error logging
      if (error instanceof Error) {
        console.error("Error uploading file:", error.message, error);
        alert(`Upload failed: ${error.message}`);
      } else {
        console.error("Unknown error uploading file:", error);
        alert("Upload failed due to an unknown error");
      }
      // Keep the local preview URL if upload fails
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMedia = (projectIndex: number) => {
    // Only allow adding if we have a URL and it's not currently uploading
    if (
      !isUploading &&
      ((newMedia.isUpload && newMedia.url) ||
        (!newMedia.isUpload && newMedia.url))
    ) {
      const updatedProjects = [...projects];
      if (!updatedProjects[projectIndex].media) {
        updatedProjects[projectIndex].media = [];
      }

      // Create a copy with all required fields explicitly set
      const mediaToAdd = {
        type: newMedia.type,
        url: newMedia.url || "", // This should now be the Supabase URL for uploads
        caption: newMedia.caption || "",
        isUpload: newMedia.isUpload,
      };

      updatedProjects[projectIndex].media!.push(mediaToAdd);

      useFormStore.getState().updateProject(projectIndex, {
        media: updatedProjects[projectIndex].media,
      });

      setNewMedia({
        type: "image",
        url: "",
        file: undefined,
        caption: "",
        isUpload: false,
      });
      setShowMediaModal(false);
    }
  };

  const handleAddChallenge = (projectIndex: number) => {
    if (
      newChallenge.obstacle &&
      newChallenge.approach &&
      newChallenge.resolution
    ) {
      const updatedProjects = [...projects];
      if (!updatedProjects[projectIndex].challenges) {
        updatedProjects[projectIndex].challenges = [];
      }
      updatedProjects[projectIndex].challenges!.push(newChallenge);

      useFormStore.getState().updateProject(projectIndex, {
        challenges: updatedProjects[projectIndex].challenges,
      });

      setNewChallenge({
        obstacle: "",
        approach: "",
        resolution: "",
        lessonsLearned: "",
      });
      setShowChallengeModal(false);
    }
  };

  const openPRModal = (projectIndex: number) => {
    setCurrentProjectIndex(projectIndex);
    setShowPRModal(true);
  };

  const openMediaModal = (projectIndex: number) => {
    setCurrentProjectIndex(projectIndex);
    setShowMediaModal(true);
  };

  const openChallengeModal = (projectIndex: number) => {
    setCurrentProjectIndex(projectIndex);
    setShowChallengeModal(true);
  };

  const removeMedia = (projectIndex: number, mediaIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].media = updatedProjects[
      projectIndex
    ].media!.filter((_, i) => i !== mediaIndex);

    useFormStore.getState().updateProject(projectIndex, {
      media: updatedProjects[projectIndex].media,
    });
  };

  const removeChallenge = (projectIndex: number, challengeIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].challenges = updatedProjects[
      projectIndex
    ].challenges!.filter((_, i) => i !== challengeIndex);

    useFormStore.getState().updateProject(projectIndex, {
      challenges: updatedProjects[projectIndex].challenges,
    });
  };

  const toggleMediaInputType = () => {
    setNewMedia({
      ...newMedia,
      isUpload: !newMedia.isUpload,
      url: "",
      file: undefined,
    });
  };

  return (
    <div>
      {/* List of existing projects */}
      {projects.length > 0 && (
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-medium">Your added projects:</h3>

          {projects.map((project, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-md">
              <div className="flex justify-between">
                <h4 className="text-lg font-medium">{project.title}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
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
                  <div className="mt-2 space-y-2">
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
                                <Image
                                  src={media.url}
                                  alt={media.caption || "Uploaded image"}
                                  className="max-h-32 rounded-md"
                                  width={100}
                                  height={100}
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <a
                            href={media.url}
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
                          <span className="font-medium">Challenge</span>
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
            </div>
          ))}
        </div>
      )}

      {/* Add new project form */}
      <div className="p-4 border border-gray-300 rounded-md">
        <h3 className="mb-4 text-lg font-medium">Add a new project</h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="project-title"
              className="block mb-1 font-medium text-gray-700"
            >
              Project Title
            </label>
            <input
              id="project-title"
              type="text"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="block mb-1 font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="project-description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What the project was..."
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="project-role"
              className="block mb-1 font-medium text-gray-700"
            >
              Your Role
            </label>
            <textarea
              id="project-role"
              value={newProject.role}
              onChange={(e) =>
                setNewProject({ ...newProject, role: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What you did on this project..."
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="project-technologies"
              className="block mb-1 font-medium text-gray-700"
            >
              Tools Used (Optional)
            </label>
            <div className="flex">
              <input
                id="project-technologies"
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, etc."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {newProject.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newProject.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm text-white bg-blue-500 rounded-full"
                  >
                    {tech}
                    <button
                      type="button"
                      className="ml-1 font-bold"
                      onClick={() => {
                        setNewProject({
                          ...newProject,
                          technologies: newProject.technologies.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="project-outcome"
              className="block mb-1 font-medium text-gray-700"
            >
              Outcome / Impact (Optional)
            </label>
            <textarea
              id="project-outcome"
              value={newProject.outcome}
              onChange={(e) =>
                setNewProject({ ...newProject, outcome: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Reduced load time by 20%"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="timeline-start"
                className="block mb-1 font-medium text-gray-700"
              >
                Timeline Start (Optional)
              </label>
              <input
                id="timeline-start"
                type="date"
                value={newProject.timelineStart}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    timelineStart: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="timeline-end"
                className="block mb-1 font-medium text-gray-700"
              >
                Timeline End (Optional)
              </label>
              <input
                id="timeline-end"
                type="date"
                value={newProject.timelineEnd}
                onChange={(e) =>
                  setNewProject({ ...newProject, timelineEnd: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="project-link"
              className="block mb-1 font-medium text-gray-700"
            >
              Project Link (Optional)
            </label>
            <input
              id="project-link"
              type="url"
              value={newProject.link}
              onChange={(e) =>
                setNewProject({ ...newProject, link: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/yourusername/project"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmitProject}
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
            disabled={
              !newProject.title || !newProject.description || !newProject.role
            }
          >
            Add Project
          </button>
        </div>
      </div>

      {/* PR Modal */}
      {showPRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Pull Request</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  PR Title
                </label>
                <input
                  type="text"
                  value={newPR.title}
                  onChange={(e) =>
                    setNewPR({ ...newPR, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fix navigation bug"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newPR.description}
                  onChange={(e) =>
                    setNewPR({ ...newPR, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What this PR accomplished..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  PR Link (Optional)
                </label>
                <input
                  type="url"
                  value={newPR.link}
                  onChange={(e) => setNewPR({ ...newPR, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/org/repo/pull/123"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={newPR.status}
                  onChange={(e) =>
                    setNewPR({
                      ...newPR,
                      status: e.target.value as
                        | "Draft"
                        | "Open"
                        | "Merged"
                        | "Closed",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Open">Open</option>
                  <option value="Merged">Merged</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Date (Optional)
                </label>
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
                  onClick={() =>
                    currentProjectIndex !== null &&
                    handleAddPR(currentProjectIndex)
                  }
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!newPR.title || !newPR.description}
                >
                  Add PR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Media</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Media Type
                </label>
                <select
                  value={newMedia.type}
                  onChange={(e) =>
                    setNewMedia({
                      ...newMedia,
                      type: e.target.value as
                        | "image"
                        | "diagram"
                        | "workflow"
                        | "video",
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

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Input Method:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleMediaInputType}
                    className={`px-3 py-1 text-sm rounded-md ${
                      !newMedia.isUpload
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={toggleMediaInputType}
                    className={`px-3 py-1 text-sm rounded-md ${
                      newMedia.isUpload
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {newMedia.isUpload ? (
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Upload File
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {newMedia.file && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Selected: {newMedia.file.name}
                      </p>
                      {newMedia.url && (
                        <div className="mt-2 border border-gray-200 rounded-md p-2">
                          <img
                            src={newMedia.url}
                            alt="Preview"
                            className="max-h-40 mx-auto object-contain"
                            onError={(e) => {
                              console.error("Image failed to load", e);
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newMedia.url || ""}
                    onChange={(e) =>
                      setNewMedia({ ...newMedia, url: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {newMedia.url && newMedia.type === "image" && (
                    <div className="mt-2 border border-gray-200 rounded-md p-2">
                      <img
                        src={newMedia.url}
                        alt="Preview"
                        className="max-h-40 mx-auto object-contain"
                        onError={(e) => {
                          console.error("Image failed to load", e);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={newMedia.caption}
                  onChange={(e) =>
                    setNewMedia({ ...newMedia, caption: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the media"
                />
              </div>

              {isUploading && (
                <div className="my-2 text-center">
                  <p className="text-blue-600">Uploading file to Supabase...</p>
                  {/* You could add a spinner here */}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    currentProjectIndex !== null &&
                    handleAddMedia(currentProjectIndex)
                  }
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={
                    isUploading ||
                    (newMedia.isUpload && !newMedia.file) ||
                    (!newMedia.isUpload && !newMedia.url)
                  }
                >
                  {isUploading ? "Uploading..." : "Add Media"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Challenge</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Obstacle
                </label>
                <textarea
                  value={newChallenge.obstacle}
                  onChange={(e) =>
                    setNewChallenge({
                      ...newChallenge,
                      obstacle: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What challenge did you face?"
                  rows={2}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Approach
                </label>
                <textarea
                  value={newChallenge.approach}
                  onChange={(e) =>
                    setNewChallenge({
                      ...newChallenge,
                      approach: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How did you approach solving it?"
                  rows={2}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Resolution
                </label>
                <textarea
                  value={newChallenge.resolution}
                  onChange={(e) =>
                    setNewChallenge({
                      ...newChallenge,
                      resolution: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How was the challenge resolved?"
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
                      lessonsLearned: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What did you learn from this experience?"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowChallengeModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    currentProjectIndex !== null &&
                    handleAddChallenge(currentProjectIndex)
                  }
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={
                    !newChallenge.obstacle ||
                    !newChallenge.approach ||
                    !newChallenge.resolution
                  }
                >
                  Add Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
