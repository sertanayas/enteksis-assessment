-- Bootstrap a fresh database. This intentionally does not drop or replace data.
-- For an existing table, review and apply equivalent ALTER TABLE migrations.
create table public.requests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  service text not null,
  description text not null,
  constraint requests_name_length check (
    char_length(btrim(name, E' \t\n\r\f\013')) between 2 and 100
  ),
  constraint requests_email_length check (
    char_length(btrim(email, E' \t\n\r\f\013')) between 3 and 254
  ),
  constraint requests_email_format check (
    btrim(email, E' \t\n\r\f\013') ~ '^(?:[A-Za-z0-9_''+\-]+\.)*[A-Za-z0-9_''+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$'
  ),
  constraint requests_service_allowed check (
    service in ('Workflow Automation', 'AI Assistant Integration', 'Data & Reporting Automation')
  ),
  constraint requests_description_length check (
    char_length(btrim(description, E' \t\n\r\f\013')) between 20 and 5000
  )
);

alter table public.requests enable row level security;
-- No public policies: all application inserts use the server-only privileged key.
