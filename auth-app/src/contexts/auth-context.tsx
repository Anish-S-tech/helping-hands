'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Types
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  role_type: 'user' | 'founder';
  avatar_url: string | null;
  bio: string | null;
  experience_level: 'fresher' | 'experienced' | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  phone: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  two_fa_enabled: boolean;
  profile_completed: boolean;
}

export interface FounderDetails {
  id: string;
  profile_id: string;
  company_name: string | null;
  company_website: string | null;
  about_company: string | null;
}

// Create a dummy Supabase client for SSR/build time
const createDummyClient = (): SupabaseClient => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithOAuth: async () => ({ data: { url: null, provider: '' }, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), order: () => ({ limit: () => ({ single: async () => ({ data: null, error: null }) }) }) }) }),
      insert: async () => ({ data: null, error: null }),
      update: () => ({ eq: async () => ({ data: null, error: null }) }),
    }),
  } as unknown as SupabaseClient;
};

// Create Supabase client
function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    return createDummyClient();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set');
    return createDummyClient();
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  founderDetails: FounderDetails | null;
  loading: boolean;
  isFounder: boolean;
  profileComplete: boolean;
  signUp: (email: string, password: string, roleType: 'user' | 'founder') => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string, roleType?: 'user' | 'founder') => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithGitHub: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  sendOTP: (type: 'email' | 'phone', value: string) => Promise<{ error: Error | null }>;
  verifyOTP: (type: 'email' | 'phone', code: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  generate2FASecret: () => Promise<{ secret: string; qrCodeUrl: string; backupCodes: string[]; error: Error | null }>;
  verify2FACode: (code: string, secret: string) => Promise<{ error: Error | null }>;
  deleteAccount: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [founderDetails, setFounderDetails] = useState<FounderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const isFounder = profile?.role_type === 'founder';
  const profileComplete = profile?.profile_completed ?? false;

  // Fetch profile data
  const fetchProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return;
    }

    setProfile(profileData);

    // If founder, fetch founder details
    if (profileData?.role_type === 'founder') {
      const { data: founderData } = await supabase
        .from('founder_details')
        .select('*')
        .eq('profile_id', profileData.id)
        .single();

      setFounderDetails(founderData);
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for dummy session in localStorage
        const dummySession = typeof window !== 'undefined' ? localStorage.getItem('dummy_auth') : null;

        if (dummySession) {
          const sessionData = JSON.parse(dummySession);
          setUser(sessionData.user);
          setProfile(sessionData.profile);
          if (sessionData.founderDetails) {
            setFounderDetails(sessionData.founderDetails);
          }
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip if dummy auth is active
        if (typeof window !== 'undefined' && localStorage.getItem('dummy_auth')) {
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setFounderDetails(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email (Dummy)
  const signUp = async (email: string, password: string, roleType: 'user' | 'founder') => {
    // Generate dummy user and profile
    const dummyId = 'dummy-user-id';
    const dummyUser: User = {
      id: dummyId,
      email,
      app_metadata: {},
      user_metadata: { role_type: roleType },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as any;

    const dummyProfile: Profile = {
      id: 'dummy-profile-id',
      user_id: dummyId,
      email,
      name: email.split('@')[0],
      role_type: roleType,
      avatar_url: null,
      bio: null,
      experience_level: null,
      github_url: null,
      linkedin_url: null,
      portfolio_url: null,
      phone: null,
      email_verified: true,
      phone_verified: true,
      two_fa_enabled: false,
      profile_completed: true,
    };

    setUser(dummyUser);
    setProfile(dummyProfile);

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dummy_auth', JSON.stringify({ user: dummyUser, profile: dummyProfile }));
    }

    return { error: null };
  };

  // Sign in with email (Dummy)
  const signIn = async (email: string, password: string, roleType: 'user' | 'founder' = 'user') => {
    const dummyId = 'dummy-user-id';
    const dummyUser: User = {
      id: dummyId,
      email,
      app_metadata: {},
      user_metadata: { role_type: roleType },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as any;

    const dummyProfile: Profile = {
      id: 'dummy-profile-id',
      user_id: dummyId,
      email,
      name: email.split('@')[0],
      role_type: roleType,
      avatar_url: null,
      bio: null,
      experience_level: null,
      github_url: null,
      linkedin_url: null,
      portfolio_url: null,
      phone: null,
      email_verified: true,
      phone_verified: true,
      two_fa_enabled: false,
      profile_completed: true,
    };

    setUser(dummyUser);
    setProfile(dummyProfile);

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dummy_auth', JSON.stringify({ user: dummyUser, profile: dummyProfile }));
    }

    return { error: null };
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error as Error | null };
  };

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error as Error | null };
  };

  // Sign out
  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dummy_auth');
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setFounderDetails(null);
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return { error: new Error('No profile found') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (!error) {
      await refreshProfile();
    }

    return { error: error as Error | null };
  };

  // Send OTP
  const sendOTP = async (type: 'email' | 'phone', value: string) => {
    if (!profile) return { error: new Error('No profile found') };

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const { error: insertError } = await supabase
      .from('verifications')
      .insert({
        profile_id: profile.id,
        type,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) return { error: insertError as Error };

    // In production, send actual email/SMS here
    // For now, log to console
    console.log(`OTP for ${type}: ${otp}`);

    return { error: null };
  };

  // Verify OTP
  const verifyOTP = async (type: 'email' | 'phone', code: string) => {
    if (!profile) return { error: new Error('No profile found') };

    // Check OTP
    const { data: verification, error: fetchError } = await supabase
      .from('verifications')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('type', type)
      .eq('otp_code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verification) {
      return { error: new Error('Invalid or expired OTP') };
    }

    // Mark as verified
    await supabase
      .from('verifications')
      .update({ verified: true })
      .eq('id', verification.id);

    // Update profile verification status
    const updateField = type === 'email' ? 'email_verified' : 'phone_verified';
    await supabase
      .from('profiles')
      .update({ [updateField]: true })
      .eq('id', profile.id);

    await refreshProfile();
    return { error: null };
  };

  // Reset password
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error as Error | null };
  };

  // Generate 2FA secret
  const generate2FASecret = async () => {
    if (!user || !profile) {
      return { secret: '', qrCodeUrl: '', backupCodes: [], error: new Error('No user found') };
    }

    try {
      // Generate random secret (32 characters, base32)
      const secret = Array.from({ length: 16 }, () =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
      ).join('');

      // Generate QR code URL
      const qrCodeUrl = `otpauth://totp/HelpingHands:${profile.email}?secret=${secret}&issuer=HelpingHands`;

      // Generate 8 backup codes
      const backupCodes = Array.from({ length: 8 }, () => {
        const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
        const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
        const part3 = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${part1}-${part2}-${part3}`;
      });

      return { secret, qrCodeUrl, backupCodes, error: null };
    } catch (error) {
      return { secret: '', qrCodeUrl: '', backupCodes: [], error: error as Error };
    }
  };

  // Verify 2FA code and enable 2FA
  const verify2FACode = async (code: string, secret: string) => {
    if (!profile) return { error: new Error('No profile found') };

    // In production, verify the code against the secret on the backend
    // For now, we'll simulate verification (any 6-digit code works)
    if (code.length !== 6) {
      return { error: new Error('Invalid code') };
    }

    try {
      // Update profile to enable 2FA
      const { error } = await supabase
        .from('profiles')
        .update({ two_fa_enabled: true })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Delete account
  const deleteAccount = async (password: string) => {
    if (!user || !profile) {
      return { error: new Error('No user found') };
    }

    try {
      // Verify password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (signInError) {
        return { error: new Error('Invalid password') };
      }

      // Delete profile data (cascade will handle related data)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      if (deleteError) throw deleteError;

      // Delete auth user
      // Note: In production, this should be done on the backend
      // For now, we'll just sign out
      await signOut();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        supabase,
        user,
        session,
        profile,
        founderDetails,
        loading,
        isFounder,
        profileComplete,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGitHub,
        signOut,
        updateProfile,
        sendOTP,
        verifyOTP,
        resetPassword,
        refreshProfile,
        generate2FASecret,
        verify2FACode,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
