# Wireframes & Design Process

## Design Philosophy

**Key Principles:**
- Simple, intuitive wizard-based flows
- Category-specific visual identity (colors, icons)
- Mobile-first responsive design
- Progressive disclosure (show only what's needed)
- Clear visual hierarchy

## Wireframe Overview

Since this is a web application, wireframes were created using:
- Pen and paper sketches (initial concepts)
- Figma (detailed designs)
- Direct implementation in code (iterative design)

## Key Screens Wireframes

### 1. Dashboard / Homepage

**Layout:**
```
┌─────────────────────────────────────┐
│  [Connect Wallet]  [My Achievements]│
├─────────────────────────────────────┤
│                                     │
│      🏆 PROOFY                      │
│   Verify Any Achievement           │
│                                     │
│  [Get Started] [Learn More]        │
│                                     │
├─────────────────────────────────────┤
│  Categories:                        │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 🎓   │ │ 🏋️   │ │ 🤝   │       │
│  │Educ  │ │Sport │ │Volun │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐                │
│  │ 💼   │ │ 📌   │                │
│  │Skill │ │Custom│                │
│  └──────┘ └──────┘                │
└─────────────────────────────────────┘
```

**Key Elements:**
- Hero section with value proposition
- Category showcase cards
- Quick action buttons
- Wallet connection prompt

### 2. Achievement Creation Wizard

**Step 1: Category Selection**
```
┌─────────────────────────────────────┐
│  Create Achievement        [Back]   │
├─────────────────────────────────────┤
│                                     │
│  Select Category:                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🎓 Education              │   │
│  │  Academic achievements      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🏋️ Sports                 │   │
│  │  Athletic achievements      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

**Step 2: Form Filling (Category-Specific)**
```
┌─────────────────────────────────────┐
│  Create Achievement        [Back]   │
├─────────────────────────────────────┤
│                                     │
│  Education Achievement              │
│                                     │
│  Title: [________________]          │
│                                     │
│  Institution: [____________]        │
│  Degree: [_______________]          │
│  Graduation Date: [____/____/____]  │
│  GPA: [____] (0.0 - 4.0)           │
│                                     │
│  Description:                       │
│  [___________________________]      │
│  [___________________________]      │
│                                     │
│  [Save Draft]  [Continue →]        │
└─────────────────────────────────────┘
```

**Step 3: Image Upload**
```
┌─────────────────────────────────────┐
│  Create Achievement        [Back]   │
├─────────────────────────────────────┤
│                                     │
│  Upload Proof Image                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      [Upload Image]         │   │
│  │   or drag & drop here       │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Proof Description:                 │
│  [___________________________]      │
│  [___________________________]      │
│                                     │
│  [Create Achievement]               │
└─────────────────────────────────────┘
```

### 3. Verification Panel

```
┌─────────────────────────────────────┐
│  Verification Panel                 │
├─────────────────────────────────────┤
│  Filter: [All ▼] [Sports ▼]        │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Title: Marathon Win         │   │
│  │ Category: Sports            │   │
│  │ Creator: 0x123...           │   │
│  │                             │   │
│  │ [View Proof Image]          │   │
│  │                             │   │
│  │ [✅ Approve] [❌ Reject]    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Title: University Diploma   │   │
│  │ Category: Education         │   │
│  │ Creator: 0x456...           │   │
│  │                             │   │
│  │ [✅ Approve] [❌ Reject]    │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 4. Certificate Profile Page

```
┌─────────────────────────────────────┐
│  Certificate #123                   │
├─────────────────────────────────────┤
│                                     │
│  [Category Gradient Background]     │
│                                     │
│  🏆 MARATHON WIN                    │
│                                     │
│  Verified Achievement               │
│  Token ID: #123                     │
│                                     │
│  Details:                           │
│  • Sport: Running                   │
│  • Event: International Marathon    │
│  • Placement: 1st Place             │
│  • Date: October 20, 2024           │
│                                     │
│  [Share] [Download] [Copy Link]     │
│                                     │
│  [View on Blockchain Explorer]      │
│                                     │
└─────────────────────────────────────┘
```

## Design System

### Color Palette

**Category Colors:**
- Education: Blue (#3B82F6)
- Sports: Orange (#F97316)
- Volunteering: Green (#10B981)
- Skills: Purple (#8B5CF6)
- Custom: Gray (#6B7280)

### Typography
- **Headings:** Inter Bold, 24-48px
- **Body:** Inter Regular, 16px
- **Small:** Inter Regular, 14px

### Components

**Buttons:**
- Primary: Solid color, rounded corners (8px)
- Secondary: Outline, rounded corners
- Hover: Slight scale (1.02x) + shadow

**Cards:**
- White background
- Rounded corners (12px)
- Shadow on hover
- Padding: 24px

**Forms:**
- Input fields: Border, rounded (8px)
- Focus: Border color change + shadow
- Validation: Red border + error message

## Design Tools Used

- **Figma:** For detailed mockups (optional)
- **Tailwind CSS:** For implementation (utility-first CSS)
- **React Hot Toast:** For notifications
- **Heroicons:** For icons

## Responsive Design

**Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Mobile Adaptations:**
- Single column layout
- Stacked cards
- Full-width buttons
- Simplified navigation

## Design Iterations

**Version 1:** Basic forms, minimal styling
**Version 2:** Added category colors, improved spacing
**Version 3:** Added animations, polished UI
**Final:** Production-ready with loading states, error handling

## Screenshots

See actual implementation screenshots in the repository or demo video for final designs.


