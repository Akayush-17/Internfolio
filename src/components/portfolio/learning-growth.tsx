"use client";
import React from "react";
import { Book, BookOpen, Users, Code, Brain, Lightbulb } from "lucide-react";
import { Learning } from "@/types";

interface LearningGrowthProps {
  learning: Learning;
}

const LearningGrowth: React.FC<LearningGrowthProps> = ({ learning }) => {
  return (
    <section className="py-10 px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          <span className="border-b-2 border-gray-800 pb-1">
            Learning & Growth
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Currently Learning */}
        {learning.currentlyLearning &&
          learning.currentlyLearning.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-gray-200 flex items-center">
                <Book className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">
                  Currently Learning
                </h3>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {learning.currentlyLearning.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Interested In Learning */}
        {learning.interestedIn && learning.interestedIn.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-purple-50 p-4 border-b border-gray-200 flex items-center">
              <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">
                Interested In Learning
              </h3>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {learning.interestedIn.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Learning Sections */}
      <div className="space-y-6">
        {/* Technical Learnings */}
        {learning.technicalLearnings && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center">
              <Code className="h-5 w-5 text-gray-700 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">
                Technical Learnings
              </h3>
            </div>
            <div className="p-5">
              <p className="text-gray-700 whitespace-pre-line">
                {learning.technicalLearnings}
              </p>
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {learning.softSkills && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-green-50 p-4 border-b border-gray-200 flex items-center">
              <Brain className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">
                Soft Skills Development
              </h3>
            </div>
            <div className="p-5">
              <p className="text-gray-700 whitespace-pre-line">
                {learning.softSkills}
              </p>
            </div>
          </div>
        )}

        {/* Cross-Team Collaboration */}
        {learning.crossTeamCollaboration && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-gray-200 flex items-center">
              <Users className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">
                Cross-Team Collaboration
              </h3>
            </div>
            <div className="p-5">
              <p className="text-gray-700 whitespace-pre-line">
                {learning.crossTeamCollaboration}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Learning Insights - Visual Element */}
      {(learning.currentlyLearning.length > 0 ||
        learning.interestedIn.length > 0) && (
        <div className="mt-10 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-indigo-50 p-4 border-b border-gray-200 flex items-center">
            <Lightbulb className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">
              Learning Insights
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learning Distribution */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  Learning Focus Distribution
                </h4>
                <div className="space-y-3">
                  {[
                    { category: "Frontend Development", percentage: 35 },
                    { category: "Backend Systems", percentage: 25 },
                    { category: "DevOps & Infrastructure", percentage: 20 },
                    { category: "Data & Analytics", percentage: 15 },
                    { category: "Other", percentage: 5 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{item.category}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Growth */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  Growth Trajectory
                </h4>
                <div className="h-48 flex items-end justify-between px-2">
                  {[
                    { month: "Jan", value: 20 },
                    { month: "Feb", value: 35 },
                    { month: "Mar", value: 30 },
                    { month: "Apr", value: 45 },
                    { month: "May", value: 55 },
                    { month: "Jun", value: 70 },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-indigo-500 rounded-t"
                        style={{ height: `${item.value}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-1">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LearningGrowth;
