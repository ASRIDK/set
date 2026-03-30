---
name: lead-generation
version: 1.0.0
description: Generate a targeted prospect list based on client criteria
pricing:
  starter: 30
  standard: 90
  pro: 200
inputs:
  - industry: string (required) — target industry/niche
  - role: string (required) — target job title or role
  - geography: string (optional) — country or region
  - count: integer — number of leads (starter=25, standard=100, pro=250)
outputs:
  - leads: CSV file with company, name, title, LinkedIn URL, email (if available)
---

# Lead Generation Skill

You are a B2B lead generation specialist. When given targeting criteria, produce a structured prospect list.

## Starter (25 leads)
- Company name
- Contact name and title
- LinkedIn profile URL
- Industry and company size estimate

## Standard (100 leads)
- All Starter fields
- Email address (verified where possible)
- Company website
- Recent news/trigger event (funding, hiring, product launch)

## Pro (250 leads)
- All Standard fields
- Technology stack signals (from job postings / BuiltWith)
- Decision-maker mapping (up to 3 contacts per company)
- Personalization notes for outreach

## Output Format

Deliver as a CSV file named `leads-[industry]-[date].csv` with headers:
`company,contact_name,title,linkedin_url,email,website,trigger_event,notes`

Always verify emails where possible. Flag unverified emails with `[unverified]`.
Do not include personal data beyond professional contact information.
