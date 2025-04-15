import React, { useState, useRef } from "react";
import useFormStore from "@/store/useFormStore";
import { Project, PullRequest, Tickets, Docs } from "@/types";
import ProjectList from "@/components/form-steps/project-list";
import ProjectForm from "@/components/form-steps/project-form";
import ProjectModals from "@/components/form-steps/project-modal";
import useAuthStore from "@/store/auth";

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
    tickets: [],
    docs: [],
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
    tags: string[];
  }>({
    obstacle: "",
    approach: "",
    resolution: "",
    lessonsLearned: "",
    tags: [],
  });

  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [newJiraTicket, setNewJiraTicket] = useState<Tickets>({
    title: "",
    type: "Story",
    status: "Done",
    contribution: "",
    link: "",
  });
  const [showDocModal, setShowDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState<Docs>({
    documentTitle: "",
    purpose: "",
    contribution: "",
    tags: "",
    link: "",
  });

  // Modal handlers
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
        tickets: [],
        docs: [],
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

      // Get authenticated user
      const { user } = useAuthStore.getState();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create a FormData object for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "internfolio"); // Replace with your Cloudinary upload preset
      formData.append("folder", `interfolio/${user.id}`);

      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dxhwhhakx/image/upload", // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        throw new Error(
          `Cloudinary upload failed: ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const cloudinaryData = await cloudinaryResponse.json();
      console.log("Cloudinary upload successful:", cloudinaryData);

      // Update media with the permanent Cloudinary URL
      setNewMedia((prev) => ({
        ...prev,
        url: cloudinaryData.secure_url, // This is the permanent URL
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
        tags: [],
      });
      setShowChallengeModal(false);
    }
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

  const openDocsModal = (projectIndex: number) => {
    setCurrentProjectIndex(projectIndex);
    setShowDocModal(true);
  };

  const handleAddDocs = (projectIndex: number) => {
    if (newDoc.documentTitle && newDoc.contribution) {
      const updatedProjects = [...projects];
      if (!updatedProjects[projectIndex].docs) {
        updatedProjects[projectIndex].docs = [];
      }
      updatedProjects[projectIndex].docs!.push(newDoc);

      useFormStore.getState().updateProject(projectIndex, {
        docs: updatedProjects[projectIndex].docs,
      });

      setNewDoc({
        documentTitle: "",
        purpose: "",
        contribution: "",
        tags: "",
        link: "",
      });
      setShowDocModal(false);
    }
  };

  const removeDocs = (projectIndex: number, docIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].docs = updatedProjects[
      projectIndex
    ].docs!.filter((_, i) => i !== docIndex);

    useFormStore.getState().updateProject(projectIndex, {
      docs: updatedProjects[projectIndex].docs,
    });
  };


  const openJiraModal = (projectIndex: number) => {
    setCurrentProjectIndex(projectIndex);
    setShowJiraModal(true);
  };

  // Add this handler function
  const handleAddJiraTicket = (projectIndex: number) => {
    if (newJiraTicket.title && newJiraTicket.contribution) {
      const updatedProjects = [...projects];
      if (!updatedProjects[projectIndex].tickets) {
        updatedProjects[projectIndex].tickets = [];
      }
      updatedProjects[projectIndex].tickets!.push(newJiraTicket);

      useFormStore.getState().updateProject(projectIndex, {
        tickets: updatedProjects[projectIndex].tickets,
      });

      setNewJiraTicket({
        title: "",
        type: "Story",
        status: "Done",
        contribution: "",
        link: "",
      });
      setShowJiraModal(false);
    }
  };

  const removeJiraTicket = (projectIndex: number, ticketIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].tickets = updatedProjects[
      projectIndex
    ].tickets!.filter((_, i) => i !== ticketIndex);

    useFormStore.getState().updateProject(projectIndex, {
      tickets: updatedProjects[projectIndex].tickets,
    });
  };

  return (
    <div>
      {/* List of existing projects */}
      <ProjectList
        projects={projects}
        removeProject={removeProject}
        removePR={removePR}
        removeMedia={removeMedia}
        removeChallenge={removeChallenge}
        openPRModal={openPRModal}
        openMediaModal={openMediaModal}
        openChallengeModal={openChallengeModal}
        removeJiraTicket={removeJiraTicket}
        openJiraModal={openJiraModal}
        removeDocs={removeDocs}
        openDocsModal={openDocsModal}
      />

      {/* Add new project form */}
      <ProjectForm
        newProject={newProject}
        setNewProject={setNewProject}
        techInput={techInput}
        setTechInput={setTechInput}
        handleAddTech={handleAddTech}
        handleSubmitProject={handleSubmitProject}
      />

      {/* Modals */}
      <ProjectModals
        showPRModal={showPRModal}
        showMediaModal={showMediaModal}
        showChallengeModal={showChallengeModal}
        showTagDropdown={showTagDropdown}
        setShowTagDropdown={setShowTagDropdown}
        setShowPRModal={setShowPRModal}
        setShowMediaModal={setShowMediaModal}
        setShowChallengeModal={setShowChallengeModal}
        currentProjectIndex={currentProjectIndex}
        newPR={newPR}
        setNewPR={setNewPR}
        newMedia={newMedia}
        setNewMedia={setNewMedia}
        newChallenge={newChallenge}
        setNewChallenge={setNewChallenge}
        handleAddPR={handleAddPR}
        handleAddMedia={handleAddMedia}
        handleAddChallenge={handleAddChallenge}
        handleFileChange={handleFileChange}
        toggleMediaInputType={toggleMediaInputType}
        fileInputRef={fileInputRef}
        isUploading={isUploading}
        showJiraModal={showJiraModal}
        setShowJiraModal={setShowJiraModal}
        newJiraTicket={newJiraTicket}
        setNewJiraTicket={setNewJiraTicket}
        handleAddJiraTicket={handleAddJiraTicket}
        showDocModal={showDocModal}
        setShowDocModal={setShowJiraModal}
        newDoc={newDoc}
        setNewDoc={setNewDoc}
        handleAddDocs={handleAddDocs}
      />
    </div>
  );
};

export default Projects;
