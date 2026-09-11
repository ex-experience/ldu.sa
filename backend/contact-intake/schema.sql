-- LDU website lead intake storage.
-- Run in a DEDICATED Supabase project for LDU, not in an unrelated application project.
create extension if not exists pgcrypto;

create table if not exists public.website_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  company text check (char_length(company) <= 140),
  role text check (char_length(role) <= 120),
  email text not null check (char_length(email) <= 160),
  market text not null check (market in ('Saudi Arabia','GCC','MENA','International')),
  project_type text not null check (project_type in ('partnerships','advisory','orchestration','experience','other')),
  budget text not null check (budget in ('under100','100-500','500-1500','1500plus','undisclosed')),
  timeline text not null check (timeline in ('lt30','30-90','90-180','180plus')),
  objective text not null check (char_length(objective) between 10 and 1400),
  context text check (char_length(context) <= 1000),
  language text not null default 'en' check (language in ('en','ar','fr','es')),
  lead_score smallint not null check (lead_score between 0 and 100),
  source_page text,
  user_agent text,
  status text not null default 'new' check (status in ('new','reviewing','qualified','declined','closed'))
);

alter table public.website_leads enable row level security;
-- Intentionally no public SELECT/INSERT policies. The Edge Function writes with the service-role key.
create index if not exists website_leads_created_at_idx on public.website_leads (created_at desc);
create index if not exists website_leads_status_idx on public.website_leads (status, created_at desc);
create index if not exists website_leads_score_idx on public.website_leads (lead_score desc, created_at desc);
