// Dashboard Dua Arena & Rekomendasi Pertandingan
import { supabase } from '../database/supabase.js';

export const AdminDashboard = {
    state: {
        matches: [],
        arena1: null,
        arena2: null
    },

    async fetchDashboardData() {
        const { data } = await supabase.from('matches')
            .select('*, team1:teams!team1_id(name), team2:teams!team2_id(name)')
            .order('match_number', { ascending: true });
        
        this.state.matches = data;
        this.state.arena1 = data.find(m => m.arena === 1 && m.status === 'live');
        this.state.arena2 = data.find(m => m.arena === 2 && m.status === 'live');
        
        this.renderArenas();
        this.renderRecommendations();
    },

    renderArenas() {
        // Render UI Arena 1 & 2 (DOM Manipulation)
        console.log("Arena 1:", this.state.arena1 ? this.state.arena1.match_number : "KOSONG");
        console.log("Arena 2:", this.state.arena2 ? this.state.arena2.match_number : "KOSONG");
    },

    renderRecommendations() {
        // Sistem Rekomendasi: 
        // 1. Kedua tim diketahui (status 'ready')
        // 2. Tidak sedang bertanding di arena lain (otomatis karena status ready != live)
        const readyMatches = this.state.matches.filter(m => m.status === 'ready');
        
        // Pisahkan UB dan LB untuk rekomendasi
        const nextUB = readyMatches.find(m => m.bracket_type === 'UPPER');
        const nextLB = readyMatches.find(m => m.bracket_type === 'LOWER');

        // Tampilkan ke UI (Saran Arena)
        // DOM logic here...
    },

    async assignMatchToArena(matchId, arenaNumber) {
        await supabase.from('matches').update({
            arena: arenaNumber,
            status: 'live'
        }).eq('id', matchId);
        
        this.fetchDashboardData(); // Refresh Dashboard
    }
};
