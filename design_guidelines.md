# Study Group Management App - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Productivity-Focused)  
**Primary Inspiration:** Linear + Notion aesthetic  
**Rationale:** Information-dense productivity tool requiring clarity, efficiency, and learnable patterns for academic task management.

**Core Principles:**
- Clarity over decoration
- Scannable information hierarchy
- Efficient task completion flows
- Structured data presentation

---

## Typography

**Font Stack:** Inter (via Google Fonts CDN)

**Hierarchy:**
- **Page Titles:** 2xl, semibold (Study Groups, My Classes)
- **Section Headers:** xl, semibold (Group Names, Upcoming Exams)
- **Card Titles:** base, semibold (Todo items, Class names)
- **Body Text:** sm, regular (Descriptions, details)
- **Meta Information:** xs, regular (Dates, member counts, timestamps)
- **Button Text:** sm, medium

---

## Layout System

**Spacing Scale:** Tailwind units of **2, 3, 4, 6, 8, 12, 16**

**Page Structure:**
- Sidebar navigation: Fixed width (64 units on desktop)
- Main content area: Fluid with max-w-7xl container
- Content padding: p-8 on desktop, p-4 on mobile
- Card spacing: gap-4 for grids, gap-6 for major sections

**Grid Patterns:**
- Study group cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Todo lists: Single column with max-w-2xl
- Class dashboard: grid-cols-1 md:grid-cols-2
- Exam calendar: Full-width table or grid-cols-1 md:grid-cols-2 lg:grid-cols-4

---

## Component Library

### Navigation
**Sidebar (Desktop):**
- Vertical navigation with icons from Heroicons
- Items: Dashboard, Study Groups, To-Dos, Classes, Exams
- Active state: Subtle background fill
- Fixed positioning, full height

**Mobile Header:**
- Hamburger menu (top-right)
- App title (top-left)
- Slide-out drawer navigation

### Cards
**Study Group Card:**
- Rounded corners (rounded-lg)
- Border treatment (border-2)
- Padding: p-6
- Contains: Group name (header), member count, action buttons
- Hover: Subtle lift effect

**Todo Item Card:**
- Checkbox (left-aligned)
- Task title and description
- Assignee badge (if assigned)
- Due date indicator
- Action menu (right-aligned, 3-dot icon)
- Compact padding: p-4

**Class Card:**
- Header with class name and code
- Schedule information (days/times)
- Upcoming exam indicator
- Quick actions footer
- Padding: p-6

### Forms
**Input Fields:**
- Standard height: h-10
- Border: border-2
- Rounded: rounded-md
- Padding: px-3
- Focus: Ring treatment (ring-2)

**Text Areas:**
- Min height: h-24
- Same border/padding as inputs
- For todo descriptions

**Buttons:**
- Primary: Rounded-md, px-4, py-2, medium weight
- Secondary: Same dimensions, border-2
- Icon buttons: Square (w-8 h-8), centered icon
- Destructive: Border variant for delete actions

### Data Display
**Member List:**
- Horizontal avatar stack (overlapping circles)
- "+N more" indicator for overflow
- Size: w-8 h-8 per avatar

**Todo Assignment Dropdown:**
- Searchable member picker
- Avatar + name display
- Compact list (max-h-64 with scroll)

**Exam Calendar View:**
- Table format with headers: Class, Date, Time, Type
- Alternating row backgrounds for readability
- Sortable columns
- Badge indicators for exam proximity (upcoming, today, passed)

**Class Schedule Grid:**
- Time slots on Y-axis
- Days on X-axis
- Blocks for scheduled classes
- Compact spacing

### Status Indicators
**Badges:**
- Small, rounded-full
- px-2 py-1
- Text: xs
- Types: Assigned, Completed, Overdue, Upcoming

**Progress Indicators:**
- Simple progress bars for todo completion %
- Height: h-2
- Rounded: rounded-full

### Modal Overlays
**Create/Edit Modals:**
- Centered overlay
- Max-width: max-w-lg
- Padding: p-6
- Backdrop: Semi-transparent
- Contains form with title, inputs, action buttons

---

## Responsive Behavior

**Breakpoints:**
- Mobile: Stack all grids to single column
- Tablet (md): 2-column grids
- Desktop (lg): 3-column grids where applicable

**Sidebar:**
- Desktop: Fixed sidebar visible
- Mobile: Hidden, accessible via hamburger menu

**Cards:**
- Maintain padding ratios
- Stack internal elements vertically on mobile

---

## Interaction Patterns

**Todo Management:**
- Inline checkbox toggle for completion
- Click card to expand details
- Drag handle for reordering (visual only, icon indicator)

**Assignment Flow:**
- Assign button opens member picker dropdown
- Selected member shows as badge
- Remove assignment via X icon on badge

**Group Management:**
- Add member via inline input + button
- Remove member via hover action on member list

**Quick Actions:**
- 3-dot menu icons for edit/delete on cards
- Hover reveals action buttons on list items

---

## Key UI Patterns

**Empty States:**
- Centered icon (from Heroicons)
- Heading: "No [items] yet"
- Description + CTA button
- Generous padding (py-16)

**Loading States:**
- Skeleton screens matching card structures
- Pulsing animation
- Preserve layout dimensions

**Confirmation Dialogs:**
- Small modal (max-w-sm)
- Clear warning text for destructive actions
- Two-button layout (Cancel + Confirm)

---

## Images

**No hero images required** - this is a functional dashboard application focused on data management and task completion, not visual storytelling.