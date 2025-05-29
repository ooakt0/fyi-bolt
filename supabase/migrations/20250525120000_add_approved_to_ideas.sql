-- Migration: Add 'approved' column to 'ideas' table
ALTER TABLE ideas ADD COLUMN approved boolean NOT NULL DEFAULT false;
