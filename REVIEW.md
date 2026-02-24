# REVIEW.md

## Issue 1: useEffect runs on every render

**Line:** 15  
**Problem:** `useEffect` updates `document.title` without dependencies, causing it to run on every render unnecessarily.  
**Fix:** Add a dependency array `[questions]` so it only updates when `questions` change.

---

## Issue 2: Using Math.random() for keys

**Line:** 34  
**Problem:** `Math.random()` is used as React `key`, which breaks reconciliation and hurts performance.  
**Fix:** Use `question.id` as a stable key.

---

## Issue 3: getFilteredQuestions recomputes every render

**Line:** 18  
**Problem:** Filtering, sorting, and mapping 500 items on every render is very expensive.  
**Fix:** Memoize the result using `useMemo` based on `search` and `filters`.

---

## Issue 4: selectedId state typing missing

**Line:** 11  
**Problem:** `selectedId` is initialized as `null` but not typed, causing TypeScript warnings.  
**Fix:** Type it as `string | null`.

---

## Issue 5: fetch call has no error handling

**Line:** 28  
**Problem:** Fetching `/api/track` has no `.catch()` or error handling.  
**Fix:** Wrap fetch in try/catch or handle errors properly.

---

## Issue 6: displayTags and formattedDate calculated inside map

**Line:** 25  
**Problem:** Mapping and creating `displayTags` and `formattedDate` on every render is inefficient.  
**Fix:** Move calculation into `useMemo` along with filtering.

---

## Issue 7: Rendering all 500 items at once

**Line:** 34  
**Problem:** Rendering 500 items without virtualization can slow down the UI.  
**Fix:** For very large lists, consider `react-window` or a scroll container with fixed height (500px) as implemented.

---

**Summary:**

- Main performance issues fixed using `useMemo`.
- Proper `key` usage, TypeScript typing, and error handling added.
- UI now handles 500 questions smoothly.
