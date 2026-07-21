# NxtWave EDGE — Complete Platform Documentation

## Project Overview

**NxtWave EDGE** is a B2B talent marketplace connecting Indian companies with pre-assessed engineering students. The platform replaces manual Excel/WhatsApp workflows with a digital portal featuring smart matching, shortlisting, and interview scheduling.

### Key Numbers
- 327+ pre-assessed students in pool
- 2,500+ hiring partners
- 16,000+ engineers placed
- Assessment scores: DSA, CS Fundamentals, Aptitude, Communication

---

## Current Manual Process (Pain Points)

### What Happens Today

```
1. Lead Gen Team → Sources jobs + contacts (CHRO/HR Head) → Adds to HubSpot
2. CRM/BD Team → Calls companies, pitches Edge candidates
3. Meeting → Shows landing page dashboard (live candidate data)
4. Company Confirms → Shares requirements with ISE team (Akanksha)
5. Akanksha → Manually filters profiles in Excel
6. Shares Application Link → Students apply
7. Hemanth → Resume shortlisting + evaluation remarks
8. 100-115 profiles shared in Excel sheet with company
9. Sharon (CRM) → Follows up with company
10. Akanksha → Coordinates with students
11. Hiring process continues until placement
```

### Pain Points

| Problem | Impact |
|---------|--------|
| Manual Excel sheets shared with companies | Poor client impression, no search/filter |
| Feedback via WhatsApp/phone calls | Lost, unstructured, hard to track |
| Interview scheduling requires back-and-forth | Time-consuming, error-prone |
| 15+ interview rounds with no centralized tracking | Chaos for both sides |
| Screening reports as PDFs | Not interactive, can't compare |
| Student expectations change w.r.t. job | Need to capture upfront |

---

## Two Hiring Flows

### Flow 1: Recruiter-Initiated (Self-Service)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Recruiter visits NxtWave EDGE landing page                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. Recruiter keeps filters (CTC, Location, Role, JD)          │
│     - Skills required                                           │
│     - Budget/CTC range                                          │
│     - Location preference                                       │
│     - Role name/type                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. System shows relevant candidates based on filters           │
│     - Pre-assessed students                                     │
│     - Match scores displayed                                    │
│     - Filter by skills, CGPA, college tier                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. Recruiter views candidates & notifies EDGE team             │
│     - Marks "Interested" on candidates                          │
│     - Adds notes/comments                                       │
│     - Downloads CSV if needed                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. EDGE team coordinates with candidates                       │
│     - Contacts interested students                              │
│     - Schedules interviews                                      │
│     - Manages hiring process                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 2: Company-Initiated (EDGE-Managed)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Company shares requirements with EDGE team                  │
│     - Skills, CTC, job title, location                          │
│     - College/branch criteria                                   │
│     - Number of positions                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. EDGE sends application link to eligible candidates          │
│     - Based on student expectations captured upfront            │
│     - Matched against job requirements                          │
│     - Application link sent via email                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. Students apply to the job                                   │
│     - Complete application form                                 │
│     - Submit resume/portfolio                                   │
│     - Confirmation email sent                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. EDGE shortlists candidates                                  │
│     - Resume shortlisting (Hemanth)                             │
│     - Evaluation remarks added                                  │
│     - 5:1 to 15:1 ratio depending on process                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. EDGE shares best fit candidates with company                │
│     - Via EDGE Platform (not Excel)                             │
│     - Digital profile cards with scores                         │
│     - Company can mark interest                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. Hiring process continues via EDGE Platform                  │
│     - Interview scheduling                                      │
│     - Status updates                                            │
│     - Pipeline tracking                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Common Thing
**The hiring process communication will happen via EDGE Platform.**

---

## Complete 12-Step Workflow

### Internal Flow (Steps 1-6)

| Step | Actor | Action | Details |
|------|-------|--------|---------|
| 1 | Recruiter | Job Created | Recruiter confirms hiring from NxtWave EDGE |
| 2 | Akanksha | Import Sheet | Upload shortlisted candidates to job |
| 3 | Akanksha | Send Candidates | Review shortlisted pool, click send to recruiter |
| 4 | Recruiter | Job Board Access | Recruiter logs in, sees shortlisted candidates |
| 5 | Recruiter | Hiring Pipeline | Track each candidate through stages |
| 6 | Both | Status Updates | Real-time tracking with activity log |

### External Flow (Steps 7-12) — After Email Sent

| Step | Actor | Action | Details |
|------|-------|--------|---------|
| 7 | System | Email Sent | System sends branded email with dynamic link |
| 8 | Company | Company Logs In | Corporate email + OTP authentication |
| 9 | Company | Views Profiles | Pre-filtered candidates based on job |
| 10 | Company | Clicks Interested | Mark interest on specific candidates |
| 11 | System | NxtWave Notified | Email + in-app notifications sent |
| 12 | Both | Pipeline Updates | Auto-update hiring pipeline stages |

### Dynamic URL Structure

```
/browse?jobId={jobId}&token={uniqueToken}

- jobId → Links to job requirements
- token → Unique per company, authenticates access
- Filters → Auto-applied based on job requirements

Examples:
- /browse?jobId=123&token=abc123 → Full Stack Developer at Sprint
- /browse?jobId=456&token=def456 → Backend Developer at TechCorp
- /browse?jobId=789&token=ghi789 → Data Analyst at DataCo
```

---

## Platform Features (What to Build)

### 1. Admin Dashboard (Akanksha)

**Purpose:** Manage jobs, import candidates, send to companies

**Features:**
- View all active job requirements
- Import candidates (Excel/CSV upload)
- Filter candidates by skills, CGPA, college tier, location
- "Send to Company" button → generates dynamic link + sends email
- View all shared candidates and their status

**UI Components:**
- Job list with status (active, closed, draft)
- Candidate pool with filters
- "Send to Company" modal
- Activity feed

### 2. Company Portal (Recruiter)

**Purpose:** View profiles, mark interest, track pipeline

**Features:**
- Dynamic URL access (token-based authentication)
- Pre-filtered candidates based on job
- "Interested" button on each candidate card
- Download CSV of filtered candidates
- View full candidate profiles
- Track hiring pipeline status

**UI Components:**
- Candidate cards with scores
- "Interested" toggle button
- CSV download button
- Profile detail modal
- Pipeline kanban board

### 3. Email System

**Purpose:** Send branded emails with dynamic links

**Features:**
- SendGrid integration
- Branded HTML templates
- Dynamic links with tokens
- Email tracking (opens, clicks)

**Email Types:**
- Shortlist email (to company)
- Interest notification (to NxtWave)
- Interview invitation (to student)
- Status update (to both)

### 4. Notification System

**Purpose:** Real-time alerts for all parties

**Features:**
- In-app notification bell
- Email notifications
- Real-time updates
- Notification history

**Notification Types:**
- Company marks interest → NxtWave notified
- Candidate status changes → Both notified
- Interview scheduled → Both notified
- New candidates shared → Company notified

### 5. Hiring Pipeline

**Purpose:** Track candidates through hiring stages

**Features:**
- Kanban board view
- Drag-and-drop status changes
- Auto-sync with HubSpot
- Activity log

**Pipeline Stages:**
- Sourced → Screening → Interview → Offer → Hired

---

## Database Schema

### Existing Tables (17 tables)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | Recruiter accounts | email, role, onboardingCompleted |
| `companies` | Company profiles | name, industry, size |
| `students` | Pre-assessed candidates | firstName, university, cgpa, scores |
| `company_requirements` | Job postings | jobTitle, requiredSkills, salary |
| `skills` | Master skill catalog | name, category |
| `student_skills` | Student-skill mapping | proficiencyLevel, assessmentScore |
| `projects` | Student portfolios | title, technologies, projectUrl |
| `contact_requests` | Recruiter interest | companyId, studentId, status |
| `assessments` | Assessment instances | overallScore, strengths |
| `assessment_questions` | Question bank | question, options, correctAnswer |
| `assessment_responses` | Individual answers | userAnswer, isCorrect, timeTaken |
| `code_submissions` | Coding solutions | code, language, score |
| `interviews` | Interview scheduling | companyId, studentId, status |
| `messages` | Communication | senderId, receiverId, content |
| `otp_codes` | OTP lifecycle | code, expiresAt, attempts |
| `sessions` | Session storage | sid, sess, expire |
| `id_verifications` | Identity verification | documentType, status |

### New Tables (To Add)

### New Tables (To Add)

#### 1. Jobs Table

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_description TEXT,
  skills TEXT[], -- Array of required skills
  location VARCHAR(100),
  min_cgpa DECIMAL(3,2),
  salary_min INTEGER, -- In thousands (e.g., 800 = 8 LPA)
  salary_max INTEGER,
  remote_allowed BOOLEAN DEFAULT FALSE,
  work_mode VARCHAR(50) DEFAULT 'onsite', -- onsite, hybrid, remote
  urgency_level VARCHAR(50) DEFAULT 'medium', -- low, medium, high, urgent
  status VARCHAR(50) DEFAULT 'active', -- active, closed, draft
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Candidate Shares Table

```sql
CREATE TABLE candidate_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) NOT NULL,
  student_id UUID REFERENCES students(id) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL, -- Unique access token
  shared_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Token expiry (7 days default)
  status VARCHAR(50) DEFAULT 'active', -- active, expired, viewed
  viewed_at TIMESTAMP, -- When company first viewed
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Company Interest Table

```sql
CREATE TABLE company_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) NOT NULL,
  student_id UUID REFERENCES students(id) NOT NULL,
  company_id UUID REFERENCES companies(id) NOT NULL,
  interested_at TIMESTAMP DEFAULT NOW(),
  notes TEXT, -- Company notes about candidate
  status VARCHAR(50) DEFAULT 'interested', -- interested, shortlisted, interviewed, hired
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Notifications Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL, -- interest, share, update, interview
  title VARCHAR(255) NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);
```

#### 5. Student Expectations Table

```sql
CREATE TABLE student_expectations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) NOT NULL,
  preferred_roles TEXT[], -- Array of preferred roles
  preferred_locations TEXT[], -- Array of preferred locations
  expected_salary_min INTEGER, -- In thousands
  expected_salary_max INTEGER,
  preferred_work_mode VARCHAR(50), -- onsite, hybrid, remote
  willing_to_relocate BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Entity Relationship

```
users ||--o| companies : has
companies ||--o{ jobs : posts
companies ||--o{ contact_requests : creates
companies ||--o{ company_interest : tracks
jobs ||--o{ candidate_shares : contains
jobs ||--o{ company_interest : has
students ||--o{ candidate_shares : receives
students ||--o{ company_interest : receives
students ||--o{ student_expectations : has
users ||--o{ notifications : receives
```

---

## API Endpoints

### Existing Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP, create session |
| GET | `/api/auth/user` | Get current user |
| POST | `/api/auth/logout` | Destroy session |
| PATCH | `/api/auth/update-profile` | Update user profile |
| PUT | `/api/auth/complete-onboarding` | Complete onboarding |

#### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List/filter students |
| GET | `/api/students/:id` | Get student detail |
| POST | `/api/students/job-match` | Score students against role |
| POST | `/api/students/job-match-by-id` | Match by job requirement ID |
| POST | `/api/students/smart-discovery` | AI-powered talent curation |

#### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company` | Get company by user |
| POST | `/api/company/register` | Register new company |
| POST | `/api/company/requirements` | Create job requirement |
| GET | `/api/company/requirements` | List company requirements |
| POST | `/api/company/parse-jd` | Parse JD text/PDF |

#### Shortlisting
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact-requests` | Create contact request |
| GET | `/api/contact-requests` | List company's requests |
| POST | `/api/send-shortlist-email` | Send shortlist notifications |

#### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews` | Schedule interview |
| GET | `/api/interviews` | List interviews |

#### Communication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages` | Send message |
| GET | `/api/messages` | List messages |
| POST | `/api/chatbot` | AI assistant (Mistral AI) |
| POST | `/api/contact-inquiry` | Candidate interest inquiry |
| POST | `/api/contact-general` | General contact inquiry |

### New Endpoints (To Add)

#### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/share-candidates` | Share candidates with company |
| GET | `/api/admin/shared-candidates` | List all shared candidates |
| POST | `/api/admin/import-candidates` | Import candidates from Excel/CSV |

#### Company Portal Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company/candidates/:jobId` | Get candidates for job (with token) |
| POST | `/api/company/interest` | Mark interest in candidate |
| GET | `/api/company/interest/:jobId` | Get company's interests for job |
| GET | `/api/company/download-csv/:jobId` | Download candidates as CSV |

#### Notification Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |

#### Student Expectations Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/student/expectations` | Save student expectations |
| GET | `/api/student/expectations` | Get student expectations |
| PATCH | `/api/student/expectations` | Update student expectations |

---

## Email Templates

### 1. Shortlist Email (To Company)

**Subject:** Your shortlisted candidates from NxtWave Edge

**Content:**
```
Hi [Company Name],

Great news! We've shortlisted [X] candidates for the [Job Title] position.

These candidates have been assessed through our rigorous evaluation process:
- Tier 1: Technical Assessment (DSA, CS Fundamentals)
- Tier 2: Interview Rounds (TR1, TR2)
- Verified scores and recommendations

[View Candidates Button] → /browse?jobId=XYZ&token=ABC

What you can do:
✓ View detailed candidate profiles
✓ See assessment scores and recommendations
✓ Download candidate list as CSV
✓ Mark candidates as "Interested"

The link expires in 7 days.

Best regards,
NxtWave Edge Team
```

### 2. Interest Notification (To NxtWave)

**Subject:** New interest from [Company Name]

**Content:**
```
Hi Akanksha,

[Company Name] is interested in the following candidates for [Job Title]:

1. [Candidate Name] - [University] - Score: [X]
2. [Candidate Name] - [University] - Score: [X]
3. [Candidate Name] - [University] - Score: [X]

Please coordinate with the candidates and update the pipeline.

Best regards,
NxtWave Edge System
```

### 3. Interview Invitation (To Student)

**Subject:** Interview Invitation from [Company Name]

**Content:**
```
Hi [Student Name],

Great news! [Company Name] would like to schedule an interview with you for the [Job Title] position.

Interview Details:
- Company: [Company Name]
- Role: [Job Title]
- Location: [Location]
- Date/Time: [To be coordinated]

Please confirm your availability by replying to this email.

Best regards,
NxtWave Edge Team
```

---

## Frontend Pages

### Existing Pages

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` | Marketing page |
| Login | `/login` | OTP authentication |
| Browse Students | `/browse` | Student directory with filters |
| Student Profile | `/student/:id` | Individual candidate profile |
| Shortlist | `/shortlist` | Saved candidates |
| Compare | `/shortlist/compare` | Side-by-side comparison |
| Talent Dashboard | `/talent-dashboard` | Analytics dashboard |
| Company Profile | `/jobs` | Company job management |

### New Pages (To Add)

| Page | URL | Purpose |
|------|-----|---------|
| Admin Dashboard | `/admin` | Manage jobs, import candidates |
| Company Portal | `/browse?jobId=X&token=Y` | Dynamic filtered view |
| Candidate Import | `/admin/import` | Excel/CSV upload |
| Shared Candidates | `/admin/shared` | Track shared candidates |
| Notifications | `/notifications` | Notification center |
| Student Expectations | `/student/expectations` | Capture student preferences |

---

## Mobile Responsiveness

### Current State
- SVG diagram has horizontal scroll on mobile
- "Best viewed on desktop" note displayed
- Min-width: 1200px for diagrams

### Requirements
- All pages must be responsive
- Mobile-first design approach
- Touch-friendly interactions
- Swipe gestures for carousel/pipeline

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) { ... }

/* Tablet */
@media (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

---

## Deployment Options

**Note:** Replit is NOT available. Use one of these alternatives:

### Option 1: Vercel (Recommended)

**Pros:**
- Free tier available
- Automatic deployments from GitHub
- Fast global CDN
- Easy setup

**Steps:**
1. Push code to GitHub
2. Connect Vercel to GitHub repo
3. Configure environment variables
4. Deploy automatically

**Environment Variables:**
```
DATABASE_URL=your_neon_database_url
SENDGRID_API_KEY=your_sendgrid_key
OPENAI_API_KEY=your_openai_key
SESSION_SECRET=your_session_secret
```

### Option 2: Railway

**Pros:**
- Free tier available
- Built-in PostgreSQL support
- Easy scaling
- Good for full-stack apps

**Steps:**
1. Push code to GitHub
2. Create Railway account
3. Connect GitHub repo
4. Add PostgreSQL plugin
5. Configure environment variables
6. Deploy

### Option 3: Render

**Pros:**
- Free tier available
- Static site hosting
- PostgreSQL support
- Easy setup

**Steps:**
1. Push code to GitHub
2. Create Render account
3. Connect GitHub repo
4. Create PostgreSQL database
5. Configure environment variables
6. Deploy

### Option 4: DigitalOcean App Platform

**Pros:**
- $5/month starter plan
- Managed databases
- Good performance
- Easy scaling

**Steps:**
1. Push code to GitHub
2. Create DigitalOcean account
3. Create app from GitHub
4. Add managed PostgreSQL
5. Configure environment variables
6. Deploy

### Option 5: AWS (Advanced)

**Pros:**
- Full control
- Scalable
- Enterprise-ready

**Components:**
- EC2 for compute
- RDS for PostgreSQL
- S3 for static assets
- CloudFront for CDN

---

## Key Constraints

### From Girish Discussion

1. **Student expectations change w.r.t. job**
   - Need to capture expectations upfront
   - Match based on student preferences
   - Not just company requirements

2. **Application link flow is critical**
   - Students must apply before sharing
   - Can't share all eligible candidates
   - Need to ensure student is interested

3. **Dynamic paths are mandatory**
   - URLs must be token-based
   - Each company gets unique link
   - Filters auto-applied

4. **Multiple jobs per company**
   - Support multiple requirements
   - Track each separately
   - Independent pipelines

5. **No candidate limit**
   - Share all relevant candidates
   - Let company decide
   - No artificial caps

6. **Communication via platform only**
   - No Excel/WhatsApp
   - All updates on platform
   - Full audit trail

### Technical Constraints

1. **Database:** Neon PostgreSQL (serverless)
2. **Email:** SendGrid (existing integration)
3. **CRM:** HubSpot (existing integration)
4. **Auth:** OTP-based (existing)
5. **Frontend:** Next.js + React + TypeScript + Tailwind
6. **Backend:** Next.js API Routes + Drizzle ORM
7. **AI:** Mistral AI (replacing OpenAI)
8. **Deployment:** Vercel (single project)

---

## Implementation Priority

### Phase 1: Core Features (MVP)
1. Database schema changes (new tables)
2. Admin dashboard (Akanksha)
3. Company portal (recruiter)
4. Email system (SendGrid)
5. Notification system

### Phase 2: Enhanced Features
6. CSV export
7. Student expectations capture
8. Pipeline kanban board
9. HubSpot sync enhancement

### Phase 3: Advanced Features
10. Mobile app (React Native)
11. Advanced analytics
12. AI-powered matching improvements
13. Calendar integration

---

## Architecture Decision (July 2026)

**Platform:** Next.js + Vercel (single deployment)
**Backend:** Next.js API Routes (replaces Express.js)
**Database:** Neon PostgreSQL (serverless)
**Deployment:** Vercel (frontend + API in one project)
**AI:** Mistral AI (replacing OpenAI)

### Why Next.js?
- Vercel is built for Next.js (optimal performance)
- Single deployment = frontend + backend
- Server-side rendering for SEO
- Edge functions for global low-latency

### Migration: React + Express → Next.js
| From | To |
|------|-----|
| React (Vite) | Next.js App Router |
| Express.js routes | Next.js API Routes |
| Wouter routing | Next.js file-based routing |
| OpenAI SDK | Mistral AI SDK |

---

## Environment Variables

| Variable | Purpose | Status |
|----------|---------|--------|
| DATABASE_URL | Neon PostgreSQL connection | ✓ Configured |
| SENDGRID_API_KEY | Email service (SendGrid) | ✓ Configured |
| SESSION_SECRET | Express session encryption | ✓ Configured |
| MISTRAL_API_KEY | AI chatbot (Mistral AI) | ✓ Configured |
| HUBSPOT_API_KEY | CRM integration (HubSpot) | ✓ Configured (.env.local) |

### Local Setup
```bash
# Create .env file with these variables
DATABASE_URL=your_neon_database_url
SENDGRID_API_KEY=your_sendgrid_key
SESSION_SECRET=your_session_secret
MISTRAL_API_KEY=your_mistral_key
HUBSPOT_API_KEY=your_hubspot_key
```

### How to Get Credentials
1. **DATABASE_URL** - From Neon dashboard or saved .env file
2. **SENDGRID_API_KEY** - From SendGrid dashboard or saved .env file
3. **SESSION_SECRET** - Generate with: `openssl rand -base64 32`
4. **MISTRAL_API_KEY** - From Mistral AI dashboard
5. **HUBSPOT_API_KEY** - From HubSpot integrations settings

---

## Remote Work Checklist

### Prerequisites (All Complete ✓)
- [x] GitHub repo access
- [x] Neon DATABASE_URL
- [x] SENDGRID_API_KEY
- [x] SESSION_SECRET
- [x] MISTRAL_API_KEY (replacing OpenAI)
- [x] HUBSPOT_API_KEY
- [x] Vercel account (user to set up)

### Local Setup (Any Machine)
```bash
git clone https://github.com/hiringNxtwave/nxtwaveEdge.git
cd nxtwave-edge
npm install
# Create .env with credentials (see Environment Variables section)
npm run dev
```

### Deployment to Vercel
```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL production
# (add other env vars)
vercel --prod
```

---

## Pending Items

### Must Complete First
- [ ] Refactor React → Next.js (single Vercel deployment)
- [ ] Set up Vercel project
- [ ] Configure environment variables on Vercel
- [ ] Test deployment

### Phase 1: MVP Features
- [ ] Database schema (4 new tables: jobs, candidate_shares, company_interest, notifications)
- [ ] Admin dashboard (Akanksha)
- [ ] Company portal (recruiter)
- [ ] Email system (SendGrid)
- [ ] Notification system

### Phase 2: Enhanced Features
- [ ] CSV export
- [ ] Student expectations capture
- [ ] Pipeline kanban board
- [ ] HubSpot sync enhancement

### Phase 3: Advanced Features
- [ ] MCP server for future extensibility
- [ ] Mobile responsiveness improvements
- [ ] Advanced analytics
- [ ] Calendar integration

---

## AI Integration: Mistral AI

### Migration from OpenAI
| Current | New |
|---------|-----|
| `openai` npm package | `@mistralai/mistralai` npm package |
| `gpt-4o-mini` model | Mistral model (e.g., `mistral-large-latest`) |
| OpenAI API endpoint | Mistral API endpoint |

### Files to Update
- `server/routes.ts` - Chatbot endpoint
- `package.json` - Replace openai with mistral package
- `.env.example` - Rename OPENAI_API_KEY → MISTRAL_API_KEY

---

## Quick Reference

### Commands
```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Database push
npm run db:push

# Type check
npm run check
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `shared/schema.ts` | Database schema |
| `server/routes.ts` | API endpoints |
| `server/hubspot.ts` | HubSpot integration |
| `server/storage.ts` | Data access layer |
| `client/src/pages/` | Frontend pages |
| `client/src/components/` | UI components |
| `hiring-flow.html` | Stakeholder diagram |
| `current_hiring_process.md` | Manual process docs |
| `ARCHITECTURE.md` | Technical architecture |
| `CLAUDE.md` | This file - Complete platform documentation |

---

**Last Updated:** July 21, 2026
**Version:** 2.0.0 (Next.js + Mistral AI)
