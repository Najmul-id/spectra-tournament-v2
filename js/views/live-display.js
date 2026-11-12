// Update Bracket dan Skor Realtime
import { supabase } from '../database/supabase.js';

export const LiveDisplay = {
    init() {
        this.subscribeToMatchUpdates();
        this.renderBracket();
    },

    subscribeToMatchUpdates() {
        // Menggunakan Realtime Supabase Channel
        supabase.channel('public:matches')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches' }, payload => {
                this.updateBracketUI(payload.new);
            })
            .subscribe();

        supabase.channel('public:match_games')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'match_games' }, payload => {
                this.updateLiveScoreUI(payload.new);
            })
            .subscribe();
    },

    renderBracket() {
        // Fetch all matches and render SVG/HTML bracket
    },

    updateBracketUI(updatedMatch) {
        // Animasi perpindahan tim di bracket atau update skor teks
        const matchElement = document.querySelector(`[data-match="${updatedMatch.match_number}"]`);
        if(matchElement) {
            // Update node UI
            matchElement.classList.add('flash-update');
        }
    },

    updateLiveScoreUI(newGame) {
        // Update overlay skor jika match sedang live di Arena 1/2
    }
};
