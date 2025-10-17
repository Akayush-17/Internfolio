import { FormData } from '@/types';

export interface ValidationErrors {
  basicInfo?: {
    fullName?: string;
    email?: string;
    internshipRole?: string;
    teamDepartment?: string;
    managerName?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    teammates?: string;
  };
  techStack?: {
    general?: string;
  };
  learning?: {
    general?: string;
  };
  projects?: {
    general?: string;
  };
}

export const validateStep = (step: number, formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate Basic Info (Step 1)
  if (step === 1) {
    const { basicInfo } = formData;
    errors.basicInfo = {};

    if (!basicInfo.fullName || basicInfo.fullName.trim() === '') {
      errors.basicInfo.fullName = 'Full Name is required';
    }

    // Email is optional, but validate format if provided
    if (
      basicInfo.email &&
      basicInfo.email.trim() !== '' &&
      !/^\S+@\S+\.\S+$/.test(basicInfo.email)
    ) {
      errors.basicInfo.email = 'Please enter a valid email address';
    }

    if (!basicInfo.internshipRole || basicInfo.internshipRole.trim() === '') {
      errors.basicInfo.internshipRole = 'Internship Role is required';
    }

    if (!basicInfo.teamDepartment || basicInfo.teamDepartment.trim() === '') {
      errors.basicInfo.teamDepartment = 'Team/Department is required';
    }

    // Manager name is optional, no validation needed

    if (!basicInfo.startDate) {
      errors.basicInfo.startDate = 'Start Date is required';
    }

    if (!basicInfo.endDate) {
      errors.basicInfo.endDate = 'End Date is required';
    }

    if (!basicInfo.summary || basicInfo.summary.trim() === '') {
      errors.basicInfo.summary = 'Summary is required';
    }

    // If no errors, remove the basicInfo property
    if (Object.keys(errors.basicInfo).length === 0) {
      delete errors.basicInfo;
    }
  }

  // Validate Tech Stack (Step 2)
  else if (step === 2) {
    const { techStack } = formData;

    // Check if at least one technology is selected
    if (
      techStack.languages.length === 0 &&
      techStack.frameworks.length === 0 &&
      techStack.tools.length === 0
    ) {
      errors.techStack = {
        general: 'Please select at least one technology'
      };
    }
  }

  // Validate Learning (Step 3)
  else if (step === 3) {
    const { learning } = formData;

    // Check if at least one learning area is selected or filled
    if (
      learning.currentlyLearning.length === 0 &&
      learning.interestedIn.length === 0 &&
      (!learning.technicalLearnings || learning.technicalLearnings.length === 0) &&
      (!learning.softSkills || learning.softSkills.length === 0) &&
      (!learning.crossTeamCollaboration || learning.crossTeamCollaboration.length === 0)
    ) {
      errors.learning = {
        general: 'Please provide information about your learning experience'
      };
    }
  }

  // Validate Projects (Step 4)
  else if (step === 4) {
    // Projects are optional, but if added, they should have title, description, and role
    const { projects } = formData;

    if (projects.length > 0) {
      const invalidProjects = projects.filter(
        (project) => !project.title || !project.description || !project.role
      );

      if (invalidProjects.length > 0) {
        errors.projects = {
          general: 'All projects must have a title, description, and role'
        };
      }

      // Validate media entries if present
      const projectsWithInvalidMedia = projects.filter(
        (project) =>
          project.media &&
          project.media.some(
            (media) =>
              !media.url || // URL is required for both uploads and external links
              !media.type
          )
      );

      if (projectsWithInvalidMedia.length > 0) {
        errors.projects = {
          ...errors.projects,
          general:
            (errors.projects?.general || '') +
            ' All media entries must have a URL (or uploaded file) and a type.'
        };
      }

      // Validate challenge entries if present
      const projectsWithInvalidChallenges = projects.filter(
        (project) =>
          project.challenges &&
          project.challenges.some(
            (challenge) => !challenge.obstacle || !challenge.approach || !challenge.resolution
          )
      );

      if (projectsWithInvalidChallenges.length > 0) {
        errors.projects = {
          ...errors.projects,
          general:
            (errors.projects?.general || '') +
            ' All challenges must have an obstacle, approach, and resolution.'
        };
      }
    }
  }

  return errors;
};

export const isStepValid = (step: number, formData: FormData): boolean => {
  const errors = validateStep(step, formData);
  return Object.keys(errors).length === 0;
};
