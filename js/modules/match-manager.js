// Manajemen Perpindahan Tim Upper & Lower
import { supabase } from '../database/supabase.js';

export const MatchManager = {
    async getMatch(matchId) {
        const { data, error } = await supabase.from('matches').select('*').eq('id', matchId).single();
        if (error) throw error;
        return data;
    },

    async advanceTeam(targetMatchNumber, teamId) {
        // Ambil target match
        const { data: targetMatch } = await supabase.from('matches')
            .select('*')
            .eq('match_number', targetMatchNumber)
            .single();

        let updateData = {};
        
        // Cek slot kosong (team1 atau team2)
        if (!targetMatch.team1_id) {
            updateData.team1_id = teamId;
        } else if (!targetMatch.team2_id) {
            updateData.team2_id = teamId;
            updateData.status = 'ready'; // Jika kedua slot penuh, set siap dimainkan
        }

        await supabase.from('matches').update(updateData).eq('match_number', targetMatchNumber);
    },

    async eliminateTeam(teamId) {
        await supabase.from('teams').update({ is_eliminated: true }).eq('id', teamId);
    },

    async activateMatch(matchNumber, team1Id, team2Id) {
        await supabase.from('matches').update({
            team1_id: team1Id,
            team2_id: team2Id,
            status: 'ready'
        }).eq('match_number', matchNumber);
    }
};
