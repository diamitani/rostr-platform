-- directory_contacts: the Artispreneur directory database (78K+ verified contacts).
-- Import the 78K rows from the artispreneur-directory repo export into this table.
-- The skill also accepts any CSV with these columns (see sample_contacts.csv).

create table if not exists directory_contacts (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,          -- playlist, venue, publication, station
  type          text not null           -- playlist | curator | venue | promoter | radio | press | blog
    check (type in ('playlist','curator','venue','promoter','radio','press','blog')),
  contact_name  text,                   -- booker / curator / editor name
  email         text,                   -- null = "research needed", never guessed
  url           text,                   -- playlist link, venue site, etc.
  city          text,
  region        text,                   -- state / metro
  country       text default 'US',
  genres        text[] default '{}',    -- lowercased tags, e.g. '{indie r&b,neo-soul}'
  reach         integer,                -- followers (playlist/curator) or capacity (venue)
  submission_policy text,               -- how they accept pitches, in their own words
  submission_url text,
  verified_at   date,
  notes         text
);

create index if not exists idx_contacts_type on directory_contacts (type);
create index if not exists idx_contacts_genres on directory_contacts using gin (genres);
create index if not exists idx_contacts_region on directory_contacts (region);
