import React, { useState, useEffect } from "react";
import useFormStore from "@/store/useFormStore";

const BasicInfo: React.FC = () => {
  const { formData, updateBasicInfo, ensureFormDataLoaded } = useFormStore();
  const { basicInfo } = formData;
  const [newTeammate, setNewTeammate] = useState({ name: "", role: "" });

  useEffect(() => {
    ensureFormDataLoaded();
  }, [ensureFormDataLoaded]);

  const addTeammate = () => {
    if (newTeammate.name.trim() && newTeammate.role.trim()) {
      const updatedTeammates = [
        ...(basicInfo.teammates || []),
        { ...newTeammate, approved: false },
      ];
      updateBasicInfo({ teammates: updatedTeammates });
      setNewTeammate({ name: "", role: "" });
    }
  };

  const removeTeammate = (index: number) => {
    const updatedTeammates = [...(basicInfo.teammates || [])];
    updatedTeammates.splice(index, 1);
    updateBasicInfo({ teammates: updatedTeammates });
  };



  return (
    <div className="w-full">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block mb-1 font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={basicInfo.fullName}
            onChange={(e) => updateBasicInfo({ fullName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your full name"
            autoCapitalize="words"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 font-medium text-gray-700"
          >
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            value={basicInfo.email}
            onChange={(e) => updateBasicInfo({ email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="internshipRole"
            className="block mb-1 font-medium text-gray-700"
          >
            Internship Role
          </label>
          <input
            id="internshipRole"
            type="text"
            value={basicInfo.internshipRole}
            onChange={(e) =>
              updateBasicInfo({ internshipRole: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. SDE Intern"
          />
        </div>

        <div>
          <label
            htmlFor="teamDepartment"
            className="block mb-1 font-medium text-gray-700"
          >
            Team / Department
          </label>
          <input
            id="teamDepartment"
            type="text"
            value={basicInfo.teamDepartment}
            onChange={(e) =>
              updateBasicInfo({ teamDepartment: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Platform Engineering"
          />
        </div>

        <div>
          <label
            htmlFor="managerName"
            className="block mb-1 font-medium text-gray-700"
          >
            Manager Name (optional)
          </label>
          <input
            id="managerName"
            type="text"
            value={basicInfo.managerName}
            onChange={(e) => updateBasicInfo({ managerName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your manager's name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block mb-1 font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={basicInfo.startDate}
              onChange={(e) => updateBasicInfo({ startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block mb-1 font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={basicInfo.endDate}
              onChange={(e) => updateBasicInfo({ endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="summary"
            className="block mb-1 font-medium text-gray-700"
          >
            Summary Line
          </label>
          <textarea
            id="summary"
            value={basicInfo.summary}
            onChange={(e) => updateBasicInfo({ summary: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short introduction about your internship"
            rows={3}
          />
        </div>

        {/* Teammates Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Teammates (optional)
          </h3>

          {/* Add new teammate form */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newTeammate.name}
              onChange={(e) =>
                setNewTeammate({ ...newTeammate, name: e.target.value })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Teammate name"
            />
            <input
              type="text"
              value={newTeammate.role}
              onChange={(e) =>
                setNewTeammate({ ...newTeammate, role: e.target.value })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Teammate role"
            />
            <button
              type="button"
              onClick={addTeammate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>

          {/* Teammates list */}
          {basicInfo.teammates && basicInfo.teammates.length > 0 ? (
            <div className="space-y-3">
              {basicInfo.teammates.map((teammate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div>
                    <p className="font-medium">{teammate.name}</p>
                   
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeTeammate(index)}
                      className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No teammates added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
