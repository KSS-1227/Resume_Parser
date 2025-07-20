import { createClient, User } from '@supabase/supabase-js'

// Use provided credentials directly for now (in production, use environment variables)
const supabaseUrl = 'https://vggxwnmboupmbavrfbid.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ3h3bm1ib3VwbWJhdnJmYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMTc0NjIsImV4cCI6MjA2Nzg5MzQ2Mn0.24mURKV3BpngXcikPsHS7DEuIZdylao0TIz15OELVC0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// Database types
export interface AnalysisResult {
  id?: string
  user_id: string
  job_url: string
  job_title: string
  company: string
  overall_score: number
  skill_match: number
  experience_match: number
  keyword_density: number
  matched_skills: string[]
  missing_skills: string[]
  strengths: string[]
  improvements: string[]
  created_at?: string
}

export interface JobRequirement {
  id?: string
  analysis_id: string
  skill: string
  importance: 'required' | 'preferred' | 'nice-to-have'
  category: 'technical' | 'soft' | 'experience' | 'education'
  is_matched: boolean
}

// Database functions
export const saveAnalysisResult = async (analysis: Omit<AnalysisResult, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .insert([analysis])
    .select()
  
  return { data, error }
}

export const getAnalysisHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getAnalysisById = async (analysisId: string) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('id', analysisId)
    .single()
  
  return { data, error }
}

export const saveJobRequirements = async (requirements: Omit<JobRequirement, 'id'>[]) => {
  const { data, error } = await supabase
    .from('job_requirements')
    .insert(requirements)
    .select()
  
  return { data, error }
}

export const getJobRequirements = async (analysisId: string) => {
  const { data, error } = await supabase
    .from('job_requirements')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('importance', { ascending: false })
  
  return { data, error }
} 