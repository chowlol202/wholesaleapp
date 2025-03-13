import { supabase } from './client';
import type { User } from './types';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  try {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (signUpError || !user) throw signUpError;

    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName
      });

    if (profileError) throw profileError;

    return { user, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { user: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { user, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error };
  }
}