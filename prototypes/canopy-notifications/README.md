# Canopy Notifications Center — Prototype

## Overview
High-fidelity prototype of the Canopy ecosystem Notifications Center - a unified inbox for actionable items and awareness updates across all Canopy applications (Registry, Retail ID, Payments).

## Status: Draft - Ready for Review

## Preview
**http://localhost:3001/prototypes/canopy-notifications**

Click the notification bell icon in the header to open the slide-out panel.

---

## Screens & Components

### 1. NotificationsCenter (`screens/NotificationsCenter.tsx`)
The main slide-out panel containing:
- **Header** with title and close button
- **FilterToolbar** with filters and bulk actions
- **Notification list** with tier indicators
- **Empty states** for no notifications / no results

### 2. CanopyHome (`screens/CanopyHome.tsx`)
Demo page showing the Notifications Center integrated into the Canopy shell.

---

## Features Implemented

### Notification Tiers (per spec)

| Tier | Badge Color | Behavior |
|------|-------------|----------|
| **Action Required** | Red | Never auto-expire, escalate until resolved |
| **Awareness** | Blue | Persist 30-60 days, dismissible |
| **Transient** | Gray | System status (not in inbox) |

### Header Badge
- Shows **only action-required unread count** (not total unread)
- Red badge with white text
- Hides when count is 0

### Panel Features
- **Slide-out from right** (480px width)
- **Semi-transparent backdrop** - click to close
- **Keyboard navigation** - Escape to close
- **Body scroll lock** when open

### Filtering & Organization
- Filter by **tier** (Action Required, Awareness, System)
- Filter by **source app** (Registry, Retail ID, Payments, Ecosystem)
- Filter by **entity type** (Product, Label, Brand, Market, Integration, User)
- **Unread only** toggle
- Shows filtered count vs total

### Bulk Actions
- **Select/deselect individual** notifications (checkboxes)
- **Deselect all** button
- **Mark selected as read**
- **Dismiss selected** (awareness tier only)

### Individual Notification Actions
- **Mark read/unread** (toggle)
- **Dismiss** (awareness tier only)
- **Navigate to source** (deep link - logs to console in demo)
- Auto-marks as read when navigating

### Notification Item Display
- **Tier indicator** (icon + colored background)
- **Source app badge** (colored pill)
- **Title** (bold when unread)
- **Description** (2-line clamp)
- **Timestamp** (relative: "2 hours ago")
- **Unread dot** indicator
- **Hover actions** (mark read, dismiss, navigate)

### Empty States
- **"All caught up!"** - when no notifications exist
- **"No matching notifications"** - when filters return nothing (with clear filters button)

---

## Data Model

```typescript
interface Notification {
  id: string
  userId: string
  tier: 'action-required' | 'awareness' | 'transient'
  sourceApp: 'registry' | 'retail-id' | 'payments' | 'ecosystem'
  entityType: 'product' | 'label' | 'brand' | 'market' | 'integration' | 'user' | 'system'
  entityId?: string
  title: string
  description?: string
  deepLink?: string
  state: 'unread' | 'read' | 'acted' | 'dismissed'
  createdAt: Date
  readAt?: Date
  expiresAt?: Date
  actionType?: string
}
```

---

## Design Library Components Used

| Component | Usage |
|-----------|-------|
| `Header` | Top navigation bar |
| `CanopyLogo` | Brand logo |
| `IconButton` | Header actions |
| `LeftNav` | Side navigation |
| `Avatar` | User profile |
| `Icon*` | All icons from library |

---

## Mock Data
10 sample notifications across:
- **4 Action Required** - compliance deadline, label approval, integration error, payment expiring
- **6 Awareness** - product added, label published, team member joined, invoice paid, sync completed, new market

---

## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Escape` | Close panel |

---

## Accessibility
- `role="dialog"` with `aria-modal="true"`
- `aria-label` on all interactive elements
- `aria-expanded` on notification bell
- Checkbox `role` with `aria-checked`
- Focus management (body scroll lock)

---

## Out of Scope (per spec)
- Notification creation/publishing API
- Email/SMS delivery
- User preferences/settings UI
- Snooze/remind later (noted for future)
- Expand to full page view

---

## Next Steps
- [ ] Connect to real notification API
- [ ] Add WebSocket/polling for real-time updates
- [ ] Implement snooze/remind later for action-required
- [ ] Add expand to full-page view
- [ ] Mobile responsive (full-screen on mobile)
- [ ] Dark mode support
- [ ] Extract as reusable package

---

## Usage

```tsx
import {
  NotificationsCenter,
  NotificationBellButton,
  mockNotifications,
  type Notification
} from '@/prototypes/canopy-notifications/screens/NotificationsCenter'

function App() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <NotificationBellButton
        notifications={notifications}
        onClick={() => setIsOpen(true)}
      />

      <NotificationsCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onNotificationsChange={setNotifications}
      />
    </>
  )
}
```
