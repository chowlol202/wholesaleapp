export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string
          address: string
          realtor_name: string
          realtor_number: string
          asking_price: number
          purchase_price: number
          interest: number
          monthly_payment: number
          down_payment: number
          cash_flow: number
          cash_on_cash_return: number
          rent: number
          contacted: boolean
          notes: string
          image_url: string | null
          offer_status: string | null
          created_at: string
          monthly_insurance: number
          monthly_property_tax: number
          monthly_hoa: number
          monthly_other: number
          cap_ex_percentage: number
          management_percentage: number
          vacancy_percentage: number
        }
        Insert: {
          id?: string
          user_id: string
          address: string
          realtor_name: string
          realtor_number: string
          asking_price: number
          purchase_price: number
          interest: number
          monthly_payment: number
          down_payment: number
          cash_flow: number
          cash_on_cash_return: number
          rent: number
          contacted?: boolean
          notes?: string
          image_url?: string | null
          offer_status?: string | null
          created_at?: string
          monthly_insurance?: number
          monthly_property_tax?: number
          monthly_hoa?: number
          monthly_other?: number
          cap_ex_percentage?: number
          management_percentage?: number
          vacancy_percentage?: number
        }
        Update: {
          id?: string
          user_id?: string
          address?: string
          realtor_name?: string
          realtor_number?: string
          asking_price?: number
          purchase_price?: number
          interest?: number
          monthly_payment?: number
          down_payment?: number
          cash_flow?: number
          cash_on_cash_return?: number
          rent?: number
          contacted?: boolean
          notes?: string
          image_url?: string | null
          offer_status?: string | null
          created_at?: string
          monthly_insurance?: number
          monthly_property_tax?: number
          monthly_hoa?: number
          monthly_other?: number
          cap_ex_percentage?: number
          management_percentage?: number
          vacancy_percentage?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};