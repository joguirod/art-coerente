-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums
CREATE TYPE art_type AS ENUM ('PRE', 'POST');
CREATE TYPE stage_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- Engineer table
CREATE TABLE engineer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_confirmed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Password reset tokens
CREATE TABLE password_reset_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engineer_id UUID NOT NULL REFERENCES engineer(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ART table
CREATE TABLE art (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engineer_id UUID NOT NULL REFERENCES engineer(id) ON DELETE CASCADE,
    type art_type NOT NULL,
    art_number VARCHAR(50),
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    contractor_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pdf_path VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ART Activities
CREATE TABLE art_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    art_id UUID NOT NULL REFERENCES art(id) ON DELETE CASCADE,
    nivel_atuacao VARCHAR(100) NOT NULL,
    atividade_profissional_code VARCHAR(20) NOT NULL,
    atividade_profissional_desc VARCHAR(255) NOT NULL,
    obra_servico_code VARCHAR(20),
    obra_servico_desc VARCHAR(255),
    complemento VARCHAR(255),
    quantidade DECIMAL NOT NULL,
    unidade VARCHAR(50) NOT NULL
);

-- Coherence Analysis
CREATE TABLE coherence_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    art_id UUID NOT NULL REFERENCES art(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    coherent BOOLEAN NOT NULL,
    summary TEXT NOT NULL,
    alerts JSONB NOT NULL DEFAULT '[]',
    suggestions JSONB NOT NULL DEFAULT '[]',
    complementary_recommendations JSONB,
    chunks_used JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Project
CREATE TABLE project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engineer_id UUID NOT NULL REFERENCES engineer(id) ON DELETE CASCADE,
    art_id UUID REFERENCES art(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    obra_type VARCHAR(100),
    start_date DATE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Construction Stage
CREATE TABLE construction_stage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    stage_order INTEGER NOT NULL,
    status stage_status NOT NULL DEFAULT 'NOT_STARTED',
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Stage Update
CREATE TABLE stage_update (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID NOT NULL REFERENCES construction_stage(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Knowledge Chunk (pgvector)
CREATE TABLE knowledge_chunk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(255) NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_art_engineer_id ON art(engineer_id);
CREATE INDEX idx_art_activity_art_id ON art_activity(art_id);
CREATE INDEX idx_coherence_analysis_art_id ON coherence_analysis(art_id);
CREATE INDEX idx_project_engineer_id ON project(engineer_id);
CREATE INDEX idx_construction_stage_project_id ON construction_stage(project_id);
CREATE INDEX idx_stage_update_stage_id ON stage_update(stage_id);
CREATE INDEX idx_password_reset_token_token ON password_reset_token(token);

-- pgvector IVFFlat index for cosine similarity search
CREATE INDEX ON knowledge_chunk USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
