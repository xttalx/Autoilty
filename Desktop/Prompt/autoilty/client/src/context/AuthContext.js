import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.error('Missing Supabase environment variables. Please check your Vercel environment variables.');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUserProfile = useCallback(async (userId) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser({
        ...data,
        email: data.email || '',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching user profile:', error);
    }
  }, []);

  const checkUser = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        localStorage.setItem('token', session.access_token);
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      // eslint-disable-next-line no-console
      console.error('Supabase client not initialized. Check environment variables.');
      return;
    }

    // Check for existing session
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [checkUser, fetchUserProfile]);

  const register = async (email, password, name, role = 'buyer') => {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            role,
            created_at: new Date().toISOString(),
          },
        ]);

      if (profileError) throw profileError;

      if (authData.session) {
        setToken(authData.session.access_token);
        localStorage.setItem('token', authData.session.access_token);
        await fetchUserProfile(authData.user.id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setToken(data.session.access_token);
      localStorage.setItem('token', data.session.access_token);
      await fetchUserProfile(data.user.id);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

