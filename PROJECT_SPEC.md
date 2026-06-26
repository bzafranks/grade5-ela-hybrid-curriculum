# PROJECT SPEC — Grade 5 ELA: Hybrid Learning Curriculum for Teacher Continuity

> **Portable rebuild spec.** Hand this to any Claude or developer to understand, continue, or
> rebuild the project with no access to the original machine or chat.

## 1. Summary
Flagship instructional-design portfolio site: a complete Grade 5 ELA **hybrid learning
ecosystem** that keeps instruction continuous during teacher shortages. Static website
(HTML/CSS/JS, no dependencies, no build), `localStorage` persistence, deployed to GitHub Pages.
Subtitle: "An Instructional Design Solution for Schools Experiencing Teacher Shortages."

## 2. Core idea / differentiator
Every lesson is a **complete multimedia module** designed to run in **four delivery models**
(face-to-face, synchronous, asynchronous, hybrid). Continuity is achieved by decoupling
instruction from any single expert: an embedded AI video carries direct instruction, activities
self-correct, rubrics anchor feedback, and every digital task has a printable fallback.

## 3. Tech & constraints
- Vanilla HTML5 + CSS3 + JS, no frameworks/build/deps. Web Speech API for video narration.
  `localStorage` for progress/badges/reflections. GitHub Pages hosting.
- Runs by double-clicking `index.html`; UDL + WCAG-minded; print styles; reduced-motion.
- Deploy account: **bzafranks** (see the portfolio account reference). Live URL pattern
  `https://bzafranks.github.io/grade5-ela-hybrid-curriculum/`.

## 4. File structure (all in repo root)
```
index.html              Home (overview, delivery models, project cards)
challenge.html          Instructional Design Challenge (5 analyses, ADDIE, outcomes)
framework.html          Curriculum Framework (8 strands, principles, scope & sequence)
units.html              All 6 units fully specified (accordions)
lessons.html            2 fully built multimedia sample lessons (CENTERPIECE)
teacher.html            Teacher Resource Center + Substitute Guide
students.html           Student Resource Center (dashboard + achievement badges)
assessment.html         Assessment system (diagnostic/formative/summative, rubrics, etc.)
implementation.html     Implementation Guide for leaders (PD, LMS, AI tools, timeline, ROI)
reflection.html         Professional ID case study
style.css               Premium academic design system
script.js               All interactive components
README.md               Project readme (with live badges)
PROJECT_SPEC.md          This file
downloads/              Lesson_1_1_Lesson_Plan.md, Lesson_1_1_Teacher_Notes.md,
                        Lesson_1_1_Student_Handout.md, Lesson_3_1_Student_Handout.md
assets/                 (images/screenshots)
```
Nav order (in every page): Home, Challenge, Framework, Units, Lessons, Teachers, Students,
Assessment, Implementation, Reflection.

## 5. Design system (style.css :root)
Palette: navy #1f3a5f / navy-dark #162b46, gold #d9a441, teal #2f8f8a, plum #7b5ea7,
coral #e07a5f, leaf #4c9a6e; bg #f6f8fb. Serif headings (Georgia), sans body (Segoe UI).
Components: sticky nav + hamburger, hero, cards/grids, buttons (gold/secondary/ghost), tags,
callouts, timeline, stat-row, accordions (details.acc), tabs, lesson-block (color variants),
tables, video player, quiz, flashcards, fitb, dnd, progress tracker, dashboard, badges,
annotation, reflection. Print + reduced-motion media queries.

## 6. Interactive components (script.js, init by data-attrs)
| Component | Hook | Notes |
|-----------|------|-------|
| Tabs | `.tabs[data-tabs]` > `.tab-panel[data-tab]` | buttons auto-built; used for delivery models |
| Quiz | `[data-quiz]` > `.quiz-q[data-answer][data-why]` | instant feedback + score |
| Flashcards | `[data-flashcards]` | flip cards + prev/next |
| Fill-in-blank | `[data-fitb]`, inputs `data-accept="a|b"`, `[data-check]` | |
| Drag & drop | `[data-dnd]`, `.drag-item[data-key]` ↔ `.drop-zone[data-key]` | tap fallback |
| Progress tracker | `[data-progress="UNIQUE"]` | localStorage `g5ela:`; fires `progresschange` |
| Reflection | `[data-reflection="UNIQUE"]` + `[data-save]` | localStorage `g5refl:` |
| Annotation | `[data-annotate]` | click words to highlight |
| Video player | `.video-player` > `.video-slide[data-narration][data-duration][data-interaction]` | Web Speech narration (young female voice via pickVoice), captions, `.video-interaction` banner, controls `[data-play/prev/next/restart/sound]`; only one plays at a time |
| Transcript download | `[data-download-transcript="#videoId"][data-title]` | builds .txt from slides |
| Print | `[data-print]` | window.print() |
| Dashboard | `[data-dashboard]` | aggregates all `g5ela:` progress; awards `.ach-badge[data-threshold]` |

Unique `data-progress` / `data-reflection` IDs are required to avoid state collisions.

## 7. Curriculum content
6 units: (1) Reading Like a Detective RL.5.1–3, (2) Informational Text Investigators RI.5.x,
(3) Opinion Writing & Argument W.5.1, (4) Narrative Writing Workshop W.5.3, (5) Poetry &
Figurative Language RL.5.4/L.5.5, (6) Research & Presentations W.5.7/8. Each fully specified on
units.html. Two fully built sample lessons on lessons.html: **Lesson 1.1 Making Inferences from
Evidence** (RL.5.1) and **Lesson 3.1 Building a Strong Claim** (W.5.1.a) — each with full lesson
anatomy + AI video + production assets (1.1 has the full production package). All content is
original; no copyrighted textbook material.

## 8. Lesson anatomy (every sample lesson includes)
Overview (title/grade/unit/time/objectives/success criteria/standards/materials/tech) ·
Introduction (hook/prior knowledge/EQ/targets) · AI video (overview + player + interaction
points + production assets) · Mini-lesson · Guided practice · Interactive activities ·
Independent practice (digital + printable) · Discussion (tabs by delivery model) ·
Differentiation (5 profiles) · Assessment (exit ticket/quiz/task/rubric/self-assessment) ·
Parent support · Extensions · Teacher notes · Downloads · Delivery-model comparison table ·
progress tracker.

## 9. Build/deploy/preview
Preview: double-click index.html or `python -m http.server 8000`. Deploy:
`gh repo create grade5-ela-hybrid-curriculum --public --source . --remote origin --push` then
`gh api --method POST repos/bzafranks/grade5-ela-hybrid-curriculum/pages -f "source[branch]=main" -f "source[path]=/"`.

## 10. Status & next steps
DONE: all 10 pages + README + spec + 4 download files; 6 units specified; 2 full multimedia
lessons. NEXT: build remaining lessons to full depth; SCORM/xAPI; multilingual narration;
usability testing; teacher-authoring kit.
