export const ORIGIN_OF_STELE_MARKDOWN = `# STELE

## The Ultimate White Paper & Product Requirements
**Version 2.0 — Consolidated**  
**September 2026**

---

# PART ONE — WHITE PAPER

---

### 1. The Name

A stele is an ancient stone slab inscribed with public records, law, and memory.

Institutions outlive the people who build them by writing things down. A club's memory should not graduate with its seniors. A student's contribution should not vanish when they leave. A nation's opportunities should not drown in a feed built to sell attention.

The name is the thesis. Everything below follows from it.

---

### 2. The Problem

Students do not lack information. They lack a place where commitments live.

A student arrives at a new school. They want to build something — a portfolio, a record, a reason to be admitted somewhere. They look for opportunities. What they find is:

- Club activities scattered across WhatsApp groups they weren't added to.
- Competitions announced on Facebook, buried under entertainment within hours.
- Deadlines that live nowhere.
- No calendar, no ownership, no record of who was supposed to do what.
- Every institution running its own isolated system, or none at all.

They dart between apps. They miss things they never saw. They get blamed for tasks they were never shown. Every June, the seniors graduate and take the club's operational memory with them — and the next cohort repeats the same mistakes, pays for them again, and forgets them again.

And in the noise, something worse happens than missing information. The opportunity loses its dignity. A national olympiad announcement sitting next to cheap entertainment stops looking like an opportunity. It looks like just another post. The student scrolls past, not because they didn't care, but because nothing in that environment ever told them this was worth caring about.

---

### 3. Why Existing Solutions Fail

**Google Classroom** is an ecosystem locker. It assumes the school has adopted it, the teacher organises into modules, the student shows up to be taught. It is not built for a student who wants to find opportunities the school never offered.

**Club management software** has a utilitarian interface. It's built for the person who has to operate it and has no choice. A club president who has only ever used WhatsApp and Instagram will not read documentation.

**School management systems** are built for administrators. They track attendance and grades. They do not connect institutions to each other. They do not reach students with anything the student actually wants.

**Social media** is where opportunity currently lives, and it is the worst possible place for it. The platform's job is to keep the student scrolling. The club's job is to be seen. These are opposite goals, and the platform always wins.

Nothing occupies the middle ground between a niche club tool and a full enterprise system. Nothing is light enough to be adopted without a decision, and serious enough to be trusted with a record that matters.

---

### 4. What Stele Is

Stele is a federated, offline-first institutional operating system where each instance governs its own students, staff, and records in full sovereignty, while a tagged federation carries opportunities across institutions — giving every student a quiet feed that spans their school's internal life and the broader national landscape.

It has three planes.

- **The Institutional plane** is the school's own system — attendance, grades, timetable, discipline, sections, clubs, notices. It is sovereign. It never leaves the instance. No other school can read it, query it, or moderate it.
- **The Federation plane** carries opportunities between institutions. It carries offers, not records. A school publishes an opportunity outward; the federation delivers it to students in scope. Nothing internal ever crosses the wire, because the wire format has no shape for it.
- **The Student-Facing plane** is what the student sees — a quiet feed, their own commitments, their own record. It reads from both planes without merging them.

---

### 5. What Makes It Different

- **It is quiet.** No algorithm. No infinite scroll. No engagement metrics. No ranking by popularity. Nothing is sorted by anything except scope and deadline. A student can read everything and put the phone down. An empty feed on a slow day is the product working.
- **It is frictionless.** No training. No configuration before use. If it isn't easier than not using it, it has failed. A teacher who has used WhatsApp can use it. A club president who has used Instagram can run a club on it.
- **It is sovereign.** The student owns their federation identity. The institution owns its records. Neither reaches into the other. The student carries their ledger anywhere; the institution keeps its own account of what it witnessed.
- **It is witnessed.** Nothing a student claims about themselves carries weight unless a named person confirmed it. The record is a chain of witnessed acts — person, act, moment, witness — and nothing else travels.
- **It is federated by geography.** Schools federate district-first, then upward only by choice. The local network is the default. The world is reachable, not imposed.
- **It is honest about money.** Schools publish free. NGOs and olympiad bodies pay a reduced rate. Commercial entities pay full rate, mandated. Revenue comes from whoever is buying attention, never from the students whose attention is being bought.

---

### 6. What Stele Refuses To Be

- It never sells student attention. Not as data, not as reach.
- It never ranks by engagement. Nothing reorders except scope and deadline.
- It never compares students globally. No institution-wide leaderboard, no national ranking.
- It never labels a person. No reliability score. No "ghost" designation. No character assessment.
- It never adjudicates disputes. It records what each side wrote and lets a reader decide.
- It never lets one institution reach into another. The boundary is absolute.
- It never requires a school to adopt it for its students to benefit.

---

### 7. The Eight Principles

These are stances, not features. When a question can't be answered by the spec, one of these answers it.

1. **On attention.** Stele is quiet by default. If a change makes the product louder, it is wrong. If it makes it quieter, it is probably right.
2. **On the student.** The record belongs to the person who earned it. No institution, no network, no operator can reach in and change it. Every other decision bends to this.
3. **On the institution.** No instance can act on another. The boundary is absolute. If a feature requires crossing it, the feature is wrong.
4. **On adoption.** If it isn't easier than not using it, it fails. Convenience beats completeness, every time.
5. **On fairness.** Where strict fairness and ease of adoption conflict, adoption wins. The system is a mirror, not a judge.
6. **On noise.** Nothing is ordered by engagement, ever. Nothing is recommended, ever. The student is the algorithm.
7. **On scope.** Stele does not decide what a school is. It carries the school's own answer as data.
8. **On the boundary.** A school is sovereign inside its walls. A student is sovereign inside their record. Nothing crosses without both sides holding their ground.

---

### 8. Who Stele Serves

- **The Dweller.** A student whose only interest is opportunities, news, and resources. They commit only to what they choose. Nothing is expected of them by anyone else.
- **The Aspirant.** All of the Dweller, plus networking and volunteering. They want in, and they want to know what it takes.
- **The Loyal Core.** All of the Aspirant, but focused on one or a few clubs. They carry the work.
- **The Steward.** A senior executive. They delegate, curate, broadcast, write the wiki, and hand the seat on when they leave.
- **The Teacher.** A class teacher running a section — notice board or workspace, their choice.
- **The Authority.** A principal or coordinator, observing the campus in aggregate.
- **The Alumni.** A departed Steward, read-only forever.
- **And outside the walls:** the NGO, the olympiad body, the national organisation, the commercial publisher — anyone offering something to students who isn't a school.

---

# PART TWO — PRODUCT REQUIREMENTS

---

### 9. The Navigation

Four items, for every role. The labels never change. The contents do.

- **Home** — a short vertical stack of preview cards. Commitments, notices, opportunities. Tap a card to expand it. Home itself never scrolls as a feed; it's a table of contents.
- **Radar** — the opportunity feed. Federation opportunities, filtered by the student's interests, plus a one-tap toggle to see institution-only content. Plus a browse surface for deliberate searching.
- **Board** — the commitments board. What the student has claimed, registered for, or been given. Sorted by deadline. Rings on everything with a deadline.
- **Campus** — the directory. Clubs, sections, classes, resources. The student's own section is highlighted.

---

### 10. Screen — Home

**What it is.** A preview stack. Not a feed.

**What's on it.** Three kinds of card, in fixed order:

1. **Commitments.** One card per thing the student has taken on. Each carries a countdown ring.
2. **Notices.** Institutional notices — authority announcements, urgent national news, fee reminders, timetable changes. Reach counts are hidden from students; they matter to the publisher, not the reader.
3. **Opportunities.** A short stack of federated items matching the student's interests.

Each card shows just enough to decide: source badge, one line of context, countdown ring if it's a commitment. Tapping opens the full surface.

**What's deliberately absent.** Infinite scroll. Recommended content. Anything that reorders itself.

---

### 11. Screen — Radar

**Who sees what.**

Every student sees a feed sorted by scope first, deadline second.

- District items first — schools in the student's district.
- Division next.
- National next.
- International last.

Within each scope, sorted by deadline ascending. Nothing reorders for any reason. No endorsements pin items. No popularity raises them.

**Filters.**

Every item passes three gates before reaching the feed:

1. **Who speaks.** Only publishers with standing. A school, a verified publisher, a vouched body. Payment buys the right to speak; it never buys volume.
2. **How it's ordered.** By scope, then deadline. Never by engagement.
3. **What reaches the student.** The student's declared interest tags. Applied to the federation plane only — institution items always arrive regardless of tags.

**Browse.**

A separate surface, opened deliberately. Filter by tag, scope, source type, deadline window, endorsement. Results are the same cards, still deadline-sorted. No infinite scroll. Filters only for v1; free-text search later if it earns its place.

**What the student sees on every card.**

- Issuing institution, space, and Steward — always named.
- Provenance badge: Official, Institutional, or Peer.
- Trust signal: who has endorsed it.
- Countdown ring if the student has engaged with it.

**What the student does.**

- **Star** an item to watch it. No commitment, no countdown, no reminders.
- **Register, Book, or RSVP** to commit to it. This turns the card into a commitment — a countdown ring appears, reminders begin, and it moves to the Board.
- **Add to calendar** to schedule a personal reminder without committing.
- **Apply**, if the item accepts applications, with the option to attach ledger entries.

---

### 12. Screen — Board

**What it is.** The student's commitments, and only their commitments.

**Three sections.**

- **Active.** Things they've registered for, claimed, or been assigned. Sorted by deadline. Countdown rings active.
- **Watched.** Starred items. No rings. Quieter.
- **Past.** Completed or missed. Missed items are grey and dashed — never red.

**The two kinds of commitment.**

- **Self-chosen.** Registered for a competition, booked a workshop. Recorded in the student's ledger, unwitnessed. Invisible to hosts unless the student wins or earns recognition.
- **Delegated.** A club task, a section assignment. Recorded in the same ledger, flagged as witnessed. The Steward's or teacher's name is on the entry.

Both appear on the Board. The flag distinguishes them.

---

### 13. Screen — Campus

**What it is.** The directory.

**What's on it.**

- **Clubs.** Browse without joining. See what each club offers, its recent activity, its current opportunities.
- **Sections.** Your own section is highlighted. Class resources live here — syllabus, notes, prep materials, whatever the teacher has published.
- **Classes.** The student's academic year, and everything attached to it.
- **Resources.** Curated by teachers, clubs, and alumni. Well-categorised. Prep materials for competitions, notes for subjects, syllabus updates.

**Role views:**
- **Dweller:** Browse. Read. Watch. Nothing else is required.
- **Aspirant:** Join a club as an explorer. See application status.
- **Loyal Core:** Their club's internal board, events, and discussion.
- **Steward:** Their club's full console — wiki, roster, roadmap, delegation, curation, succession.
- **Teacher:** Their section's tools, plus the Teacher Panel for coordination with colleagues.
- **Authority:** All clubs, all sections, aggregate view only.

---

### 14. Screen — Item Detail

Shared by everyone. Rendered differently per role.

- **Everyone sees:** The title, the type, the deadline with its countdown, and the original forwarded message — unedited, exactly as it arrived. Nothing is paraphrased away.
- **A student sees:** The opportunity, its source, its badge, its endorsement, and the countdown. Plus the actions available to them: star, register, apply, add to calendar.
- **A Steward sees additionally:** Who claimed it, when, how many people have seen it, how many haven't, and the full claim log.
- **A teacher or authority sees:** Reach data — how many students received a notice, how many saw it, how many didn't.
- **What nobody sees:** Another person's viewing record. Ever.

---

### 15. The Countdown

**The principle.** Urgency is only rendered for commitments the student opted into.

**The tiers.**

| Time remaining | What it looks like |
|---|---|
| More than 14 days | A quiet date, faint ring |
| 14 to 4 days | Countdown figure, filling ring |
| 72 to 24 hours | Live counter, warm colour |
| Under 24 hours | Pulsing counter, red band, pinned to top |
| Past the deadline | Grey, dashed, marked missed — never red |

**The rules.**

- Colour is set by the clock. A Steward cannot make an item red.
- The ring fills as the deadline approaches — a depletion metaphor. The resource is time.
- Below one hour, minutes. Below ten minutes, seconds — and seconds only on items the student has personally claimed.
- No countdown appears on anything the student hasn't engaged with.
- If the app was closed past several thresholds, only the current tier fires when it opens. No notification storm.
- Countdowns use server-authoritative time. A device clock ahead or behind never changes the display.

**The calendars.**

- Month grid — up to three dots per day, coloured by the most urgent item.
- Seven-day strip — always visible at the top. Today leftmost and widest.
- Agenda — grouped by urgency, not date. Critical first. This is what the Board opens to.

All three render fully offline.

---

### 16. Reminders

A ladder, not a drumbeat.

Reminders fire at fourteen days, seven days, two days, twenty-four hours, six hours, one hour, and after the deadline.

**What never happens.**

- Unclaimed items never remind.
- Observers and alumni receive nothing by default.
- No notification storms — one reminder after a long absence, not five.
- The missed reminder is factual, never accusatory: *"Poster design was due 2 hours ago. It has not been marked complete."*
- The missed reminder also reaches the Steward. Not to assign blame — to make sure the task wasn't unreasonable.

Reminders are scheduled on the device. They keep working without internet. When a deadline changes, old reminders cancel and the ladder rebuilds.

---

### 17. The Ledger

What travels with the student. The only thing that does.

A chain of witnessed acts. Each entry carries:

- The person who did it.
- What they did.
- When they did it.
- Who confirmed it, by name.

**Two classes of entry.** Self-chosen commitments (unwitnessed, personal) and delegated tasks (witnessed, named). Both live in the same ledger. Both are visibly flagged as what they are.

**How it grows.** Only forward. Nothing is erased. If a completion was logged wrongly, the fix is a new entry saying what changed, who changed it, when. The original stays visible.

**How corrections work.** A correction is appended to whichever copy its author controls. It doesn't force anything on the other side. If both sides agree, it propagates to both. If they disagree, the two copies drift independently, and that's fine. A departed witness's name stays on the original entry permanently; nobody signs for them. A discussion trace can be attached if the writer wants to give context; otherwise the correction stands alone.

**What never appears in the ledger.** Grades, attendance, discipline, class rank. Institutional standing is sealed. What travels is only what the student did, witnessed by someone with a name.

**The two exports.**

- **The signed pack.** A frozen snapshot. What the ledger contained at the moment of export, sealed and verifiable. Goes anywhere — a university application, an employer, a portfolio site. Doesn't update. Doesn't link back.
- **The public profile link.** A live, revocable view, hosted at an institutional URL. Always current. The student controls what's shown. The institution provides the address and nothing else — no moderation, no veto, no editorial say.

---

### 18. The Two Rewards

The true reward is the record. Portable, immutable, witnessed. It convinces an employer, a university, a stranger. It is what makes contribution non-performative — because the claim carries a witness's name and a timestamp.

The sensory reward is the mirror. Score and badges. Real rewards, but decorative. They never merge with the record.

**The rules that keep them separate.**

- The score is derived from the record. No manual points. No Steward awarding points.
- The score rolls forward — a semester or ninety days. Fair to newcomers.
- Badges are facts, not ranks. No tiers. No gold/silver/bronze. No prerequisites.
- Comparison exists only inside a small opted-in circle. No institution-wide leaderboard. No global position.
- The record is the export. The score is not. One travels; one stays.
- Nothing decays except the score.

---

### 19. Screen — The Steward's Console

Six tabs. Each a different job.

- **Delegate.** Create a task. Set its deadline. Set the minimum stage required to claim it. Attach a wiki page if prior knowledge exists. Broadcast to an interest tag rather than the whole group.
- **Curate.** Everything forwarded to the bot that hasn't reached the board yet lands here. Review, edit, approve, or discard. Approved items go to the board. Items nobody touches are dropped automatically after a week.
- **People.** The membership pipeline. Every person, their role, when they joined, who promoted them. Applications come here. When reviewing an applicant, the Steward sees what that person has actually done — claimed, completed, abandoned, last active. This evidence appears only at promotion review. Someone who joined last week shows as "new member — no record yet."
- **Fairness.** Did people actually see this? Every item records when it entered each person's feed. When an item expires, the Steward sees how many people never saw it. If more than half the space never saw it, or it dropped outside reasonable hours, a flag fires — and the flag suppresses the item's pulsing motion for everyone.
- **Succession.** Nominate a successor. Set a departure date. Watch the transfer happen. See the full history of who held this seat and when.
- **Wiki.** The club's written memory. See below.

---

### 20. The Club Wiki

The claim log records what happened. The wiki records what was learned.

**Structure.** A space contains sections. A section contains pages. Three levels, no deeper.

**Six kinds of page.**

| Type | What it's for |
|---|---|
| Charter | Who we are, what we're for, how we govern ourselves |
| Playbook | How to run a recurring thing |
| Retrospective | What happened, what to change |
| Ledger | Chronological decisions and the reasoning behind them |
| Resources | Budget sheets, templates, rubrics, links |
| Handover | The outgoing Steward's briefing to the incoming one |

**Who reads what.** Each page is public, core, or steward-only. New pages default to core. Only a Steward can change a page's visibility.

**Writing and history.** Core members and above write. Every edit is kept. Two people editing offline both keep their version and are asked to resolve it. Stewards can restore an earlier version. Pages can be archived; archived pages stay readable but drop out of search.

**Capturing knowledge at the right moment.** When a task is marked complete, one prompt appears:

> *"Anything worth remembering for next year? (2 min)"*  
> What went well · What went wrong · What to change

Three fields. Skippable. Never blocks completion. If skipped, the Steward gets a nudge two days later.

**The Handover page.** Created automatically the moment a successor is nominated, pre-filled with prompts. The successor reads it before taking the seat.

---

### 21. Roles and the Pipeline

Roles live inside a space, not globally. The same person can be a Steward at one club and a quiet observer at another in the same afternoon.

**The axis:** Observer → Applicant → Trialist → Core → Steward. Plus Alumni.

**Behavioural archetypes:** The Dweller (observer forever, fully served). The Aspirant (climbs to core). The Steward (a capability, not a person-type).

| Action | Observer | Applicant | Trialist | Core | Steward | Alumni |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| View opportunities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Claim a task | — | — | ✓ | ✓ | ✓ | — |
| Create a task | — | — | — | — | ✓ | — |
| Curate forwarded items | — | — | — | — | ✓ | — |
| Broadcast to a tag | — | — | — | — | ✓ | — |
| Promote or demote | — | — | — | — | ✓ | — |
| View fairness flags | — | — | — | — | ✓ | — |
| Create or edit wiki | — | — | — | ✓ | ✓ | — |
| Nominate a successor | — | — | — | — | ✓ | — |
| Receive reminders | opt-in | opt-in | opt-in | opt-in | opt-in | — |

**Two deliberate asymmetries:**
1. Core cannot create tasks. Delegation is a Steward capability. This prevents people from manufacturing work to pad their own record.
2. Anyone can create a space. Prevents Stele from becoming a closed system only incumbents can enter.

---

### 22. The Institutional Plane

The school's own system. Sovereign. Never federated.

**What lives here:**
- Attendance
- Grades and performance reports
- Discipline records
- Timetable and scheduling
- Sections and their resources
- Teacher panels and coordination
- The approval chain for outgoing publications

The hierarchy is configurable. Principal → department head → teacher → student is one shape. A school with vice principals and coordinators builds a longer one. A two-person school builds a shorter one. The protocol carries the chain as data; it never assumes a shape.

Publishing rights are configurable. Teachers only, teachers plus club executives, student council included, open with moderation — each instance decides.

The approval chain is mandatory. Every item passing from the instance to the federation clears the chain. Who authored, who reviewed, who approved, when — all recorded internally. Never federated. But kept, permanently, so the institution can always answer "who let this out?"

Access logging and role scoping. Every read of a student's institutional record is logged. Different roles hold different keys. A discipline officer cannot read academic records. The student sees who read their file; admins see the aggregate.

Disputes. A student can formally dispute an entry. The institution must respond within a window. If unresolved, the student can escalate up the hierarchy. The dispute ends at the top.

---

### 23. The Federation Plane

What crosses. Nothing else does.

Only two things move between instances:
1. **Published opportunities.** Deliberately emitted by an institution. Carry the issuing institution, space, and Steward, plus a reference back to the internal record they were derived from — so readers can trust they aren't fabricated.
2. **Trust signals.** Endorsements. A school saying "we stand behind this." Visible on the card. Never a gate.

**What never moves:**
- Attendance, grades, discipline — no message shape exists for them.
- Roster data, wiki content, claim logs, fairness history.
- Per-recipient broadcast detail.
- Any individual student record, ever, under any circumstance, even with consent.

**The cascading ladder:**
- District is the default. Every school in a district sees every other's district-scoped items.
- Division, National, International open upward only by choice. Each rung is a deliberate act.
- Going up is unilateral. Going down is unilateral. No coordinator, no body, no spokesperson. The district is a fact of geography, not an organisation.

Publishing scope and reading scope are independent. A school can publish at district scope and read at national scope. Two choices, made per item and per reader.

**Withdrawal and return:**
- A school that leaves the federation keeps its management system running. Internal operations continue; the federation layer goes dark.
- Past publications stay in the network, marked historical. Nothing is erased. Nothing is misrepresented as current.
- Rejoining works anytime.
- Students keep federation access independently. The school's exit binds the school, not the person.

---

### 24. Publishers Outside the Walls

NGOs, olympiad bodies, national organisations, commercial entities — anyone offering something to students who isn't a school.

They are instances with a type. Same plumbing, different capabilities. A school holds members, sections, clubs. A publisher holds none — it only publishes into the federation. A national body might sit above institutions.

**They pay to publish:**
- Schools publish free.
- NGOs, olympiad bodies, national organisations pay a reduced rate.
- Commercial entities pay full rate, and are mandated to.

**The principle.** The fee isn't a filter on who can afford to speak. It's a fee on who's buying attention. An olympiad body is offering something students want. A corporation is buying access to a demographic. The first pays what it can. The second pays what it should.

---

### 25. Non-Institutional Users

The federation is curriculum-agnostic. It is also open to people with no institution at all.

Homeschoolers, dropouts, adult learners — anyone can hold a federation identity without an institutional account. They declare their own district and sit in that district's pool. Same rung as everyone else, same scope, same ordering.

Nothing is unlocked by claiming a district. Trust is a signal, not a gate. If geography is ever gamed, the fix is adjusting the default, not verifying.

---

### 26. Identity

Two identities, one person, linked by choice.

- **The institutional identity** belongs to the school. It carries attendance, grades, discipline, enrollment. It never leaves the instance.
- **The federation identity** belongs to the student. It carries the ledger, the profile, the browsing history, the applications. It travels with them anywhere.

Login is collaborative. The school provides a form with the required fields. The student fills it in. Neither party does it alone. Convenience is preserved by splitting the work, not by removing one side.

**On transfer:**
- The institutional record stays behind. It belongs to the school that produced it.
- The ledger travels with the student. It's theirs.
- The institution keeps its own copy of what that student did there. An act is witnessed twice — once in the institution's record, once in the student's ledger. Neither can erase the other.

A student can belong to two institutions at once. Roles are per-instance, not global. A Steward at one school is an observer at another.

---

### 27. Succession

**The invariant: no seat is ever permanently empty.**

- **The primary path — explicit successor.** Someone is named. A co-steward window opens. Authority transfers on the departure date. The outgoing holder becomes alumni with read-only access.
- **The fallback — automatic deputy.** If no one is named and the holder vanishes, the deputy is offered the seat. If they don't accept within the window, the deputy-deputy is offered. If both fail, the space or instance flags dormant and the recovery path opens.

**For instance admins:**
- The admin is whoever the school chooses — IT staffer, principal, vendor, elected role.
- The admin names a deputy. The deputy names a deputy-deputy. Two rungs.
- If the admin is absent, the deputy is offered the seat. Accept-within-window. If declined, the next rung.
- The window is 14 to 30 days.
- The original admin can reclaim the seat once, within a bounded period.

**For spaces and clubs:**
- Nominate a successor. Set a departure date. Watch the transfer fire.
- If the last Steward tries to leave without naming anyone, the system refuses: *"Name a successor first."*
- The Handover page is created automatically on nomination.

**What transfers:**
Everything that belongs to the space: the role, the settings, pending items, the historical record, the pipeline of applicants, the interest tags, the fairness history, the full wiki, aggregate broadcast figures.

**What doesn't:**
Private items belong to the person who made them. Roster imports belong to the section. Per-recipient broadcast detail stays with the broadcaster.

---

### 28. Failure and Abuse

- **Offline operations.** Students and staff work offline. Local cache keeps running; sync resumes when the instance is back. The instance is the source of truth, not a dependency.
- **A source goes silent.** Its published items stay visible. After a period of silence, they carry a "source unreachable" mark. The mark clears when the source returns.
- **A bad item.** Recipient instances flag it. Enough flags, and the item carries a warning mark. The working group of instances can escalate.
- **A bad instance.** Visibility downgrade — its items still reach students, but carry a visible mark. Nothing hidden, nothing silenced. The judgment is public, and the reader decides.
- **A rogue admin.** Every read of a student's record is logged. The student sees who looked. Different roles hold different keys. Scoping degrades gracefully to whatever roles exist.
- **State compulsion.** The instance holds what it holds. Compulsion is a legal question, not a technical one. Stele does not build a structural answer — and says so honestly in onboarding.
- **A disputed record.** A formal dispute channel. The institution responds within a window. Optional escalation up the hierarchy.

---

### 29. What Stele Is Not

- **Not a replacement for the school's existing systems.** Federation-first means a school can use Stele without touching anything else.
- **Not a social network.** No followers, no likes, no public profiles beyond what a student chooses to publish.
- **Not a discovery engine.** Nothing is inferred. The student declares interests; the feed respects them.
- **Not a ranking platform.** No comparisons beyond a small opted-in circle.
- **Not a court.** It records; it does not adjudicate.
- **Not a wall.** Trust signals appear on cards; they never block content.
- **Not a data broker.** Nothing leaves the institutional plane. Nothing is sold.
- **Not a native app requirement.** It runs in a low-end browser.
- **Not a central server.** Self-hosting is available and encouraged. It is a default, not a mandate.

---

### 30. One Sentence

> Stele is a quiet, federated, offline-first layer that connects institutions to opportunities, records contribution so it counts, and hands authority from person to person as a seat that outlives whoever holds it — built for a country where the infrastructure to deliver opportunity was never built, and priced so that money comes from whoever is buying attention, never from the students whose attention is bought.

---

*End of consolidated specification. Version 2.0. Frozen for implementation.*
`;
