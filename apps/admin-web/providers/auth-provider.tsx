"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

interface Profile {
  id: string;
  role: "admin" | "staff" | "customer";
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refetchProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = async (userId: string) => {
    // Skip if Supabase is not configured (e.g., during build time)
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const refetchProfile = async () => {
    if (user && isSupabaseConfigured()) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // Skip authentication setup if Supabase is not configured (e.g., during build time)
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);

        // Check if user has admin/staff role
        if (profileData && !["admin", "staff"].includes(profileData.role)) {
          await supabase.auth.signOut();
          router.push("/login?error=unauthorized");
          return;
        }
      }

      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);

        // Check if user has admin/staff role
        if (profileData && !["admin", "staff"].includes(profileData.role)) {
          await supabase.auth.signOut();
          router.push("/login?error=unauthorized");
          return;
        }

        // Redirect to dashboard after login
        if (pathname === "/login") {
          router.push("/dashboard");
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        router.push("/login");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  };

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!loading && !user && pathname !== "/login" && isSupabaseConfigured()) {
      router.push("/login");
    }
  }, [loading, user, pathname, router]);

  const value = {
    user,
    profile,
    loading,
    signOut,
    refetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
