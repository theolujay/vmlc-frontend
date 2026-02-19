# Helpdesk Thread Documentation

The Helpdesk Thread feature provides a real-time communication channel between candidates and the Verboheit Helpdesk team. It is designed to be persistent and accessible throughout the candidate's journey, including during active examinations.

## Architecture

The helpdesk system follows a clean, modular architecture:

1.  **Component**: `HelpdeskThread.tsx` handles the UI and user interactions.
2.  **Hooks**: Specialized hooks encapsulate state and side effects:
    *   `useListConversations`: Discovers existing helpdesk conversations for the user.
    *   `useGetHelpdeskMessages`: Manages the message history and updates for a specific conversation.
    *   `useSendHelpdeskMessage`: Handles the logic for sending new messages.
3.  **Service**: `HelpdeskService.ts` performs the actual API calls via `axios`.
4.  **Types**: `SupportType.ts` defines the data structures for messages and conversations.

## Core Functionality

### 1. Conversation Discovery
When the chat is opened, it automatically identifies the active conversation. It currently selects the first available conversation from the user's history to ensure a continuous thread.

### 2. Message History
The component fetches the full history of the conversation upon initialization. It distinguishes between:
*   **Candidate (User) Messages**: Displayed on the right with a dark blue background.
*   **Staff (Helpdesk) Messages**: Displayed on the left with a white background and border.

### 3. Real-time Interaction
While the system primarily uses polling/refreshing on component mount, it supports immediate local updates:
*   When a user sends a message, it is immediately added to the local UI state if the API call is successful.
*   The chat window automatically scrolls to the most recent message whenever the history updates.

### 4. Integration in Examinations
The helpdesk thread is integrated into the `Exam` component via a persistent "Help?" button. This button:
*   Remains visible and accessible regardless of the current question.
*   Opens a non-intrusive floating chat window.
*   Allows candidates to report technical issues or seek clarifications without leaving the secure exam environment.

## Key Components

### UI/UX Features
*   **Status Indicator**: Shows an "Online" status and the current competition stage.
*   **Welcome Message**: Greets the candidate by name to provide a personalized experience.
*   **Timestamping**: Every message is marked with the time it was sent.
*   **Loading States**: Smooth transitions and spinners during message fetching or sending.

## Data Flow
1.  **Mount**: `useListConversations` -> Get Conversation ID.
2.  **Fetch**: `useGetHelpdeskMessages(id)` -> Load message array into state.
3.  **Send**: User Input -> `sendMessage(payload)` -> API call -> Update local state with response -> Scroll to bottom.

---

## Proposed Real-time API Design (Inspired by Notifications)

To ensure a high-performance, real-time experience comparable to the notification system, we propose the following helpdesk architecture:

### 1. Centralized State Management (`HelpdeskProvider`)
A new `HelpdeskProvider` context will manage global helpdesk state, including active conversations, real-time message updates, and unread counts. This eliminates redundant API calls and state mismatches when navigating between components (e.g., from Dashboard to Exam Portal).

```typescript
interface HelpdeskContextType {
  activeConversation: HelpdeskConversationType | null;
  messages: HelpdeskMessageType[];
  unreadCount: number;
  isConnected: boolean;
  sendMessage: (text: string) => Promise<void>;
  markAsRead: (messageId: string) => void;
  isLoading: boolean;
}
```

### 2. WebSocket Service Integration
The `HelpdeskService` will be enhanced to handle WebSocket connections (similar to `NotificationService`), allowing for instantaneous message delivery without polling.

- **Events**:
  - `chat_message`: Triggered when a new message is received from staff or candidate.
  - `message_read`: Triggered when a message is marked as read by the recipient.
  - `presence_update`: Indicates the online/offline status of helpdesk staff.

### 3. Unified Hook (`useHelpdeskThread`)
A single, high-level hook will provide components with all necessary functionality, abstracting the complexities of WebSocket management and state synchronization.

```typescript
const { 
  messages, 
  sendMessage, 
  isConnected, 
  unreadCount 
} = useHelpdeskThread();
```

### 4. Comparison with Notification System
| Feature | Notification System | Helpdesk Thread (Proposed) |
| :--- | :--- | :--- |
| **Transport** | WebSocket + REST | WebSocket + REST |
| **Provider** | `NotificationProvider` | `HelpdeskProvider` |
| **Real-time** | `notification_activity` event | `chat_message` event |
| **State** | Global (accessible via hook) | Global (accessible via hook) |
| **Persistence** | Database-backed history | Database-backed history |
