create table integration_connections (
  connector text primary key,
  display_name text not null,
  status text not null default 'not_implemented'
    check (status in ('not_implemented', 'disconnected', 'connected', 'degraded', 'disabled')),
  required_configuration jsonb not null default '[]'::jsonb,
  public_configuration jsonb not null default '{}'::jsonb,
  secret_version integer not null default 0,
  last_test_at timestamptz,
  last_sync_at timestamptz,
  last_error_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table webhook_inbox (
  id uuid primary key default gen_random_uuid(),
  connector text not null references integration_connections(connector),
  external_event_id text not null,
  event_type text not null,
  payload jsonb not null,
  critical boolean not null default false,
  signature_valid boolean not null,
  status text not null check (status in ('accepted', 'rejected', 'processed', 'failed')),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (connector, external_event_id)
);

create table integration_jobs (
  id uuid primary key default gen_random_uuid(),
  inbox_id uuid not null unique references webhook_inbox(id),
  connector text not null references integration_connections(connector),
  status text not null check (status in ('pending', 'processing', 'retry', 'completed', 'dead_letter')),
  priority smallint not null default 0,
  attempt_count integer not null default 0,
  next_attempt_at timestamptz not null,
  locked_at timestamptz,
  finished_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index integration_jobs_ready_idx
  on integration_jobs (priority desc, next_attempt_at, created_at)
  where status in ('pending', 'retry');

create table integration_deliveries (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references integration_jobs(id),
  destination text not null,
  attempt integer not null,
  status_code integer,
  duration_ms integer,
  success boolean not null,
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

create table integration_dead_letters (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references integration_jobs(id),
  connector text not null references integration_connections(connector),
  reason text not null,
  payload_snapshot jsonb not null,
  resolved_at timestamptz,
  resolved_by text,
  created_at timestamptz not null default now()
);

create table integration_audit_log (
  id bigint generated always as identity primary key,
  actor text not null,
  action text not null,
  connector text references integration_connections(connector),
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into integration_connections (connector, display_name) values
  ('deskcommcrm', 'DeskcommCRM'),
  ('aureuserp', 'AureusERP'),
  ('documenso', 'Documenso'),
  ('mercado_pago', 'Mercado Pago'),
  ('plane', 'Plane'),
  ('forgejo', 'Forgejo'),
  ('github', 'GitHub'),
  ('freescout', 'FreeScout'),
  ('bookstack', 'BookStack'),
  ('uptime_kuma', 'Uptime Kuma'),
  ('waha', 'WAHA'),
  ('evolution_api', 'Evolution API dedicada'),
  ('supabase', 'Supabase'),
  ('resend', 'Resend'),
  ('google_calendar', 'Google Calendar'),
  ('meta', 'Meta'),
  ('google_ads', 'Google Ads'),
  ('brasil_api', 'BrasilAPI'),
  ('receita_ws', 'ReceitaWS'),
  ('nfse', 'NFS-e')
on conflict (connector) do update set display_name = excluded.display_name;
