// Mesin Double Elimination (Logika Alur Bracket)
import { MatchManager } from './match-manager.js';

export const BracketEngine = {
    // Definisi mapping M1-M15 ke Upper/Lower sesuai format 20 tim
    // Diimplementasikan sebagai graf (winner_to, loser_to) di database.
    // Engine ini memverifikasi status kelayakan pertandingan.
    
    evaluateMatchReadiness(match) {
        // Pertandingan 'ready' jika kedua tim sudah terisi dan statusnya masih 'pending'
        if (match.team1_id && match.team2_id && match.status === 'pending') {
            return 'ready';
        }
        return match.status;
    },

    async processMatchCompletion(matchId, winnerId, loserId) {
        const match = await MatchManager.getMatch(matchId);
        
        // 1. Majukan Pemenang
        if (match.winner_to) {
            await MatchManager.advanceTeam(match.winner_to, winnerId);
        }

        // 2. Majukan yang Kalah (ke Lower Bracket) atau Eliminasi
        if (match.loser_to) {
            await MatchManager.advanceTeam(match.loser_to, loserId);
        } else {
            // Eliminasi langsung
            await MatchManager.eliminateTeam(loserId);
        }

        // 3. Cek kondisi Grand Final Reset
        if (match.bracket_type === 'GRAND_FINAL' && match.loser_to === 'GFR') {
            const isLowerBracketTeamWinner = await this.checkIfLowerBracketTeam(winnerId, match);
            if (isLowerBracketTeamWinner) {
                // Aktifkan Grand Final Reset
                await MatchManager.activateMatch('GFR', winnerId, loserId);
            } else {
                // Turnamen Selesai
                await MatchManager.markTournamentComplete(winnerId);
            }
        }
    },

    async checkIfLowerBracketTeam(teamId, grandFinalMatch) {
        // Logika untuk menentukan apakah pemenang GF berasal dari Lower Bracket
        // Berdasarkan asal slot kedatangan (bisa dicek dari riwayat match)
        return true; // Placeholder logika
    }
};
