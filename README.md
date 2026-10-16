# Gokul N. R. — Editorial Portfolio

An editorial, cobalt-and-ivory personal portfolio for Gokul N. R. The site combines a responsive magazine-inspired layout with an art-directed static retro desk still life.

## Stack

- Next.js App Router, React, and TypeScript
- An optimized local WebP hero workstation asset for a fast, composed still-life treatment
- Framer Motion for restrained reveal motion
- CSS design tokens for the editorial palette, typography, texture, and responsive layout
- A server-side GitHub activity route with a secure optional GraphQL path and a cached public-data fallback

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For production checks:

```bash
npm run typecheck
npm run build
npm run start
```

## Content and customization

All factual portfolio content is centralized in [data/portfolio.ts](./data/portfolio.ts):

- Identity and contact settings
- The three featured projects and case-study copy
- Project repository and demo links
- Skills and journey milestones

The verified LinkedIn profile is included by default. Set `NEXT_PUBLIC_LINKEDIN_URL` only when a deployment-specific override is needed. Set `NEXT_PUBLIC_SITE_URL` to the public site URL for production metadata.

## GitHub activity

The “Built in public” section derives the GitHub account from the verified `site.github` profile URL in `data/portfolio.ts` (`Gokul-555180` at the time of writing). It requests a 365-day contribution calendar and metadata for the three featured repositories.

- When the server-only `GITHUB_TOKEN` is supplied, the route uses GitHub GraphQL’s `contributionsCollection`.
- Without a token, it reads GitHub’s public contribution-calendar markup and fetches each required calendar year separately so cross-year periods remain complete.
- Repository metadata and code-byte language data are retrieved through GitHub’s public REST API.

Responses are cached for one hour with stale-while-revalidate. No token is required for the public fallback and no credential is returned to the browser. See [.env.example](./.env.example) for optional configuration. A fine-grained token with only the public data access needed for the GraphQL query is sufficient when GraphQL is preferred.

## Featured project sources

- [GST Invoice Reconciliation](https://github.com/Gokul-555180/gst-invoice-reconciliation)
- [Samadhan Grievance Portal](https://github.com/Gokul-555180/Aanavandi-hackathon)
- [Virtual Science Lab / LabSphere](https://github.com/Gokul-555180/LabSphere---Virtual-Science-Lab)

The project cards use original CSS interface illustrations based on the documented product interfaces. They do not imply extra product capabilities or use unverified metrics.

## Project structure

```text
app/
  api/github/route.ts        # Cached GitHub calendar, repositories, and code-byte data
  page.tsx                   # Portfolio home page
  projects/[slug]/page.tsx   # Case-study routes
  globals.css                # Design tokens and responsive editorial system
components/
  portfolio-shell.tsx        # Home page sections and navigation
  github-activity-section.tsx # Client presentation for the GitHub public-work record
  editorial-doodles.tsx      # Original restrained SVG annotations
  project-art.tsx            # CSS interface illustrations
data/
  portfolio.ts               # Typed portfolio content
public/images/
  gokul-retro-workstation.webp # Local static hero workstation asset
```

## Deployment

This is a standard Next.js application and can be deployed to Vercel or any compatible Next.js host. No server-side API keys are required for the public GitHub fallback; outbound access to GitHub is needed for live data. `GITHUB_TOKEN` is optional and enables the official GraphQL contribution-calendar source.
