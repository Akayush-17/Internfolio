import { FormData } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export interface SkillDistribution {
  category: string;
  percentage: number;
  color: string;
}

export interface GrowthData {
  month: string;
  value: number;
}

export interface AIAnalyticsData {
  skillDistribution: SkillDistribution[];
  growthTrajectory: GrowthData[];
  keyInsights: string[];
  strengths: string[];
  areasForImprovement: string[];
  recommendedLearningPaths: string[];
}

export const generateAnalytics = async (formData: FormData): Promise<AIAnalyticsData> => {
  try {
    // Create a model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const prompt = `
      Analyze this intern portfolio data and generate insights:
      
      Basic Info: ${JSON.stringify(formData.basicInfo)}
      Tech Stack: ${JSON.stringify(formData.techStack)}
      Learning: ${JSON.stringify(formData.learning)}
      Projects: ${JSON.stringify(formData.projects.map(p => ({
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        pullRequests: p.pullRequests?.length || 0
      })))}
      
      Based on this data, generate:
      1. Skill distribution - 5 categories with percentages (must total 100%) and assigned colors
      2. Growth trajectory data for the last 6 months (with values between 10-90)
      3. 3-5 key insights about the intern's performance
      4. 3 strengths
      5. 2 areas for improvement
      6. 3 recommended learning paths based on their current skills and interests
      
      Format your response as a JSON object with the following keys:
      - skillDistribution (array of objects with category, percentage, color)
      - growthTrajectory (array of objects with month, value)
      - keyInsights (array of strings)
      - strengths (array of strings)
      - areasForImprovement (array of strings)
      - recommendedLearningPaths (array of strings)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let jsonStr = text;
    if (text.includes('```json')) {
      jsonStr = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonStr = text.split('```')[1].split('```')[0].trim();
    }

    const analyticsData = JSON.parse(jsonStr) as AIAnalyticsData;

    return {
      skillDistribution: analyticsData.skillDistribution || [
        { category: "Frontend Development", percentage: 35, color: "bg-indigo-600" },
        { category: "Backend Systems", percentage: 25, color: "bg-blue-500" },
        { category: "DevOps & Infrastructure", percentage: 20, color: "bg-green-500" },
        { category: "Data & Analytics", percentage: 15, color: "bg-amber-500" },
        { category: "Other", percentage: 5, color: "bg-purple-500" }
      ],
      growthTrajectory: analyticsData.growthTrajectory || generateDefaultGrowthData(),
      keyInsights: analyticsData.keyInsights || ["Portfolio shows balanced technical skills", "Demonstrates good project diversity", "Has a clear focus on growth and learning"],
      strengths: analyticsData.strengths || ["Technical versatility", "Project completion", "Learning mindset"],
      areasForImprovement: analyticsData.areasForImprovement || ["Could expand cross-functional experience", "Consider more documentation work"],
      recommendedLearningPaths: analyticsData.recommendedLearningPaths || ["Full-stack web development", "Cloud architecture", "DevOps integration"]
    };
  } catch (error) {
    console.error("Error generating AI analytics:", error);
    return {
      skillDistribution: [
        { category: "Frontend Development", percentage: 35, color: "bg-indigo-600" },
        { category: "Backend Systems", percentage: 25, color: "bg-blue-500" },
        { category: "DevOps & Infrastructure", percentage: 20, color: "bg-green-500" },
        { category: "Data & Analytics", percentage: 15, color: "bg-amber-500" },
        { category: "Other", percentage: 5, color: "bg-purple-500" }
      ],
      growthTrajectory: generateDefaultGrowthData(),
      keyInsights: ["Portfolio shows balanced technical skills", "Demonstrates good project diversity", "Has a clear focus on growth and learning"],
      strengths: ["Technical versatility", "Project completion", "Learning mindset"],
      areasForImprovement: ["Could expand cross-functional experience", "Consider more documentation work"],
      recommendedLearningPaths: ["Full-stack web development", "Cloud architecture", "DevOps integration"]
    };
  }
};

function generateDefaultGrowthData(): GrowthData[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month, index) => ({
    month,
    value: 20 + (index * 10) 
  }));
}