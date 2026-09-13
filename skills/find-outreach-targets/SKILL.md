# find-outreach-targets

> Tell it your goal in plain words — "I need to get on a playlist" or "book
> me gigs in Chicago" — and it finds the best-matched playlists, venues,
> curators, and promoters in the directory, then writes a tailored outreach
> message for each one.

**Price:** $25 · **Vertical:** directory · **Version:** 1.0.0

## When to use

The artist has a goal and an audience to reach: playlist placement, gig
booking, radio, press, or blog coverage. This skill turns "get me out there"
into a ranked hit-list plus ready-to-send messages.

## Inputs

- `goal` (required) — plain words: "get on playlists", "book gigs",
  "college radio", "press for my single", or a mix.
- `artist_name`, `genres[]`, `home_city`, `home_region`
- `links` — Spotify/Apple/YouTube/Instagram URLs
- `epk_ref` (optional) — path to an EPK built by `create-an-epk`. If
  missing, the skill asks the 5 questions it needs (genre, city, best
  song link, 1-line pitch, draw/fanbase size).
- `radius_miles` (default 100 for gigs, ignored for playlists/online)
- `tier` — `emerging` (default), `developing`, `established`. Emerging
  artists get matched to indie curators and small rooms, not arenas.

## The directory (data source)

The skill queries the Artispreneur contacts database — 78K+ verified
music-industry contacts. Any of these backends works:

1. **Supabase** (production) — table `directory_contacts`, see
   `schema.sql`. Import the 78K rows from the `artispreneur-directory`
   repo export.
2. **CSV** (simple) — any CSV matching the schema. A demo file with
   sample rows ships as `sample_contacts.csv` so the skill runs
   out of the box.

Never invent contact details. If a row has no email, the target is
listed as "research needed" — the bot does not guess addresses.

## Procedure

### 1. Parse the goal into target types

| Goal words | Target types queried |
|---|---|
| playlist, spotify, streams | playlist, curator |
| gig, show, book, tour, venue | venue, promoter |
| radio | radio |
| press, blog, coverage, premiere | press, blog |

Mixed goals ("playlists and gigs") query both and deliver two sections.

### 2. Build the artist profile

If `epk_ref` is provided, pull name, genres, city, links, and the
1-line pitch from it. Otherwise ask exactly 5 questions, no more.

### 3. Query and score

Filter by target type, then score each contact 0–100:

- **Genre fit (40 pts)** — overlap between artist genres and contact
  genre tags. No overlap = excluded, no exceptions.
- **Location fit (25 pts)** — gigs: within radius, same region first.
  Playlists/online: location ignored, scored on the other axes.
- **Tier fit (20 pts)** — emerging artists match indie curators,
  small rooms (<300 cap), community radio. Never pitch an arena
  booker with 200 monthly listeners.
- **Submission openness (15 pts)** — contacts with a published
  submission policy or URL outrank cold-email-only ones.

Return the top 20 per target type, ranked, with the score shown.

### 4. Write tailored messages

One message per target, following `references.md` (the playbook).
Every message is genuinely tailored: it names something real about
the target (a playlist's recent adds, a venue's calendar, a curator's
stated taste) drawn from the directory row — never flattery from
nothing. Template skeletons:

- **Playlist/curator:** subject + 3-line pitch + link + 1-line bio.
  Indie Bible tone: short, no hype words.
- **Venue/promoter:** subject + available dates + draw + links +
  EPK attachment note + tech needs in one line.
- **Radio/press:** angle-first — why this story, why now, why them.

Rules (hard):
- One outreach message + one follow-up per target, 7 days apart.
- No mass blasts. No "Dear Sir/Madam". No fake familiarity
  ("I've been a huge fan" — unless true).
- Every email includes the artist's real reply-to and an opt-out line.
- Never promise what the artist can't deliver (dates, exclusives).

### 5. Deliver the outreach packet

A markdown file per run:
- Ranked target table (name, type, score, why it fits, contact).
- The tailored message under each target, ready to copy.
- A follow-up schedule (dates, which targets).
- "Research needed" list for targets missing contact info.

## Outputs

- `outreach-packet-<artist>-<date>.md` — the full packet.
- Logged to the hub: targets pitched, messages sent, follow-up dates.

## Pairs well with

- `create-an-epk` — the profile and pitch source. Run it first if the
  artist has no EPK.
- `add-music-to-collaborative-playlist` — the playlist-pitching
  specialist for Indie Bible style campaigns.
- `create-content-calendar` — announce the wins the outreach lands.
