import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  verificationSent: boolean;
};

export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: 'creator' | 'investor'
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  clearVerificationStatus: () => void;
};

const createOrUpdateProfile = async (
  userId: string,
  data: { name?: string; email: string; role?: string }
) => {
  const { error: upsertError } = await supabase.from('profiles').upsert(
    {
      id: userId,
      name: data.name || data.email.split('@')[0],
      email: data.email,
      role: data.role || 'creator',
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'id',
    }
  );

  if (upsertError) throw upsertError;

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (fetchError) throw fetchError;

  return profile;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  verificationSent: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error(
            'Please verify your email before logging in. Check your inbox for the verification link.'
          );
        }
        throw error;
      }

      if (data.user) {
        const profile = await createOrUpdateProfile(data.user.id, {
          email: data.user.email!,
        });

        const user: User = {
          id: data.user.id,
          name: profile.name,
          email: data.user.email!,
          role: profile.role,
          profileImage: profile.avatar_url,
          bio: profile.bio,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at,
        };

        set({ user, isAuthenticated: true, loading: false });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false,
      });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false,
      });
    }
  },

  signup: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await createOrUpdateProfile(data.user.id, {
          name,
          email: data.user.email!,
          role,
        });

        set({
          loading: false,
          verificationSent: true,
          error:
            'Please check your email for verification link to complete signup.',
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  },

  clearError: () => set({ error: null }),
  clearVerificationStatus: () => set({ verificationSent: false }),
}));

// Initialize auth state from Supabase session
export const initializeAuthStore = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    try {
      const profile = await createOrUpdateProfile(session.user.id, {
        email: session.user.email!,
      });

      const user: User = {
        id: session.user.id,
        name: profile.name,
        email: session.user.email!,
        role: profile.role,
        profileImage: profile.avatar_url,
        bio: profile.bio,
        createdAt: session.user.created_at,
      };

      useAuthStore.setState({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Error initializing auth store:', error);
    }
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      try {
        const profile = await createOrUpdateProfile(session.user.id, {
          email: session.user.email!,
        });

        const user: User = {
          id: session.user.id,
          name: profile.name,
          email: session.user.email!,
          role: profile.role,
          profileImage: profile.avatar_url,
          bio: profile.bio,
          createdAt: session.user.created_at,
        };

        useAuthStore.setState({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Error handling auth state change:', error);
      }
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ user: null, isAuthenticated: false });
    }
  });
};
