import { create } from 'zustand';
import { supabase } from './supabaseClient';
import { IdeasStore } from '../../types/index';


export const useIdeasStore = create<IdeasStore>((set) => ({
    ideas: [],
    loading: false,
    error: null,
    fetchIdeas: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase.from('ideas').select('*');
        if (error) {
            set({ error: error.message, ideas: [], loading: false });
        } else {
            set({ ideas: data || [], error: null, loading: false });
        }
    },
    refreshIdeas: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase.from('ideas').select('*');
        if (error) {
            set({ error: error.message, ideas: [], loading: false });
        } else {
            set({ ideas: data || [], error: null, loading: false });
        }
    },
}));
