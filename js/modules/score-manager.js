// Input Skor Per Game & Validasi BO3/BO5
import { supabase } from '../database/supabase.js';
import { BracketEngine } from './bracket-engine.js';

export const ScoreManager = {
    
    async submitGameScore(matchId, gameNumber, team1Score, team2Score) {
        // Tentukan pemenang game
        const winnerIndex = team1Score > team2Score ? 1 : 2;
        
        const matchData = await this.getMatchData(matchId);
        const winnerId = winnerIndex === 1 ? matchData.team1_id : matchData.team2_id;

        // Simpan skor game
        await supabase.from('match_games').upsert({
            match_id: matchId,
            game_number: gameNumber,
            team1_score: team1Score,
            team2_score: team2Score,
            winner_id: winnerId
        }, { onConflict: 'match_id, game_number' });

        // Evaluasi Seri
        await this.evaluateSeries(matchId);
    },

    async evaluateSeries(matchId) {
        const { data: match } = await supabase.from('matches').select('*').eq('id', matchId).single();
        const { data: games } = await supabase.from('match_games').select('*').eq('match_id', matchId);

        const winReq = match.format === 'BO5' ? 3 : 2;
        let t1Wins = 0;
        let t2Wins = 0;

        games.forEach(g => {
            if (g.winner_id === match.team1_id) t1Wins++;
            if (g.winner_id === match.team2_id) t2Wins++;
        });

        // Update skor agregat di tabel matches
        await supabase.from('matches').update({
            team1_score: t1Wins,
            team2_score: t2Wins
        }).eq('id', matchId);

        // Jika ada yang mencapai requirement kemenangan (2 untuk BO3, 3 untuk BO5)
        if (t1Wins >= winReq || t2Wins >= winReq) {
            const seriesWinnerId = t1Wins >= winReq ? match.team1_id : match.team2_id;
            const seriesLoserId = t1Wins >= winReq ? match.team2_id : match.team1_id;

            await BracketEngine.processMatchCompletion(matchId, seriesWinnerId, seriesLoserId);
            
            // Set match completed & lepaskan arena
            await supabase.from('matches').update({ 
                status: 'completed',
                arena: null 
            }).eq('id', matchId);
        }
    },

    // Keperluan Koreksi Skor (Mencegah bracket error jika salah input)
    async correctScore(matchId, adminUser) {
        // Logika untuk mereset status match turunan menjadi pending/kosong 
        // dan mencatat ke audit log.
    },
    
    async getMatchData(matchId) {
         const { data } = await supabase.from('matches').select('*').eq('id', matchId).single();
         return data;
    }
};
