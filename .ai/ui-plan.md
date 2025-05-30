# UI Architecture for 10xCards

## 1. UI Structure Overview

10xCards features a minimal, focused user interface designed for efficient flashcard creation, management, and study. The application distinguishes between unauthenticated and authenticated states, presenting only login/registration to unauthenticated users and a persistent, simple navigation bar to authenticated users. Core flows—AI-powered flashcard generation, manual flashcard management, and study sessions—are each handled in dedicated views, with user feedback provided via toast notifications and inline validation. Accessibility, security, and a distraction-free experience are prioritized throughout.
Use responsive design based on Tailwind, components from Shadcn/ui and React.

## 2. List of Views

### 1. Login View
- **Path:** `/login`
- **Main Purpose:** Authenticate users.
- **Key Information:** Email, password fields; link to registration.
- **Key Components:** Login form, inline validation, submit button, error messages, loading spinner.
- **UX/Accessibility/Security:** Accessible labels, keyboard navigation, password masking, inline errors, secure handling of credentials.

### 2. Registration View
- **Path:** `/register`
- **Main Purpose:** Register new users.
- **Key Information:** Email, password fields; link to login.
- **Key Components:** Registration form, inline validation, submit button, error messages, loading spinner.
- **UX/Accessibility/Security:** Accessible labels, keyboard navigation, password requirements, inline errors, secure handling of credentials.

### 3. Flashcard Generation View
- **Path:** `/generate`
- **Main Purpose:** Allow users to paste text and generate AI-powered flashcard suggestions.
- **Key Information:** Text input (1000–10000 chars), generate button, loading state, error messages.
- **Key Components:** Text area, character counter, generate button, loading spinner, error toast.
- **UX/Accessibility/Security:** Input validation (1000–10000 chars), accessible form controls, clear error feedback, disables button during loading.

### 4. Flashcard Suggestions Review View
- **Path:** `/generate` (below generation form)
- **Main Purpose:** Review, accept, edit, or reject AI-generated flashcard suggestions.
- **Key Information:** List of suggested flashcards (front/back), accept/edit/reject actions.
- **Key Components:** Flashcard suggestion list, accept button, edit button (inline), reject button, save button, loading spinner, toast notifications.
- **UX/Accessibility/Security:** Accessible buttons with icons, rejected cards remain visible in the review list with a red pastel background (not removed or hidden), accepted cards have a green pastel background, inline editing, confirmation on save, error handling.
- Accept and Reject icon buttons are disabled when the card is already accepted or rejected, respectively.
- All icon-only action buttons have accessible aria-labels for screen readers.
- There are no tooltips on these buttons by default.

### 5. My Flashcards View
- **Path:** `/flashcards`
- **Main Purpose:** List, edit, delete, and manually add flashcards.
- **Key Information:** Paginated/infinite scroll list of user's flashcards, flashcard details, action buttons.
- **Key Components:** Flashcard list (infinite scroll), edit button, delete button (with confirmation modal), add new button, empty state, loading spinner, toast notifications.
- **UX/Accessibility/Security:** Keyboard navigation, accessible action buttons, confirmation for deletes, clear empty state, secure data access.

### 6. Manual Flashcard Creation/Edit View
- **Path:** `/flashcards/new`, `/flashcards/:id/edit`
- **Main Purpose:** Create or edit a flashcard manually.
- **Key Information:** Front and back text fields, save/cancel actions.
- **Key Components:** Form fields, inline validation, save button, cancel button, loading spinner, error messages.
- **UX/Accessibility/Security:** Accessible form controls, validation, keyboard navigation, error feedback.

### 7. Study Session View
- **Path:** `/study`
- **Main Purpose:** Present flashcards for review using spaced repetition.
- **Key Information:** Current card (front/back), reveal/back button, recall rating buttons, progress indicator.
- **Key Components:** Flashcard display, reveal button, recall rating buttons, next card button, loading spinner, empty state.
- **UX/Accessibility/Security:** Keyboard shortcuts, accessible buttons, clear progress, focus management.

### 8. Error/Not Found View
- **Path:** `*` (fallback)
- **Main Purpose:** Display user-friendly error or not found messages.
- **Key Information:** Error message, link to home or login.
- **Key Components:** Error message, navigation link.
- **UX/Accessibility/Security:** Clear messaging, accessible navigation.

### 9. Persistent Top Navigation Bar
- **Path:** All authenticated views
- **Main Purpose:** Enable navigation between main sections and logout.
- **Key Information:** Links to Generate, My Flashcards, Study, Logout; active state.
- **Key Components:** Navigation bar, navigation links, logout button, active indicator.
- **UX/Accessibility/Security:** Keyboard navigation, ARIA roles, visible focus, secure logout.

## 3. User Journey Map

1. **Unauthenticated User:**
   - Lands on `/login` (or `/register`).
   - Completes login/registration with inline validation.
   - On success, redirected to `/generate`.

2. **Authenticated User:**
   - Sees persistent top navigation bar.
   - On `/generate`, pastes text and generates flashcard suggestions.
   - Reviews suggestions, accepts/edits/rejects as needed.
   - Saves accepted flashcards.
   - Navigates to `/flashcards` to view, edit, delete, or add manual flashcards.
   - Starts a study session via `/study`, reviews cards, rates recall.
   - Can logout at any time (returns to `/login`).

3. **Error Handling:**
   - Inline errors for form validation.
   - Toast notifications for API errors, feedback.
   - Token expiration triggers redirect to `/login`.

## 4. Layout and Navigation Structure

- **Unauthenticated:** Only login or registration view visible; no navigation bar.
- **Authenticated:** Persistent top navigation bar with links to:
  - Generate (`/generate`)
  - My Flashcards (`/flashcards`)
  - Study (`/study`)
  - Logout (button)
- Navigation bar highlights active section.
- Navigation is accessible via keyboard and screen readers.
- All navigation actions are client-side for fast transitions.
- Logout securely clears JWT and redirects to `/login`.

## 5. Key Components

- **Top Navigation Bar:** Persistent, minimal, accessible, with active state and logout.
- **Forms:** For login, registration, flashcard creation/editing; accessible, with inline validation.
- **Flashcard List:** Infinite scroll, loading spinner, empty state, action buttons.
- **Flashcard Suggestion List:** Accept, edit, reject actions; inline editing.
- Accept and Reject icon buttons are disabled when the card is already accepted or rejected, respectively.
- All icon-only action buttons have accessible aria-labels for screen readers.
- There are no tooltips on these buttons by default.
- **Flashcard Display:** For study sessions; reveal and recall rating actions.
- **Toasts:** For feedback and errors; only one visible at a time.
- **Modals:** For delete confirmation, editing, or manual creation.
- **Loading Spinners:** For all async actions and loading states.
- **Error Message Component:** For fallback and error views.

## 6. Custom ViewModel

- **FlashcardSuggestionViewModel** {
    front_text: string;
    back_text: string;
    accepted: boolean;
    edited: boolean;
    isEditing: boolean;
    error?: string;
    generation_id?: string;
  }

// Note: The 'source' value for DTO ('ai-full' or 'ai-edited') is derived at save time based on the 'accepted' and 'edited' booleans.

## 7. Flashcard States

1. **Accepted flashcards**: Green pastel background.
2. **Rejected flashcards**: Red pastel background, remain visible in the review list (not removed or hidden). No 'pending' state. 