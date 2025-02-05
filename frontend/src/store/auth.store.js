import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.mode === "development" ? "http://localhost:3000/api/auth" : "/api/auth"
axios.defaults.withCredentials = true //axios add cookies to the header everytime request is made

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (email, password, name) => {
        
        set({isLoading: true, error: null})

        try {
            const res = await axios.post(`${API_URL}/signup`,{email,password,name})
            set({user:res.data.user, isLoading: false, isAuthenticated: true})
        } catch (error) {
            set({error:error.response.data.message || "Error signing up", isLoading: false})
            throw error
        }
    },

    verifyEmail: async (code) => {
        set({isLoading: true, error: null})
        
        try {
            const res = await axios.post(`${API_URL}/verify-email`,{ code })
            set({ user:res.data.user, isAuthenticated:true, isLoading:false})
        } catch (error) {
            set({error: error.res.data.message || "Error verifying email", isLoading:false})
            throw error
        }
    },

    checkAuth: async () => {

        set({ isCheckingAuth: true, error: null })

        try {
            const res = await axios.get(`${API_URL}/check-auth`)
            set({ isAuthenticated: true, isCheckingAuth: false, user: res.data.user})
        } catch (error) {
            console.log("Error checking authenticated", error);
            set({error:null, isCheckingAuth: false, isAuthenticated: false})
        }
    },

    login: async (email, password) => {
        set({isLoading: true, error: null})
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password })
            set({ user: res.data.user, isLoading:false, isAuthenticated: true, error:null})
        } catch (error) {
            set({ error: error.response.data.message, isLoading: false, isAuthenticated: false})
            throw error
        }
    },

    logout: async () => {
        set({ isLoading:true, error: null})
        try {
            await axios.post(`${API_URL}/logout`)
            set({ user:null, isAuthenticated: false, isLoading:false, error:null })
        } catch (error) {
            set({ error: "Error logging out", isLoading:false})
            throw error
        }
    },

    forgotPassword: async ( email ) => {
        set({isLoading: true, error:null})
        try {
            const res = await axios.post(`${API_URL}/forgot-password`,{ email })
            set({ isLoading:false })
            toast.success(res.data.message)
        } catch (error) {
            set({ error: error.response.data.message, isLoading: false, })
            throw error
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading:true, error:null})
        try {
            const res = await axios.post(`${API_URL}/reset-password/${token}`,{ password })
            set({ isLoading:false })
        } catch (error) {
            set({ error: error.response.data.message || "Failed to Reset password", isLoading:false})
            console.log("Failed to Reset password", error);
            
        }
    }

}))