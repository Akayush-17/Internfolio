import React from "react";
import { Mail, User } from "lucide-react";
import { BasicInfo as BasicInfoType } from "@/types";

interface BasicInfoProps {
  basicInfo: BasicInfoType;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ basicInfo }) => {
  return (
    <section className="px-16 py-16 md:px-8 md:py-8">
      <p className="text-2xl mb-4 text-gray-700 font-medium w-full flex items-center flex-wrap">
        Hello! I&apos;m {basicInfo.fullName}
        <span className="bg-blue-100 p-2 rounded-2xl text-blue-600 flex flex-row gap-2 justify-center items-center ml-2 text-base">
          <Mail size={14} className="text-blue-500" /> {basicInfo.email}
        </span>
      </p>
      <h1 className="text-6xl font-bold leading-tight mb-8 max-w-[80%] lg:text-5xl lg:max-w-[90%] md:text-4xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        {basicInfo.internshipRole} in{" "}
        <span className="text-blue-500">{basicInfo.teamDepartment} Team</span>
      </h1>
      <div className="text-lg mb-8 text-gray-600 leading-relaxed">
        {basicInfo.summary ||
          "A passionate designer focused on creating intuitive and beautiful user experiences."}
      </div>

      {/* Display contact information */}
      <div className="grid grid-cols-2 gap-6 mb-8 md:grid-cols-1">
        {basicInfo.managerName && (
          <div className="flex items-center gap-2">
            <User size={18} className="text-blue-500" />
            <span className="font-medium text-gray-700">Manager:</span>
            <span className="text-gray-600">{basicInfo.managerName}</span>
          </div>
        )}
      </div>

      {basicInfo.teammates && basicInfo.teammates.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-3 border-b pb-2">
            Team Members:
          </h3>
          <div className="flex flex-wrap gap-4">
            {basicInfo.teammates.map((teammate, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-gray-800">{teammate.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default BasicInfo;
