import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GitHubRepository, GitHubLanguage } from "@/types";

interface GitHubData {
  repositories: GitHubRepository[];
  languages: { [key: string]: number };
  frameworks: string[];
  tools: string[];
  lastFetched: string | null;
  isLoading: boolean;
  error: string | null;
}

interface GitHubStore {
  data: GitHubData;
  
  setRepositories: (repositories: GitHubRepository[]) => void;
  setLanguages: (languages: { [key: string]: number }) => void;
  setFrameworks: (frameworks: string[]) => void;
  setTools: (tools: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
  isDataStale: () => boolean;
}

const initialState: GitHubData = {
  repositories: [],
  languages: {},
  frameworks: [],
  tools: [],
  lastFetched: null,
  isLoading: false,
  error: null,
};

export const useGitHubStore = create<GitHubStore>()(
  persist(
    (set, get) => ({
      data: initialState,

      setRepositories: (repositories) =>
        set((state) => ({
          data: {
            ...state.data,
            repositories,
            lastFetched: new Date().toISOString(),
            error: null,
          },
        })),

      setLanguages: (languages) =>
        set((state) => ({
          data: {
            ...state.data,
            languages,
            lastFetched: new Date().toISOString(),
            error: null,
          },
        })),

      setFrameworks: (frameworks) =>
        set((state) => ({
          data: {
            ...state.data,
            frameworks,
            lastFetched: new Date().toISOString(),
            error: null,
          },
        })),

      setTools: (tools) =>
        set((state) => ({
          data: {
            ...state.data,
            tools,
            lastFetched: new Date().toISOString(),
            error: null,
          },
        })),

      setLoading: (isLoading) =>
        set((state) => ({
          data: {
            ...state.data,
            isLoading,
          },
        })),

      setError: (error) =>
        set((state) => ({
          data: {
            ...state.data,
            error,
            isLoading: false,
          },
        })),

      clearData: () =>
        set(() => ({
          data: initialState,
        })),

      isDataStale: () => {
        const { lastFetched } = get().data;
        if (!lastFetched) return true;
        
        const lastFetchTime = new Date(lastFetched).getTime();
        const now = new Date().getTime();
        const cacheExpirationTime = 60 * 60 * 1000; // 1 hour in milliseconds
        
        return now - lastFetchTime > cacheExpirationTime;
      },
    }),
    {
      name: "github-data-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: {
          repositories: state.data.repositories,
          languages: state.data.languages,
          frameworks: state.data.frameworks,
          tools: state.data.tools,
          lastFetched: state.data.lastFetched,
          isLoading: false,
          error: null,
        },
      }),
    }
  )
);
