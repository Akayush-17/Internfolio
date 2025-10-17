import React from 'react';
import { Project } from '@/types';

interface ProjectFormProps {
  newProject: Project;
  setNewProject: React.Dispatch<React.SetStateAction<Project>>;
  techInput: string;
  setTechInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddTech: () => void;
  handleSubmitProject: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  newProject,
  setNewProject,
  techInput,
  setTechInput,
  handleAddTech,
  handleSubmitProject
}) => {
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="mb-4 text-lg font-medium">Add a new project</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="project-title" className="block mb-1 font-medium text-gray-700">
            Project Title
          </label>
          <input
            id="project-title"
            type="text"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My Awesome Project"
          />
        </div>

        <div>
          <label htmlFor="project-description" className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="project-description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What the project was..."
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="project-role" className="block mb-1 font-medium text-gray-700">
            Your Role
          </label>
          <textarea
            id="project-role"
            value={newProject.role}
            onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What you did on this project..."
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="project-technologies" className="block mb-1 font-medium text-gray-700">
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
                if (e.key === 'Enter') {
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
                <span key={index} className="px-2 py-1 text-sm text-white bg-blue-500 rounded-full">
                  {tech}
                  <button
                    type="button"
                    className="ml-1 font-bold"
                    onClick={() => {
                      setNewProject({
                        ...newProject,
                        technologies: newProject.technologies.filter((_, i) => i !== index)
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
          <label htmlFor="project-outcome" className="block mb-1 font-medium text-gray-700">
            Outcome / Impact (Optional)
          </label>
          <textarea
            id="project-outcome"
            value={newProject.outcome}
            onChange={(e) => setNewProject({ ...newProject, outcome: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Reduced load time by 20%"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="timeline-start" className="block mb-1 font-medium text-gray-700">
              Timeline Start (Optional)
            </label>
            <input
              id="timeline-start"
              type="date"
              value={newProject.timelineStart}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  timelineStart: e.target.value
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="timeline-end" className="block mb-1 font-medium text-gray-700">
              Timeline End (Optional)
            </label>
            <input
              id="timeline-end"
              type="date"
              value={newProject.timelineEnd}
              onChange={(e) => setNewProject({ ...newProject, timelineEnd: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="project-link" className="block mb-1 font-medium text-gray-700">
            Project Link (Optional)
          </label>
          <input
            id="project-link"
            type="url"
            value={newProject.link}
            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/yourusername/project"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmitProject}
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          disabled={!newProject.title || !newProject.description || !newProject.role}
        >
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
