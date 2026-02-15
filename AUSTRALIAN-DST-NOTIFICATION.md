# Australian DST Implementation

## Overview
Displays ACDT and AEDT information for Australian users in both the notification banner and the TimezoneHeader navbar.

## Components

### 1. AustralianDSTNotification (Banner)
A dismissible notification banner that shows when daylight saving time is active.

**Features:**
✅ Shows only for Australian users (userCountry === 'AU')
✅ Displays when ACDT (Adelaide) and/or AEDT (Sydney/Melbourne) are in daylight saving time
✅ **Shows live current time** in ACDT and/or AEDT format with timezone abbreviations
✅ Responsive design for both desktop and mobile
✅ Show once per day using localStorage
✅ Dismissible by user (won't show again until next day)
✅ **Each timezone disappears at 3am of its own local time**
✅ Updates every second for time display, checks DST status every minute

### 2. TimezoneHeader (Navbar)
Displays all Australian timezones with AEDT and ACDT conditionally shown.

**Features:**
✅ Shows AEST (Sydney/Melbourne) - UTC+10
✅ Shows AEDT (Sydney/Melbourne) below AEST when DST active and before 3am - UTC+11
✅ Shows ACST (Adelaide) - UTC+9:30
✅ Shows ACDT (Adelaide) below ACST when DST active and before 3am - UTC+10:30
✅ Shows AWST (Perth) - UTC+8
✅ Shows SGT (Singapore) at the end - UTC+8
✅ Updates every second
✅ Responsive for desktop and mobile

## Implementation Details

### Files Created/Modified

1. **src/components/AustralianDSTNotification.js** (CREATED)
   - Banner notification component with live time display
   - DST detection logic for both AEDT and ACDT
   - **3am check for each timezone independently**
   - LocalStorage management for "shown today" flag
   - Dismiss functionality
   - Real-time clock updates

2. **src/components/TimezoneHeader.js** (MODIFIED)
   - Added `isDST()` function to check if timezone is in DST
   - Added `isBefore3AM()` function to check if time is before 3am
   - Added `getAustralianTimezones()` function to build timezone list with AEDT/ACDT
   - Special Australian grid layout rendering
   - Shows SGT at the end for Australian users

3. **src/components/Navigation.js** (MODIFIED)
   - Added import for AustralianDSTNotification
   - Integrated component after TimezoneHeader

4. **src/translations.js** (MODIFIED)
   - Added English translations for:
     - australianDSTTitle
     - australianDSTBothMessage
     - australianAEDTMessage
     - australianACDTMessage
     - australianDSTNote

## How It Works

### Banner Component (AustralianDSTNotification)

#### DST Detection
- Uses JavaScript Date and timezone offset comparison
- Compares January vs July offsets to determine if DST is active
- Southern Hemisphere DST logic (active when offset is greater)
- Checks every minute for DST status changes

#### Live Time Display
- Shows current time in AEDT format (Sydney/Melbourne timezone)
- Shows current time in ACDT format (Adelaide timezone)
- Updates every second for real-time accuracy
- Displays with timezone abbreviation (e.g., "AEDT: 10:45:32 AM")
- Uses 12-hour format with AM/PM

#### 3am Disappearance Logic
- **AEDT disappears at 3am Sydney/Melbourne local time**
- **ACDT disappears at 3am Adelaide local time**
- Each timezone is checked independently
- If both timezones pass 3am, the entire notification disappears
- Clears localStorage flag when notification fully disappears

#### Once-Per-Day Display
- Stores today's date (YYYY-MM-DD) in localStorage key: `au_dst_notification_shown`
- Checks this value before showing notification
- Resets automatically when both timezones pass 3am or DST ends

### Navbar Component (TimezoneHeader)

#### Australian Timezone Display
For Australian users, the navbar shows timezones in this order:
1. **AEST** (Sydney/Melbourne) - Always shown
2. **AEDT** (Sydney/Melbourne) - Only when DST active AND before 3am local time
3. **ACST** (Adelaide) - Always shown
4. **ACDT** (Adelaide) - Only when DST active AND before 3am local time
5. **AWST** (Perth) - Always shown
6. **SGT** (Singapore) - Always shown at the end

#### Conditional Display Logic
```javascript
// AEDT shows when:
- isDST('Australia/Sydney') === true
- isBefore3AM('Australia/Sydney') === true

// ACDT shows when:
- isDST('Australia/Adelaide') === true
- isBefore3AM('Australia/Adelaide') === true
```

#### Layout
- Uses grid/flex layout for responsive display
- Each timezone shows: Flag, Code (UTC offset), Time, Date, Time difference
- Singapore time shown last with distinct styling (golden background)
- Mobile-responsive with adjusted sizing

## Display Examples

### Navbar (TimezoneHeader)
**Before DST (Winter - Standard Time):**
```
🇦🇺 AEST (UTC+10)  |  🇦🇺 ACST (UTC+9:30)  |  🇦🇺 AWST (UTC+8)  |  🇸🇬 SGT (UTC+8)
```

**During DST before 3am (Summer - Daylight Time):**
```
🇦🇺 AEST (UTC+10)
🇦🇺 AEDT (UTC+11)  ← Shows until 3am Sydney time
🇦🇺 ACST (UTC+9:30)
🇦🇺 ACDT (UTC+10:30)  ← Shows until 3am Adelaide time
🇦🇺 AWST (UTC+8)
🇸🇬 SGT (UTC+8)
```

**After 3am (DST still active but hidden):**
```
🇦🇺 AEST (UTC+10)  |  🇦🇺 ACST (UTC+9:30)  |  🇦🇺 AWST (UTC+8)  |  🇸🇬 SGT (UTC+8)
```

### Banner (AustralianDSTNotification)
**Visual Example:**
```
🇦🇺 Australian Daylight Saving Time Active

Both AEDT and ACDT are currently in effect.

🕐 AEDT: 02:45:15 AM    🕐 ACDT: 02:15:15 AM
↑ Disappears at 3am     ↑ Disappears at 3am
  Sydney time             Adelaide time

Delivery times displayed above reflect the current daylight saving time.
[×]  ← Dismiss button
```

## User Experience

### Banner Component
1. Australian user visits website during DST period (October - April)
2. Sees prominent yellow notification banner with 🇦🇺 flag (if not dismissed today)
3. Banner shows current time in AEDT and/or ACDT with live updates every second
4. User can dismiss with × button
5. Won't see banner again until tomorrow (new day)
6. When AEDT/ACDT reach 3am, respective times disappear from banner
7. When both pass 3am (or DST ends), entire banner disappears

### Navbar Component
1. Australian user always sees their local timezones in navbar
2. During DST period before 3am:
   - Sees AEST with AEDT below it (Sydney/Melbourne)
   - Sees ACST with ACDT below it (Adelaide)
   - All times update every second
3. After 3am local time:
   - AEDT disappears at 3am Sydney time
   - ACDT disappears at 3am Adelaide time
   - Returns to showing only standard time zones
4. Singapore time (SGT) always visible at the end

## Styling

### Banner (AustralianDSTNotification)
- Yellow/orange color scheme (#fff9e6 background, #ffc107 border)
- White time display boxes with golden borders
- Clock emoji (🕐) for each time display
- Monospace font for times for easy reading
- Responsive sizing for mobile and desktop
- Close button with hover effect

### Navbar (TimezoneHeader)
- Blue background (#e8f4f8) for Australian timezones
- Golden background (#fff3e0) for Singapore time
- Compact sizing to fit multiple timezones
- Grid/flex layout that adapts to screen size
- Country flags for visual identification
- UTC offsets shown with timezone codes

## Timezone Information
- **AEST** (Australian Eastern Standard Time): UTC+10 (winter)
- **AEDT** (Australian Eastern Daylight Time): UTC+11 (summer, AEST + 1 hour)
- **ACST** (Australian Central Standard Time): UTC+9:30 (winter)
- **ACDT** (Australian Central Daylight Time): UTC+10:30 (summer, ACST + 1 hour)

## Testing Scenarios

### Banner Component
- ✅ User in Australia during AEDT period (sees AEDT time)
- ✅ User in Australia during ACDT period (sees ACDT time)
- ✅ User in Australia when both DST times active (sees both times)
- ✅ AEDT reaches 3am Sydney time (AEDT disappears from banner)
- ✅ ACDT reaches 3am Adelaide time (ACDT disappears from banner)
- ✅ Both pass 3am (entire banner disappears)
- ✅ User dismisses banner (localStorage updated, won't show today)
- ✅ User returns same day (should not show)
- ✅ User returns next day (should show again)
- ✅ Real-time clock updates every second

### Navbar Component
- ✅ Australian user before DST period (shows AEST, ACST, AWST, SGT)
- ✅ Australian user during DST before 3am (shows AEST, AEDT, ACST, ACDT, AWST, SGT)
- ✅ AEDT display updates every second
- ✅ ACDT display updates every second
- ✅ Sydney reaches 3am (AEDT disappears from navbar)
- ✅ Adelaide reaches 3am (ACDT disappears from navbar)
- ✅ Both pass 3am (navbar shows only standard times + SGT)
- ✅ Singapore time (SGT) always appears at the end
- ✅ Mobile responsive layout
- ✅ Desktop layout with proper spacing

### Universal Tests
- ✅ Non-Australian users (should not see banner or extra timezones)
- ✅ Mobile responsive display for both components
- ✅ Desktop display for both components
- ✅ Time synchronization between banner and navbar
