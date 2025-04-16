import React, { useState } from "react";
import useFormStore from "@/store/useFormStore";
import { TechnicalLearningEntry, CollaborationEntry, SoftSkillEntry } from "@/types";
import { PlusCircle, Trash2 } from "lucide-react";

const Learning: React.FC = () => {
  const { formData, updateLearning } = useFormStore();
  const { learning } = formData;
  const [activeTab, setActiveTab] = useState<"technical" | "softSkills" | "collaboration">("technical");
  
  // State for managing new entries
  const [newEntry, setNewEntry] = useState<TechnicalLearningEntry | SoftSkillEntry | CollaborationEntry>({
    title: "",
    context: "",
    learning: ""
  });

  if (!learning) {
    return <div>Loading...</div>; 
  }

  // Helper function to handle array updates
  const handleArrayUpdate = (field: keyof typeof learning, value: string) => {
    const currentArray = (learning[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    updateLearning({ [field]: newArray });
  };

  // Handle entry input changes
  const handleEntryChange = (field: keyof TechnicalLearningEntry | keyof SoftSkillEntry | keyof CollaborationEntry, value: string) => {
    if (field === "teams" && activeTab === "collaboration") {
      // Handle teams as an array
      setNewEntry(prev => ({
        ...prev,
        [field]: value.split(',').map(team => team.trim()).filter(team => team !== '')
      }));
    } else {
      setNewEntry(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Reset the entry form
  const resetEntryForm = () => {
    if (activeTab === "collaboration") {
      setNewEntry({
        title: "",
        context: "",
        learning: "",
        teams: [],
      });
    } else {
      setNewEntry({
        title: "",
        context: "",
        learning: ""
      });
    }
  };

  // Add a new technical learning entry
  const addTechnicalLearningEntry = () => {
    if (newEntry.title && newEntry.learning) {
      const currentEntries = learning.technicalLearningEntries || [];
      updateLearning({
        technicalLearningEntries: [...currentEntries, {...newEntry}]
      });
      resetEntryForm();
    }
  };

  // Remove a technical learning entry
  const removeTechnicalLearningEntry = (index: number) => {
    const currentEntries = [...(learning.technicalLearningEntries || [])];
    currentEntries.splice(index, 1);
    updateLearning({
      technicalLearningEntries: currentEntries
    });
  };

  // Add a new soft skill entry
  const addSoftSkillEntry = () => {
    if (newEntry.title && newEntry.learning) {
      const currentEntries = learning.softSkills || [];
      updateLearning({
        softSkills: [...currentEntries, {...newEntry}]
      });
      resetEntryForm();
    }
  };

  // Remove a soft skill entry
  const removeSoftSkillEntry = (index: number) => {
    const currentEntries = [...(learning.softSkills || [])];
    currentEntries.splice(index, 1);
    updateLearning({
      softSkills: currentEntries
    });
  };

  // Add a new collaboration entry
  const addCollaborationEntry = () => {
    if (newEntry.title && newEntry.learning) {
      const currentEntries = learning.crossTeamCollaboration || [];
      // Fix: Update the correct field (crossTeamCollaboration, not softSkills)
      updateLearning({
        crossTeamCollaboration: [...currentEntries, {...newEntry}]
      });
      resetEntryForm();
    }
  };

  // Remove a collaboration entry
  const removeCollaborationEntry = (index: number) => {
    const currentEntries = [...(learning.crossTeamCollaboration || [])];
    currentEntries.splice(index, 1);
    updateLearning({
      crossTeamCollaboration: currentEntries
    });
  };

  const isCollaborationEntry = (entry: unknown): entry is CollaborationEntry => {
    return (entry as CollaborationEntry).teams !== undefined;
  };

  // Learning options
  const learningOptions = [
    "Machine Learning",
    "Blockchain",
    "Web3",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Data Science",
    "Cybersecurity",
  ];

  // Handle adding a new entry based on the active tab
  const handleAddEntry = () => {
    switch (activeTab) {
      case "technical":
        addTechnicalLearningEntry();
        break;
      case "softSkills":
        addSoftSkillEntry();
        break;
      case "collaboration":
        addCollaborationEntry();
        break;
    }
  };

  // Render entries based on active tab
  const renderEntries = () => {
    switch (activeTab) {
      case "technical":
        return (
          learning.technicalLearningEntries && learning.technicalLearningEntries.length > 0 && (
            <div className="mb-4 space-y-4">
              {learning.technicalLearningEntries.map((entry, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{entry.title}</h4>
                    <button 
                      type="button" 
                      onClick={() => removeTechnicalLearningEntry(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{entry.context}</p>
                  <div className="bg-white p-3 rounded border-l-4 border-indigo-500">
                    <p className="text-sm">
                      <span className="font-medium">Learning: </span>
                      {entry.learning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        );
      case "softSkills":
        return (
          Array.isArray(learning.softSkills) && learning.softSkills.length > 0 && (
            <div className="mb-4 space-y-4">
              {learning.softSkills.map((entry, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{entry.title}</h4>
                    <button 
                      type="button" 
                      onClick={() => removeSoftSkillEntry(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{entry.context}</p>
                  <div className="bg-white p-3 rounded border-l-4 border-indigo-500">
                    <p className="text-sm">
                      <span className="font-medium">Learning: </span>
                      {entry.learning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        );
      case "collaboration":
        return (
          Array.isArray(learning.crossTeamCollaboration) && learning.crossTeamCollaboration.length > 0 && (
            <div className="mb-4 space-y-4">
              {learning.crossTeamCollaboration.map((entry, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{entry.title}</h4>
                    <button 
                      type="button" 
                      onClick={() => removeCollaborationEntry(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{entry.context}</p>
                  <div className="bg-white p-3 rounded border-l-4 border-indigo-500">
                    <p className="text-sm">
                      <span className="font-medium">Learning: </span>
                      {entry.learning}
                    </p>
                  </div>
                  {entry.teams && entry.teams.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {entry.teams.map((team, idx) => (
                        <div key={idx} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                          {team}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        );
    }
  };

  // Get the title for the form based on active tab
  const getFormTitle = () => {
    switch (activeTab) {
      case "technical":
        return "Add New Technical Learning";
      case "softSkills":
        return "Add New Soft Skills Learning";
      case "collaboration":
        return "Add New Cross-Team Collaboration";
    }
  };

  // Get the section title based on active tab
  const getSectionTitle = () => {
    switch (activeTab) {
      case "technical":
        return "Technical Learnings";
      case "softSkills":
        return "Soft Skills Learnings";
      case "collaboration":
        return "Cross-Team Collaboration";
    }
  };

  // Get the section description based on active tab
  const getSectionDescription = () => {
    switch (activeTab) {
      case "technical":
        return "Add your technical learning experiences";
      case "softSkills":
        return "Add your soft skills learning experiences that made you grow as a person";
      case "collaboration":
        return "Describe any collaboration with other teams or departments";
    }
  };

  return (
    <div className="space-y-6">
      {/* Common learning sections */}
      <div>
        <h3 className="mb-3 text-lg font-medium">
          What are you currently learning?
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {learningOptions.map((option) => (
            <div key={`learning-${option}`} className="flex items-center">
              <input
                type="checkbox"
                id={`learning-${option}`}
                checked={learning.currentlyLearning?.includes(option) || false}
                onChange={() =>
                  handleArrayUpdate("currentlyLearning", option)
                }
                className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`learning-${option}`}>{option}</label>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <input
            type="text"
            placeholder="Other (please specify)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                handleArrayUpdate(
                  "currentlyLearning",
                  e.currentTarget.value.trim()
                );
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">
          What are you interested in learning next?
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {learningOptions.map((option) => (
            <div key={`interested-${option}`} className="flex items-center">
              <input
                type="checkbox"
                id={`interested-${option}`}
                checked={learning.interestedIn?.includes(option) || false}
                onChange={() => handleArrayUpdate("interestedIn", option)}
                className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`interested-${option}`}>{option}</label>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <input
            type="text"
            placeholder="Other (please specify)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                handleArrayUpdate(
                  "interestedIn",
                  e.currentTarget.value.trim()
                );
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
      </div>

      {/* Improved Tab Navigation */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            onClick={() => setActiveTab("technical")}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "technical"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
            }`}
          >
            Technical Learning
          </button>
          <button
            onClick={() => setActiveTab("softSkills")}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "softSkills"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
            }`}
          >
            Soft Skills
          </button>
          <button
            onClick={() => setActiveTab("collaboration")}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "collaboration"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
            }`}
          >
            Cross-Team Collaboration
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        <h3 className="mb-3 text-lg font-medium">{getSectionTitle()}</h3>
        <p className="mb-2 text-sm text-gray-600">
          {getSectionDescription()}
        </p>
        
        {/* Display entries for the active tab */}
        {renderEntries()}
        
        {/* Form to add new entries */}
        <div className="space-y-3 border border-gray-200 rounded-md p-4 bg-white">
          <h4 className="font-medium">{getFormTitle()}</h4>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={newEntry.title}
              onChange={(e) => handleEntryChange("title", e.target.value)}
              placeholder={
                activeTab === "technical" 
                  ? "e.g., Generic vs Specific Design" 
                  : activeTab === "softSkills" 
                    ? "e.g., Emotional Intelligence" 
                    : "e.g., Worked with the design team on UI components"
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
              Context (What happened?)
            </label>
            <textarea
              id="context"
              value={newEntry.context}
              onChange={(e) => handleEntryChange("context", e.target.value)}
              placeholder={
                activeTab === "technical" 
                  ? "e.g., In one of the Acko Clinic initial meetings..." 
                  : activeTab === "softSkills" 
                    ? "e.g., I learned to be more patient and understanding..." 
                    : "e.g., I needed to coordinate with the UX team to implement..."
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="learning" className="block text-sm font-medium text-gray-700 mb-1">
              What did you learn?
            </label>
            <textarea
              id="learning"
              value={newEntry.learning}
              onChange={(e) => handleEntryChange("learning", e.target.value)}
              placeholder="e.g., This made me realize the importance of thinking at a platform level..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          {/* Teams field only for collaboration tab */}
          {activeTab === "collaboration" && (
            <div>
              <label htmlFor="teams" className="block text-sm font-medium text-gray-700 mb-1">
                Teams (comma separated)
              </label>
              <input
                id="teams"
                type="text"
                value={isCollaborationEntry(newEntry) ? 
                  (Array.isArray(newEntry.teams) ? newEntry.teams.join(", ") : "") : 
                  ""
                }
                onChange={(e) => handleEntryChange("teams", e.target.value)}
                placeholder="e.g., Design, Engineering, Product"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter team names separated by commas</p>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleAddEntry}
            disabled={!newEntry.title || !newEntry.learning}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default Learning;