# Lola Guevara — Landing / Personal Hub

## Overview

A single-page, long-scroll website for **Lola Guevara** (transpersonal psychologist and systemic family therapist, Madrid). The page is a personal hub: it explains quickly who Lola is and sends visitors to one of her three entry points:

| Entry point | Audience | Button / destination |
|---|---|---|
| **Contenidas** | Mothers in crisis (divorce, migration, teenage children) | Instagram @madrescontenidas (temporary, until Contenidas has its own sales landing) |
| **Dō** | Companies, groups, retreats (workshop facilitation) | `mailto:lolaguevara2020@gmail.com` |
| **1:1 sessions** | Individual process | Calendly — `calendly.com/lolaguevara2020` |

**Page structure:** Header → Hero → About → Credentials → Find your starting point → Testimonials → FAQ (accordion) → Closing CTA → Footer (social links).

**Source of truth for content:** `Brief_Landing_LolaGuevara.md` and `design-system-lola.html` (in the Claude project "Lola Website").

**Legal wording rule:** never use "psicóloga clínica", "psicoterapia", "diagnóstico", "tratamiento" or "pacientes" on the site. Use "psicóloga transpersonal", "terapeuta sistémica", "acompañamiento emocional/terapéutico".

## Tech setup

- **Stack:** plain HTML + CSS + JS, no build step.
- **Folder structure:**
  ```
  index.html
  css/styles.css
  js/functions.js
  img/        (webp images)
  video/      hero-lola.mp4 + hero-lola.webm (compressed hero video)
  ```
- **Repository:** https://github.com/dei998-dev/lola-website (branch `main`)
- **Hosting:** Cloudflare Pages, connected to the GitHub repo. Every push to `main` deploys automatically.
  - Build command: *(empty)* · Output directory: *(root)*
- **Domain:** `lolaguevara.com`, managed in Cloudflare, attached to the Pages project as a custom domain.

### Publishing a change
```
git add -A
git commit -m "Describe the change"
git push
```
The live site updates about a minute after the push.

> Note: every file in this repo is publicly reachable on the site (including this file at `/PROJECT.md`). Don't put private information here.

## Log of steps

### 2026-10-12
- Moved CSS and JS into `css/` and `js/` folders; updated the links in `index.html` (`css/styles.css`, `js/functions.js`).
- Initialized Git in the project folder (branch `main`, user `dei998-dev`), added `.gitignore`, made the initial commit.
- Created the GitHub repository `dei998-dev/lola-website` and pushed the code (authentication with a personal access token).
- Created a new Cloudflare Pages project connected to the GitHub repo (the old Pages project was a direct upload and can't be linked to Git).
- Connected `lolaguevara.com` to the new Pages project. Verified the live site serves the new version.
- Added this `PROJECT.md`.
- Hero video: compressed the 28 s export (`video/Sequence 01.mp4`, 36 MB) to `video/hero-lola.mp4` (2.3 MB, H.264) and `video/hero-lola.webm` (1.8 MB, VP9), 1280×720, no audio. The original stays local only (in `.gitignore`).
- Generated `img/hero-poster.webp` from the first second of the video (shown while the video loads and for visitors with reduced motion).
- Hero styling: dark warm veil (gradient + soft halo behind the title) over the video, light text with a subtle shadow, light header links. Fixed a layering bug that put the veil behind the video.
- Strengthened the dark halo behind the hero text (larger, denser radial gradient) for more contrast over the video.
- Added testimonial photos for Irene and Ma Angélica (converted to WebP, cropped 3:4, 400×533, matching the other testimonial photos).

## Pending / to-do

- [x] Hero video and poster.
- [ ] Review the hero video content against the brief: some clips show the Las Lolas duo (#EstaEsMiCanción) and third-party logos (FM Mundo), and the brief says Las Lolas should not appear on this page.
- [ ] Confirm `www.lolaguevara.com` is also active as a custom domain.
- [x] Testimonial photos for Irene and Ma Angélica.
- [ ] WhatsApp community link (when Lola creates it).
- [ ] Contenidas sales landing (when it exists, replace the Instagram link in the "Conocer Contenidas" buttons).
- [ ] Final brand identity (colors, typography, logo) from the brand designer — swap in without changing content.
