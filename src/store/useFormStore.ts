import { BasicInfo, TechStack, Learning, Project, PullRequest, FormData } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/store/auth';
import useAuthStore from '@/store/auth';

interface FormState {
  currentStep: number;
  totalSteps: number;
  formData: FormData;
  isSubmitting: boolean;
  isComplete: boolean;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  saveError: string | null;
  isPublished: boolean;
  publishedUrl: string | null;
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateBasicInfo: (data: Partial<BasicInfo>) => void;
  updateTechStack: (data: Partial<TechStack>) => void;
  updateLearning: (data: Partial<Learning>) => void;
  addProject: (project: Project) => void;
  updateProject: (index: number, project: Partial<Project>) => void;
  removeProject: (index: number) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  addPR: (projectIndex: number, pr: PullRequest) => void;
  updatePR: (projectIndex: number, prIndex: number, pr: Partial<PullRequest>) => void;
  removePR: (projectIndex: number, prIndex: number) => void;
  saveToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  publishPortfolio: () => Promise<string>;
  unpublishPortfolio: () => Promise<void>;
  ensureFormDataLoaded: () => Promise<void>;
}

// Create the store with persistence
const useFormStore = create<FormState>()(
  persist<FormState>(
    (set, get) => ({
      currentStep: 1,
      totalSteps: 5, // Basic Info, Tech Stack, Learning, Projects, Review
      isSubmitting: false,
      isComplete: false,
      saveStatus: 'idle',
      saveError: null,
      isPublished: false,
      publishedUrl: null,

      formData: {
        basicInfo: {
          fullName: '',
          email: '',
          internshipRole: '',
          teamDepartment: '',
          managerName: '',
          startDate: '',
          endDate: '',
          summary: '',
          teammates: []
        },
        techStack: {
          languages: [],
          frameworks: [],
          tools: [],
          other: ''
        },
        learning: {
          currentlyLearning: [],
          interestedIn: []
        },
        projects: []
      },
      isGeneratingAnalytics: false,

      // Navigation actions
      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      goToStep: (step) => {
        const { totalSteps } = get();
        if (step >= 1 && step <= totalSteps) {
          set({ currentStep: step });
        }
      },

      // Data update actions with Supabase saving
      updateBasicInfo: (data) => {
        set((state) => ({
          formData: {
            ...state.formData,
            basicInfo: {
              ...state.formData.basicInfo,
              ...data
            }
          }
        }));
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      updateTechStack: (data) => {
        set((state) => ({
          formData: {
            ...state.formData,
            techStack: {
              ...state.formData.techStack,
              ...data
            }
          }
        }));
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      updateLearning: (data) => {
        set((state) => ({
          formData: {
            ...state.formData,
            learning: {
              ...state.formData.learning,
              ...data
            }
          }
        }));
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      addProject: (project) => {
        // Ensure project has pullRequests array initialized
        const projectWithPRs = {
          ...project,
          pullRequests: project.pullRequests || []
        };

        set((state) => ({
          formData: {
            ...state.formData,
            projects: [...state.formData.projects, projectWithPRs]
          }
        }));
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      updateProject: (projectIndex, projectData) => {
        set((state) => {
          const updatedProjects = [...state.formData.projects];
          updatedProjects[projectIndex] = {
            ...updatedProjects[projectIndex],
            ...projectData
          };
          return {
            formData: {
              ...state.formData,
              projects: updatedProjects
            }
          };
        });
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      removeProject: (index) => {
        set((state) => ({
          formData: {
            ...state.formData,
            projects: state.formData.projects.filter((_, i) => i !== index)
          }
        }));
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      // PR-related actions with Supabase saving
      addPR: (projectIndex, pr) => {
        set((state) => {
          const updatedProjects = [...state.formData.projects];
          if (updatedProjects[projectIndex]) {
            if (!updatedProjects[projectIndex].pullRequests) {
              updatedProjects[projectIndex].pullRequests = [];
            }
            updatedProjects[projectIndex].pullRequests.push(pr);
          }

          return {
            formData: {
              ...state.formData,
              projects: updatedProjects
            }
          };
        });
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      updatePR: (projectIndex, prIndex, pr) => {
        set((state) => {
          const updatedProjects = [...state.formData.projects];
          if (
            updatedProjects[projectIndex] &&
            updatedProjects[projectIndex].pullRequests &&
            updatedProjects[projectIndex].pullRequests[prIndex]
          ) {
            updatedProjects[projectIndex].pullRequests[prIndex] = {
              ...updatedProjects[projectIndex].pullRequests[prIndex],
              ...pr
            };
          }

          return {
            formData: {
              ...state.formData,
              projects: updatedProjects
            }
          };
        });
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      removePR: (projectIndex: number, prIndex: number) => {
        set((state) => {
          const updatedProjects = [...state.formData.projects];
          if (updatedProjects[projectIndex] && updatedProjects[projectIndex].pullRequests) {
            updatedProjects[projectIndex].pullRequests = updatedProjects[
              projectIndex
            ].pullRequests.filter((_, i) => i !== prIndex);
          }

          return {
            formData: {
              ...state.formData,
              projects: updatedProjects
            }
          };
        });
        // Save to Supabase after updating
        get().saveToSupabase();
      },

      // Form submission with Supabase saving
      submitForm: async () => {
        set({ isSubmitting: true });

        try {
          // Save to Supabase
          await get().saveToSupabase();

          // Here you would typically send the data to your API
          // For now, we'll just simulate a delay
          await new Promise((resolve) => setTimeout(resolve, 1500));

          set({ isComplete: true, isSubmitting: false });
          return Promise.resolve();
        } catch (error: unknown) {
          set({ isSubmitting: false });
          const err = error as Error;
          console.error('Error during form submission:', err);
          return Promise.reject(err);
        }
      },

      resetForm: () => {
        set({
          currentStep: 1,
          isSubmitting: false,
          isComplete: false,
          saveStatus: 'idle',
          saveError: null,
          formData: {
            basicInfo: {
              fullName: '',
              email: '',
              internshipRole: '',
              teamDepartment: '',
              managerName: '',
              startDate: '',
              endDate: '',
              summary: '',
              teammates: []
            },
            techStack: { languages: [], frameworks: [], tools: [], other: '' },
            learning: { currentlyLearning: [], interestedIn: [] },
            projects: []
          }
        });
      },

      // New Supabase-related actions
      saveToSupabase: async () => {
        const { user } = useAuthStore.getState();

        if (!user) {
          console.warn('Cannot save form data: User not authenticated');
          return;
        }

        set({ saveStatus: 'saving', saveError: null });

        try {
          const { error } = await supabase.from('intern_forms').upsert(
            {
              user_id: user.id,
              form_data: get().formData,
              updated_at: new Date().toISOString()
            },
            {
              onConflict: 'user_id'
            }
          );

          if (error) throw error;

          set({ saveStatus: 'success' });
        } catch (error: unknown) {
          const err = error as Error;
          console.error('Error saving form data to Supabase:', err);
          set({
            saveStatus: 'error',
            saveError: err.message || 'Failed to save form data'
          });
        }
      },

      loadFromSupabase: async () => {
        const { user } = useAuthStore.getState();

        if (!user) {
          console.warn('Cannot load form data: User not authenticated');
          return;
        }

        set({ saveStatus: 'saving', saveError: null });

        try {
          // Get form data
          const { data, error } = await supabase
            .from('intern_forms')
            .select('form_data')
            .eq('user_id', user.id)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              // No data found, this is fine for new users
              set({ saveStatus: 'idle' });
              return;
            }
            throw error;
          }

          // Get portfolio ID and published status
          const { data: portfolioData, error: portfolioError } = await supabase
            .from('user_portfolios')
            .select('portfolio_id, is_published')
            .eq('user_id', user.id)
            .single();

          if (portfolioError && portfolioError.code !== 'PGRST116') {
            throw portfolioError;
          }

          if (data && data.form_data) {
            set({
              formData: data.form_data,
              isPublished: portfolioData?.is_published || false,
              publishedUrl:
                portfolioData?.is_published && portfolioData?.portfolio_id
                  ? `${window.location.origin}/p/${portfolioData.portfolio_id}`
                  : null,
              saveStatus: 'success'
            });
          }
        } catch (error: unknown) {
          const err = error as Error;
          console.error('Error loading form data from Supabase:', err);
          set({
            saveStatus: 'error',
            saveError: err.message || 'Failed to load form data'
          });
        }
      },

      publishPortfolio: async () => {
        const { user } = useAuthStore.getState();

        if (!user) {
          throw new Error('User must be authenticated to publish portfolio');
        }

        try {
          set({ saveStatus: 'saving' });

          // First save the current form data
          await get().saveToSupabase();

          // Get the generatePortfolioId function from auth store
          const { generatePortfolioId } = useAuthStore.getState();

          if (!generatePortfolioId) {
            throw new Error('Portfolio ID generation function not available');
          }

          // Generate or retrieve portfolio ID
          const portfolioId = await generatePortfolioId();

          if (!portfolioId) {
            throw new Error('Failed to generate portfolio ID');
          }

          // We'll skip updating the intern_forms table since it doesn't have an is_published column
          // Instead, we'll just update the user_portfolios table

          // Make sure user_portfolios is updated with is_published=true
          const { error: portfolioError } = await supabase
            .from('user_portfolios')
            .update({ is_published: true })
            .eq('user_id', user.id);

          if (portfolioError) throw portfolioError;

          const publishedUrl = `${window.location.origin}/p/${portfolioId}`;
          set({
            isPublished: true,
            publishedUrl,
            saveStatus: 'success'
          });

          return publishedUrl;
        } catch (error: unknown) {
          const err = error as Error;
          const errorMessage = err.message || 'Failed to publish portfolio';
          console.error('Error publishing portfolio:', err, errorMessage);
          set({
            saveStatus: 'error',
            saveError: errorMessage
          });
          throw new Error(errorMessage);
        }
      },

      unpublishPortfolio: async () => {
        const { user } = useAuthStore.getState();

        if (!user) {
          throw new Error('User must be authenticated to unpublish portfolio');
        }

        try {
          set({ saveStatus: 'saving' });

          // Update the published status
          const { error } = await supabase
            .from('user_portfolios')
            .update({ is_published: false })
            .eq('user_id', user.id);

          if (error) throw error;

          set({
            isPublished: false,
            publishedUrl: null,
            saveStatus: 'success'
          });
        } catch (error: unknown) {
          const err = error as Error;
          console.error('Error unpublishing portfolio:', err);
          set({
            saveStatus: 'error',
            saveError: err.message || 'Failed to unpublish portfolio'
          });
          throw err;
        }
      },

      ensureFormDataLoaded: async () => {
        const { user } = useAuthStore.getState();
        const { formData } = get();

        if (
          user &&
          (!formData.basicInfo.fullName ||
            formData.projects.length === 0 ||
            formData.techStack.languages.length === 0)
        ) {
          await get().loadFromSupabase();
        }
      }
    }),
    {
      name: 'form-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useFormStore;
