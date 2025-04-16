"use client";
import React, { useState } from "react";
import { Book, BookOpen, Users, Code, Lightbulb, ChevronDown, ChevronUp, PieChart, BarChart, Info } from "lucide-react";
import { Learning } from "@/types";

interface LearningGrowthProps {
  learning: Learning;
}

const LearningGrowth: React.FC<LearningGrowthProps> = ({ learning }) => {
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    technical: true,
    softSkills: true,
    collaboration: true
  });
  
  // State for chart view (distribution vs growth)
  const [activeChartView, setActiveChartView] = useState<'distribution' | 'growth'>('distribution');

  // Toggle section visibility
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate skill totals for the chart
  const skillTotal = (learning.currentlyLearning?.length || 0) + (learning.interestedIn?.length || 0);
  
  // Accessibility function to announce percentage
  const getAriaValueText = (value: number) => `${value} percent`;

  const renderTechnicalLearnings = () => {
    if (learning.technicalLearningEntries && learning.technicalLearningEntries.length > 0) {
      return (
        <div className="space-y-6">
          {learning.technicalLearningEntries.map((entry, index) => (
            <div key={index} className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">{entry.title}</h4>
              <p className="text-gray-700 mb-3">{entry.context}</p>
              <div className="bg-gray-50 p-4 rounded-md border-l-4 border-indigo-500">
                <h5 className="font-medium text-gray-800 mb-1">Technical Learning:</h5>
                <p className="text-gray-700">{entry.learning}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderSoftSkills = () => {
    if (learning.softSkills && learning.softSkills.length > 0) {
      return (
        <div className="space-y-6">
          {learning?.softSkills?.map((entry, index) => (
            <div key={index} className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">{entry.title}</h4>
              <p className="text-gray-700 mb-3">{entry.context}</p>
              <div className="bg-gray-50 p-4 rounded-md border-l-4 border-indigo-500">
                <h5 className="font-medium text-gray-800 mb-1">Soft Skills Learning:</h5>
                <p className="text-gray-700">{entry.learning}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCollaboration = () => {
    if (learning.crossTeamCollaboration && learning.crossTeamCollaboration.length > 0) {
      return (
        <div className="space-y-6">
          {learning?.crossTeamCollaboration?.map((entry, index) => (
            <div key={index} className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">{entry.title}</h4>
              <p className="text-gray-700 mb-3">{entry.context}</p>
              <div className="bg-gray-50 p-4 rounded-md border-l-4 border-indigo-500">
                <h5 className="font-medium text-gray-800 mb-1">Collaboration Learning:</h5>
                <p className="text-gray-700">{entry.learning}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.teams && entry.teams.map((team, index) => (
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                    {team}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50" aria-labelledby="learning-section-title">
      <div className="max-w-6xl mx-auto">
        {/* Header with introduction */}
        <header className="mb-8 text-center sm:text-left">
          <h2 
            id="learning-section-title" 
            className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3"
          >
            Learning & Growth
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Track my professional development journey, current skills, and future learning goals.
          </p>
        </header>

        {/* Skills Summary */}
        <div className="mb-8 p-5 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <PieChart className="h-5 w-5 text-indigo-600 mr-2" aria-hidden="true" />
            Skills Overview
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Currently Learning Panel */}
            {learning.currentlyLearning && learning.currentlyLearning.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-blue-800 flex items-center">
                    <Book className="h-4 w-4 mr-2" aria-hidden="true" />
                    Current Focus ({learning.currentlyLearning.length})
                  </h4>
                  <button 
                    type="button"
                    className="text-blue-700 hover:text-blue-900 text-sm font-medium"
                    onClick={() => {}}
                    aria-label="View all current skills"
                  >
                    View all
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {learning.currentlyLearning.slice(0, 5).map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-sm font-medium text-blue-800 ring-1 ring-inset ring-blue-200"
                    >
                      {item}
                    </span>
                  ))}
                  {learning.currentlyLearning.length > 5 && (
                    <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-1 text-sm font-medium text-blue-800">
                      +{learning.currentlyLearning.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Interested In Panel */}
            {learning.interestedIn && learning.interestedIn.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-purple-800 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                    Future Goals ({learning.interestedIn.length})
                  </h4>
                  <button 
                    type="button"
                    className="text-purple-700 hover:text-purple-900 text-sm font-medium"
                    onClick={() => {}}
                    aria-label="View all future learning goals"
                  >
                    View all
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {learning.interestedIn.slice(0, 5).map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-sm font-medium text-purple-800 ring-1 ring-inset ring-purple-200"
                    >
                      {item}
                    </span>
                  ))}
                  {learning.interestedIn.length > 5 && (
                    <span className="inline-flex items-center rounded-md bg-purple-100 px-2.5 py-1 text-sm font-medium text-purple-800">
                      +{learning.interestedIn.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Learning Cards - Collapsible */}
        <div className="space-y-4">
          {/* Technical Learnings */}
          {(learning.technicalLearnings || (learning.technicalLearningEntries && learning.technicalLearningEntries.length > 0)) && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('technical')}
                className="w-full bg-gray-50 p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                aria-expanded={expandedSections.technical}
                aria-controls="technical-content"
              >
                <div className="flex items-center">
                  <Code className="h-5 w-5 text-indigo-600 mr-3" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-gray-800">Technical Learnings</h3>
                </div>
                {expandedSections.technical ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
              </button>
              
              {expandedSections.technical && (
                <div id="technical-content" className="p-5 border-t border-gray-200">
                  {renderTechnicalLearnings()}
                </div>
              )}
            </div>
          )}

          {/* Soft Skills */}
          {learning.softSkills && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('softSkills')}
                className="w-full bg-blue-50 p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-expanded={expandedSections.softSkills}
                aria-controls="softSkills-content"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-3" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-gray-800">Soft Skills</h3>  
                </div>
                {expandedSections.softSkills ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
              </button>
              
              {expandedSections.softSkills && (
                <div id="softSkills-content" className="p-5 border-t border-gray-200">
                  {renderSoftSkills()}
                </div>
              )}
            </div>
          )}

          {/* Cross-Team Collaboration */}
          {learning.crossTeamCollaboration && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('collaboration')}
                className="w-full bg-amber-50 p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                aria-expanded={expandedSections.collaboration}
                aria-controls="collaboration-content"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-amber-600 mr-3" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-gray-800">Cross-Team Collaboration</h3>
                </div>
                {expandedSections.collaboration ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
              </button>
              
              {expandedSections.collaboration && (
                <div id="collaboration-content" className="p-5 border-t border-gray-200">
                  {renderCollaboration()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive Learning Analytics */}
        {(skillTotal > 0) && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-indigo-50 p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-indigo-600 mr-2" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-gray-800">Learning Analytics</h3>
                </div>
                
                {/* Toggle between chart views */}
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className={`px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                      activeChartView === 'distribution' 
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveChartView('distribution')}
                    aria-pressed={activeChartView === 'distribution'}
                    aria-label="Show distribution chart"
                  >
                    <PieChart className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 text-sm font-medium rounded-r-md border ${
                      activeChartView === 'growth' 
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveChartView('growth')}
                    aria-pressed={activeChartView === 'growth'}
                    aria-label="Show growth chart"
                  >
                    <BarChart className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              {activeChartView === 'distribution' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Learning Focus Distribution</h4>
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-gray-400 mr-1" aria-hidden="true" />
                      <span className="text-xs text-gray-500">Based on your current skills</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { category: "Frontend Development", percentage: 35, color: "bg-indigo-600" },
                      { category: "Backend Systems", percentage: 25, color: "bg-blue-500" },
                      { category: "DevOps & Infrastructure", percentage: 20, color: "bg-green-500" },
                      { category: "Data & Analytics", percentage: 15, color: "bg-amber-500" },
                      { category: "Other", percentage: 5, color: "bg-purple-500" },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span>{item.category}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div 
                          className="w-full bg-gray-200 rounded-full h-2.5"
                          role="progressbar"
                          aria-valuenow={item.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuetext={getAriaValueText(item.percentage)}
                        >
                          <div
                            className={`${item.color} h-2.5 rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    {[
                      { color: "bg-indigo-600", label: "Frontend" },
                      { color: "bg-blue-500", label: "Backend" },
                      { color: "bg-green-500", label: "DevOps" },
                      { color: "bg-amber-500", label: "Data" },
                      { color: "bg-purple-500", label: "Other" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${item.color} mr-1`}></div>
                        <span className="text-xs text-gray-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-medium text-gray-700">Growth Trajectory</h4>
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-gray-400 mr-1" aria-hidden="true" />
                      <span className="text-xs text-gray-500">Last 6 months</span>
                    </div>
                  </div>
                  
                  <div 
                    className="h-64 flex items-end justify-between px-2"
                    role="img" 
                    aria-label="Bar chart showing growth trajectory over 6 months"
                  >
                    {[
                      { month: "Jan", value: 20 },
                      { month: "Feb", value: 35 },
                      { month: "Mar", value: 30 },
                      { month: "Apr", value: 45 },
                      { month: "May", value: 55 },
                      { month: "Jun", value: 70 },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none">
                            {item.value}% growth
                          </div>
                        </div>
                        
                        <div
                          className="w-12 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all duration-300"
                          style={{ height: `${item.value}%` }}
                          aria-label={`${item.month}: ${item.value}% growth`}
                        ></div>
                        <span className="mt-2 text-xs font-medium text-gray-600">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LearningGrowth;


       