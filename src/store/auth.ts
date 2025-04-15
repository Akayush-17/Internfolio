import { createClient } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  portfolioId: string | null;

  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  generatePortfolioId: () => Promise<string>;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      error: null,
      isAuthenticated: false,
      portfolioId: null,

      checkAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            // Check if user has a portfolio ID
            const { data } = await supabase
              .from("user_portfolios")
              .select("portfolio_id")
              .eq("user_id", session.user.id)
              .single();

            set({
              user: session.user as User,
              isAuthenticated: true,
              isLoading: false,
              portfolioId: data?.portfolio_id || null,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error: unknown) {
          const err = error as Error;
          console.error("Auth check error:", err);
          set({
            error: "Failed to check authentication status",
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;
        } catch (error: unknown) {
          const err = error as Error;
          console.error("Google sign-in error:", err);
          set({
            error: err.message || "Failed to sign in with Google",
            isLoading: false,
          });
        }
      },

      // Sign in with GitHub
      signInWithGithub: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;
        } catch (error: unknown) {
          const err = error as Error;
          console.error("GitHub sign-in error:", err);
          set({
            error: err.message || "Failed to sign in with GitHub",
            isLoading: false,
          });
        }
      },

      // Sign out
      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();

          if (error) throw error;

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: unknown) {
          const err = error as Error;
          console.error("Sign-out error:", err);
          set({ error: err.message || "Failed to sign out", isLoading: false });
        }
      },

      generatePortfolioId: async () => {
        const { user } = get();

        if (!user) {
          throw new Error(
            "User must be authenticated to generate portfolio ID"
          );
        }

        try {
          // Generate a unique ID (you could use a UUID or a shorter unique string)
          const portfolioId = Math.random().toString(36).substring(2, 10);

          // Save to database
          const { error } = await supabase.from("user_portfolios").upsert(
            {
              user_id: user.id,
              portfolio_id: portfolioId,
              is_published: true,
              created_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

          if (error) throw error;

          // Update local state
          set({ portfolioId });

          return portfolioId;
        } catch (error: unknown) {
          const err = error as Error;
          console.error("Error generating portfolio ID:", err);
          throw err;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        portfolioId: state.portfolioId,
      }),
    }
  )
);

export default useAuthStore;
