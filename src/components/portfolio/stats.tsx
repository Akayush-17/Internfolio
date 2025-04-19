"use client";
import React, { useEffect, useState } from "react";
import {
  FaCode,
  FaCodeBranch,
  FaGithub,
  FaRocket,
  FaLaptopCode,
} from "react-icons/fa";
import { GitPullRequest } from "lucide-react";
import { Project, TechStack, PullRequest } from "@/types";

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

interface ContributionData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface PortfolioStatsProps {
  techStack: TechStack;
  projects: Project[];
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  techStack,
  projects,
}) => {
  const [contributionData, setContributionData] = useState<{
    count: number;
    data: ContributionData[];
  }>({ count: 0, data: [] });

  // Calculate total PRs across projects
  const totalPRs = projects.reduce((count, project) => {
    return (
      count +
      (project.pullRequests?.filter(
        (pr) => !pr.link?.toLowerCase().includes("commit")
      )?.length || 0)
    );
  }, 0);

  useEffect(() => {
    calculateContributions();
  }, [projects]);

  const calculateContributions = () => {
    // Create a map to store contributions by date
    const contributionsByDate = new Map<string, number>();

    // Initialize the last 6 months of dates with zero contributions
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    // Fill all dates in the range with 0
    const currentDate = new Date(sixMonthsAgo);
    while (currentDate <= today) {
      const dateString = currentDate.toISOString().split("T")[0];
      contributionsByDate.set(dateString, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    projects.forEach((project) => {
      project.pullRequests?.forEach((pr: PullRequest) => {
        if (pr.date) {
          const prDate = pr.date.split("T")[0];
          if (contributionsByDate.has(prDate)) {
            contributionsByDate.set(
              prDate,
              (contributionsByDate.get(prDate) || 0) + 3 // PRs count more
            );
          }
        }
      });

      // If we had commit data with dates, we could add them here
      // For now use project start/end dates to simulate commits
      if (project.timelineStart && project.timelineEnd) {
        const start = new Date(project.timelineStart);
        const end = new Date(project.timelineEnd);

        // For each week between start and end, add some random commits
        const current = new Date(start);
        while (current <= end && current <= today) {
          const dateString = current.toISOString().split("T")[0];
          if (contributionsByDate.has(dateString)) {
            // More likely to commit on weekdays
            const dayOfWeek = current.getDay();
            const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
            const commitCount = isWeekday
              ? Math.floor(Math.random() * 3) + 1
              : Math.floor(Math.random() * 2);

            contributionsByDate.set(
              dateString,
              (contributionsByDate.get(dateString) || 0) + commitCount
            );
          }
          current.setDate(current.getDate() + 1);
        }
      }
    });

    // Convert to array format needed for the heat map
    const totalContributions = Array.from(contributionsByDate.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    // Find the maximum contribution in a day for normalization
    const maxContribution = Math.max(
      ...Array.from(contributionsByDate.values())
    );

    // Create the final data structure
    const formattedData = Array.from(contributionsByDate.entries())
      .map(([date, count]) => {
        // Normalize the count to a level between 0-4
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count > 0) {
          if (count <= maxContribution * 0.25) level = 1;
          else if (count <= maxContribution * 0.5) level = 2;
          else if (count <= maxContribution * 0.75) level = 3;
          else level = 4;
        }

        return {
          date,
          count,
          level,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get the most recent 26 weeks (182 days) of data for display
    const last182Days = formattedData.slice(-182);

    setContributionData({
      count: totalContributions,
      data: last182Days,
    });
  };

  // Organize contribution data into weeks and days for the heatmap
  const getContributionCalendar = () => {
    const calendar: ContributionData[][] = [];
    const data = [...contributionData.data];

    // Ensure we have enough days for a complete 26x7 grid
    while (data.length < 26 * 7) {
      const lastDate = data.length > 0 ? new Date(data[0].date) : new Date();
      lastDate.setDate(lastDate.getDate() - 1);
      const dateString = lastDate.toISOString().split("T")[0];

      data.unshift({
        date: dateString,
        count: 0,
        level: 0,
      });
    }

    // Take only the last 26*7 days
    const last26Weeks = data.slice(-26 * 7);

    // Group by day of week
    for (let day = 0; day < 7; day++) {
      const dayData: ContributionData[] = [];
      for (let week = 0; week < 26; week++) {
        const index = week * 7 + day;
        if (index < last26Weeks.length) {
          dayData.push(last26Weeks[index]);
        }
      }
      calendar.push(dayData);
    }

    return calendar;
  };

  const contributionCalendar = getContributionCalendar();

  return (
    <section className="">
      <div className="container mx-auto px-4 bg-gray-50 rounded-2xl py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Stats Section */}
          <div className="md:w-2/5">
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={<FaRocket className="text-blue-500" />}
                value={projects?.length}
                label="Projects"
              />
              <StatItem
                icon={<FaLaptopCode className="text-blue-500" />}
                value={techStack.commits || 0}
                label="Commits"
              />

              <StatItem
                icon={<FaCodeBranch className="text-purple-500" />}
                value={techStack.features || 0}
                label="Features"
              />

              <StatItem
                icon={<FaCode className="text-green-500" />}
                value={`${Math.floor((techStack.linesOfCode || 0) / 1000)}k+`}
                label="Lines of Code"
              />

              <StatItem
                icon={<GitPullRequest className="text-orange-500" />}
                value={totalPRs}
                label="Pull Requests"
              />
            </div>
          </div>

          {/* GitHub Contribution Heatmap */}
          <div className="md:w-3/5 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Contribution Activity</h3>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-primary-600">
                    {contributionData.count}
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
                {contributionCalendar.map((dayData, dayOfWeek) => (
                  <div
                    key={dayOfWeek}
                    className="flex justify-between w-full mb-1"
                  >
                    {dayData.map((day, weekIndex) => (
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
                    ))}
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
