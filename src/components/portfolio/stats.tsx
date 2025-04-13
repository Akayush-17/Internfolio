"use client";
import React from "react";
import {
  FaCode,
  FaCodeBranch,
  FaGithub,
  FaRocket,
  FaLaptopCode,
} from "react-icons/fa";
import { TechStack } from "@/types";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => (
  <div className="flex flex-row items-center p-3 bg-white rounded-lg shadow hover:shadow-md justify-center gap-4">
    <div className="text-xl text-primary-600 mb-1">{icon}</div>
    <div className="flex flex-col">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  </div>
);

interface PortfolioStatsProps {
  techStack: TechStack;
  stats?: {
    projects?: number;
    pullRequests?: number;
    commits?: number;
    featuresReleased?: number;
    linesOfCode?: number;
    coffeeConsumed?: number;
  };
  contributions?: {
    count: number;
    data: {
      date: string;
      count: number;
      level: 0 | 1 | 2 | 3 | 4; // 0 = no contributions, 4 = most contributions
    }[];
  };
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  techStack,
  stats = {
    projects: 4,
    pullRequests: 60,
    commits: 247,
    featuresReleased: 5,
    linesOfCode: 12500,
  },
  contributions = {
    count: 682,
    data: Array(26 * 7)
      .fill(0)
      .map((_, i) => {
        // Calculate date properly for the last 6 months
        const today = new Date();
        const date = new Date(today);
        date.setDate(today.getDate() - (26 * 7 - i - 1));

        return {
          date: date.toISOString().split("T")[0],
          count: Math.floor(Math.random() * 10),
          level: Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4,
        };
      }),
  },
}) => {
  return (
    <section className=" ">
      <div className="container mx-auto px-4 bg-gray-50 rounded-2xl py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Stats Section - Now in a column taking ~40% width */}
          <div className="md:w-2/5">
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={<FaLaptopCode className="text-blue-500" />}
                value={stats.projects || 0}
                label="Projects"
              />

              <StatItem
                icon={<FaCodeBranch className="text-purple-500" />}
                value={stats.pullRequests || 0}
                label="Pull Requests"
              />

              <StatItem
                icon={<FaGithub className="text-gray-800" />}
                value={stats.commits || 0}
                label="Commits"
              />

              <StatItem
                icon={<FaRocket className="text-red-500" />}
                value={stats.featuresReleased || 0}
                label="Features"
              />

              <StatItem
                icon={<FaCode className="text-green-500" />}
                value={`${Math.floor((stats.linesOfCode || 0) / 1000)}k+`}
                label="Lines of Code"
              />
            </div>
          </div>

          {/* GitHub Contribution Heatmap - Now in a column taking ~60% width */}
          <div className="md:w-3/5 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">GitHub Contributions</h3>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-primary-600">
                    {contributions.count}
                  </span>{" "}
                  contributions in the last 6 months
                </div>
              </div>
              <FaGithub className="text-xl text-gray-700" />
            </div>

            <div className="w-full">
              <div className="mb-2 grid grid-cols-6 w-full">
                {Array.from({ length: 6 }).map((_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - 5 + i);
                  return (
                    <div key={i} className="text-xs text-gray-500 text-center">
                      {date.toLocaleString("default", { month: "short" })}
                    </div>
                  );
                })}
              </div>

              <div className="w-full">
                {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
                  <div
                    key={dayOfWeek}
                    className="flex justify-between w-full mb-1"
                  >
                    {Array.from({ length: 26 }, (_, weekIndex) => {
                      const dataIndex = weekIndex * 7 + dayOfWeek;
                      const day = contributions.data[dataIndex] || {
                        level: 0,
                        count: 0,
                        date: "",
                      };

                      return (
                        <div
                          key={weekIndex}
                          className={`w-3 h-3 rounded-sm ${
                            day.level === 0
                              ? "bg-gray-200"
                              : day.level === 1
                              ? "bg-green-200"
                              : day.level === 2
                              ? "bg-green-300"
                              : day.level === 3
                              ? "bg-green-500"
                              : "bg-green-700"
                          }`}
                          title={`${day.count} contributions on ${day.date}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-end">
                <div className="text-xs text-gray-500 mr-2">Less</div>
                <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200 ml-1"></div>
                <div className="w-3 h-3 rounded-sm bg-green-300 ml-1"></div>
                <div className="w-3 h-3 rounded-sm bg-green-500 ml-1"></div>
                <div className="w-3 h-3 rounded-sm bg-green-700 ml-1"></div>
                <div className="text-xs text-gray-500 ml-2">More</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Tech Stack</h3>
            <FaCode className="text-xl text-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Languages */}
            {techStack.languages && techStack.languages.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Frameworks */}
            {techStack.frameworks && techStack.frameworks.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.frameworks.map((framework, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                    >
                      {framework}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tools */}
            {techStack.tools && techStack.tools.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other */}
          {techStack.other && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                Other Skills
              </h4>
              <p className="text-sm text-gray-600">{techStack.other}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioStats;
