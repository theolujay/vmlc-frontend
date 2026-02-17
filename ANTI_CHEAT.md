# Anti-Cheating Implementation Summary

This document outlines the technical and psychological deterrents implemented to maintain exam integrity on the VMLC Exam Portal.

## 🖥️ Desktop Measures
- **Mandatory Full-Screen Mode**: The exam requires entering full-screen mode, and exiting it triggers a blur and a severe warning.
- **Keyboard Shortcut Blocking**: Prevents common cheating commands including:
    - `PrintScreen`: Clears clipboard and triggers warning.
    - `Ctrl/Cmd + C/V/X`: Disables Copy, Paste, and Cut.
    - `F12`, `Ctrl+Shift+I/J/C`, `Ctrl+U`: Blocks access to Browser Developer Tools.
- **Window Monitoring**: 
    - **Active Blur**: Instantly blurs the entire exam content when the browser window loses focus or the user switches tabs.
    - **Tab-Switch Logging**: Detects when a user returns from another tab and displays a persistent warning that the activity has been recorded.
- **Print Protection**: Uses `@media print` CSS to hide all exam content if a user attempts to "Print to PDF" or use physical printing.
- **Context Menu Block**: Disables right-click menus to prevent "Save Image As" or "Inspect Element" shortcuts.

## 📱 Mobile Measures
- **Mandatory Full-Screen Mode**: The exam requires entering full-screen mode, and exiting it triggers a blur and a severe warning.
- **Screenshot "Detection" Bluff**: Monitors rapid focus/blur transitions (typical of mobile screenshot animations) and triggers a high-severity "Screenshot Detected" alert.
- **Watermark Overlay**: A non-removable, repeating forensic watermark containing the **Candidate's Name and Email** is layered over all questions. This makes any captured photo or screen-grab immediately traceable.
- **Interaction Restrictions**:
    - `user-select: none`: Disables text selection and the "magnifying glass" cursor.
    - `-webkit-touch-callout: none`: Prevents long-press context menus on iOS.
    - `-webkit-user-drag: none`: Prevents dragging of images or text into other apps.
- **Multi-Finger Gesture Warning**: Detects 3+ finger touches (common for Android screenshot gestures) and issues a warning.
- **Split-Screen Detection**: Monitors window resize events to detect and block "Split Screen" or "Slide Over" multitasking attempts.
- **Clipboard Purge**: Automatically attempts to overwrite the system clipboard with a blank space whenever the candidate returns to the exam tab.

## 👁️ AI-Powered Face Proctoring
- **Real-Time Presence Monitoring**: Utilizes `react-webcam` and `face-api.js` to continuously monitor the candidate via their webcam.
- **No Face Detection**: Triggers warnings if the candidate leaves the camera's field of view.
- **Multiple Faces Detection**: Alerts if more than one face is present in the frame.
- **Attention Lapse Detection**: Flags if the candidate is looking away from the screen for an extended period.
- **Visual Feedback**: Provides a subtle, live webcam feed with status indicators to inform the candidate they are being proctored.

## 🔀 Question & Option Shuffling
- **Randomized Question Order**: Questions are presented in a random order for each exam session.
- **Randomized Option Order**: The order of answer options (A, B, C, D) is unique for each question within each session.
- **Persistent Shuffling**: Shuffled orders are stored locally to maintain consistency if the page is refreshed.
- **Correct Answer Mapping**: An internal mechanism ensures that despite shuffling, the correct answer selection is always accurately recorded.

## 🛠️ Core Technology
- **`useAntiCheating` Hook**: A centralized, high-performance React hook that manages all event listeners, fullscreen state, and global CSS injections.
- **`FaceProctor` Component**: Encapsulates webcam access, AI model loading, and real-time face detection logic.
- **`shuffleArray` Utility**: Ensures randomization of exam content.
- **Forensic CSS**: Uses advanced CSS selectors (`*, *::before, *::after`) to ensure protection isn't bypassed by nested elements.
- **Graceful Failure**: Implements `try-catch` blocks for sensitive APIs (like Clipboard) to ensure app stability across all browser versions.
