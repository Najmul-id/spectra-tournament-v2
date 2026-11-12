// Modul Undian Roulette dengan Pengacakan Kriptografis (Web Crypto API)
import { supabase } from '../database/supabase.js';

export const DrawModule = {
    state: {
        isLocked: false,
        teams: [],
        drawResults: []
    },

    init(teams) {
        this.state.teams = teams;
    },

    // Kriptografis RNG
    secureRandom(max) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    },

    // Proses pengacakan di belakang layar sebelum animasi
    generateSecureDraw() {
        if (this.state.isLocked) throw new Error("Undian sudah dikunci!");
        
        let availableTeams = [...this.state.teams];
        let shuffled = [];
        
        while (availableTeams.length > 0) {
            const randomIndex = this.secureRandom(availableTeams.length);
            shuffled.push(availableTeams.splice(randomIndex, 1)[0]);
        }
        
        this.state.drawResults = shuffled.map((team, index) => ({
            ...team,
            draw_position: index + 1
        }));
        
        return this.state.drawResults;
    },

    // Simulasikan putaran roulette untuk UI
    async animateRoulette(targetTeam, displayElement) {
        return new Promise(resolve => {
            let ticks = 0;
            const maxTicks = 30; // Durasi animasi
            const interval = setInterval(() => {
                // Tampilkan nama acak selama berputar
                const randomVisual = this.state.teams[this.secureRandom(this.state.teams.length)];
                displayElement.innerText = randomVisual.name;
                
                ticks++;
                if (ticks >= maxTicks) {
                    clearInterval(interval);
                    displayElement.innerText = targetTeam.name; // Berhenti di hasil sebenarnya
                    resolve();
                }
            }, 100);
        });
    },

    // Kunci hasil undian dan simpan ke Supabase
    async lockResults(adminUser) {
        try {
            // Update tim dengan posisinya
            for (const team of this.state.drawResults) {
                await supabase.from('teams')
                    .update({ draw_position: team.draw_position })
                    .eq('id', team.id);
            }

            // Catat ke Audit Log
            await supabase.from('audit_logs').insert([{
                action: 'DRAW_LOCKED',
                details: { results: this.state.drawResults },
                performed_by: adminUser
            }]);

            this.state.isLocked = true;
            return true;
        } catch (error) {
            console.error("Gagal mengunci undian:", error);
            throw error;
        }
    }
};
