-- Penyesuaian Struktur Database untuk SPECTRA (Double Elimination 20 Tim & Dual Arena)

-- Tabel Tim
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'verified',
    draw_position INT UNIQUE,
    is_eliminated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Pertandingan (Matches)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_number VARCHAR(10) NOT NULL UNIQUE, -- e.g., M1, M2, UB1, LB1, GF, GFR
    bracket_type VARCHAR(20) NOT NULL, -- UPPER, LOWER, GRAND_FINAL
    team1_id UUID REFERENCES teams(id),
    team2_id UUID REFERENCES teams(id),
    team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, ready, live, completed, bye
    arena INT, -- 1 atau 2 (NULL jika belum dialokasikan)
    format VARCHAR(10) DEFAULT 'BO3', -- BO3, BO5
    winner_to VARCHAR(10), -- Referensi match_number selanjutnya untuk pemenang
    loser_to VARCHAR(10), -- Referensi match_number selanjutnya untuk yang kalah (NULL jika eliminasi)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Detail Game (Untuk input skor per game)
CREATE TABLE match_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    game_number INT NOT NULL, -- 1, 2, 3, 4, 5
    team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    winner_id UUID REFERENCES teams(id),
    UNIQUE(match_id, game_number)
);

-- Tabel Audit Log (Untuk keamanan undian & perubahan skor)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL, -- e.g., 'DRAW_LOCKED', 'SCORE_CORRECTED'
    details JSONB NOT NULL,
    performed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
