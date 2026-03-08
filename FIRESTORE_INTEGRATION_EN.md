# Firestore Integration Documentation

This document explains how Firestore is integrated into the New Student Reception System and where the account management is handled.

## Table of Contents
1. [Overview](#overview)
2. [How Firestore Integration Works](#how-firestore-integration-works)
3. [Firestore Account Management](#firestore-account-management)
4. [Data Structure](#data-structure)
5. [Key Features](#key-features)
6. [Setup Instructions](#setup-instructions)
7. [Security Considerations](#security-considerations)

---

## Overview

This project is a New Student Reception System built with Electron + React + TypeScript. It uses **Firebase Firestore** as the backend database to manage student information and track reception status.

### Technology Stack
- **Firebase Admin SDK** (v13.0.1): Server-side Firestore access
- **Electron**: Desktop application framework
- **React + TypeScript**: Frontend

---

## How Firestore Integration Works

### 1. Architecture Overview

This project initializes the Firebase Admin SDK in Electron's **Main Process** to connect to Firestore. The frontend (Renderer Process) communicates with the Main Process through IPC (Inter-Process Communication) to perform Firestore operations.

```
┌─────────────────────────────────────────────┐
│  Renderer Process (React/TypeScript)        │
│  - UI Components                            │
│  - Hooks (useFirebase, useStudentData)      │
└────────────────┬────────────────────────────┘
                 │ IPC Communication
                 │ (electron.ipcRenderer.invoke)
┌────────────────▼────────────────────────────┐
│  Main Process (Node.js)                     │
│  - Firebase Admin SDK Initialization        │
│  - Firestore Connection                     │
│  - CRUD Operations                          │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  Firebase Firestore (Cloud Database)        │
│  - Collection: "students"                   │
│  - Documents: Student Data                  │
└─────────────────────────────────────────────┘
```

### 2. Initialization Process

#### Step 1: SDK Configuration File Placement
- Firebase credentials (service account key) are stored in the `config` folder in the **user's home directory**
- File path: `{HOME_DIRECTORY}/config/sdk.json`
- This file is the **service account private key JSON file** downloaded from Firebase Console

#### Step 2: Firebase Initialization
File: `src/main/firebase.ts`

```typescript
export const initializeFirebase = () => {
  // 1. Check if SDK configuration file exists
  if (!isExsistsFirebaseSDKJson()) {
    // Show error dialog
    return;
  }
  
  // 2. Initialize Firebase Admin SDK
  try {
    initializeApp({
      credential: credential.cert(
        JSON.parse(readFileSync(join(BASE_PATH, 'config', 'sdk.json')).toString())
      ),
    });
  } catch (error) {
    // Error handling
  }
};
```

This function is automatically called when the application starts (`app.whenReady()` in `src/main/index.ts:71`).

### 3. Firestore Operations via IPC Communication

When accessing Firestore from the frontend, the following flow is used:

```typescript
// Frontend (Renderer Process)
const studentData = await window.electron.ipcRenderer.invoke('getStudentData', studentId);

// ↓ IPC Communication

// Main Process
ipcMain.handle('getStudentData', async (_event, studentId) => 
  getStudentData(studentId)
);
```

### 4. Registered IPC Handlers

The following handlers are registered in `src/main/index.ts`:

| IPC Channel | Description | Implementation File |
|------------|-------------|-------------------|
| `saveSdk` | Save Firebase SDK configuration file | `functions/saveSdk.ts` |
| `getStudentData` | Retrieve student information | `functions/getStudentData.ts` |
| `acceptReception` | Execute reception process | `functions/acceptReception.ts` |
| `editRemarks` | Edit remarks field | `functions/editRemark.ts` |
| `cancelReception` | Cancel reception | `functions/cancelReception.ts` |
| `printRecipt` | Print receipt | `functions/printRecipt.ts` |
| `testPrint` | Test print | `functions/printRecipt.ts` |
| `countStudentData` | Get total student data count | `functions/countStudentData.ts` |

---

## Firestore Account Management

### Where Accounts Are Managed

Firestore accounts and credentials are managed in the following locations:

#### 1. **Firebase Console** (Primary Management Location)
   - URL: https://console.firebase.google.com/
   - Firebase projects are created and managed here
   - Firestore database settings, security rules, and usage monitoring are available

#### 2. **Google Cloud Console** (Backend Management)
   - URL: https://console.cloud.google.com/
   - Firebase uses Google Cloud Platform internally
   - Service account creation and management are done here
   - Access permissions are managed via IAM (Identity and Access Management)

#### 3. **Service Account Key Generation Steps**

Follow these steps to generate a service account key (`sdk.json`):

1. **Access Firebase Console**
   - Select your project
   - Settings (⚙️) → Project settings → Service accounts

2. **Click "Generate new private key"**
   - A JSON file will be downloaded
   - This file is used as `sdk.json`

3. **Important**: This file contains sensitive information, so:
   - Do not commit to Git repository (already excluded in `.gitignore`)
   - Store in a secure location
   - Regular rotation (key regeneration) is recommended

### Predicted Account Management for This Project

Based on the project structure, we can predict the following management approach:

1. **Firebase Project**: Owned by "Tokyo University of Technology" or "MediaLobby" organization
2. **Access Permissions**: 
   - Members with admin privileges can access Firebase Console
   - Service account has minimal permissions (Firestore read/write only)
3. **Environment Separation**: 
   - Likely using different Firebase projects for development and production
   - Each using different `sdk.json` files

---

## Data Structure

### Firestore Collection: `students`

Student information is stored in the `students` collection. Each document ID is the **student ID number**.

```typescript
interface StudentData {
  studentName: string;      // Student name
  kana: string;             // Kana (phonetic reading)
  department: string;       // Department
  remarks: string;          // Remarks
  supply: any;              // Supply information
  isDeprecatedPC: boolean;  // Legacy PC usage flag
  isNeedNotify: boolean;    // Notification needed flag
  receptionStatus: boolean; // Reception status (true: received, false: not received)
}
```

### Database Operation Examples

#### Retrieve Student Information
```typescript
const db = firestore();
const docRef = db.collection('students').doc(studentId);
const docSnap = await docRef.get();
const studentData = docSnap.data();
```

#### Update Reception Status (Using Transaction)
```typescript
await db.runTransaction(async (transaction) => {
  const docRef = db.collection('students').doc(studentId);
  const docSnap = await transaction.get(docRef);
  
  transaction.update(docRef, {
    receptionStatus: true
  });
});
```

---

## Key Features

### 1. Get Student Data (`getStudentData`)
- Retrieves student data from Firestore based on student ID
- File: `src/main/functions/getStudentData.ts`

### 2. Accept Reception (`acceptReception`)
- Updates student reception status to `true`
- Uses transactions to ensure data consistency
- File: `src/main/functions/acceptReception.ts`

### 3. Cancel Reception (`cancelReception`)
- Reverts reception status to `false`
- File: `src/main/functions/cancelReception.ts`

### 4. Edit Remarks (`editRemarks`)
- Updates student remarks field
- File: `src/main/functions/editRemark.ts`

### 5. Count Student Data (`countStudentData`)
- Gets total number of students in database
- Also used as connection test
- File: `src/main/functions/countStudentData.ts`

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Place Firebase SDK Configuration File

#### Method A: Configure from within the app (Recommended)
1. Launch the application
2. Open settings screen
3. Select JSON file from "Firebase SDK Configuration"
4. Restart the application

#### Method B: Manual placement
1. Download service account key (JSON) from Firebase Console
2. Place the file at:
   - Windows: `C:\Users\{USERNAME}\config\sdk.json`
   - macOS/Linux: `/home/{USERNAME}/config/sdk.json`

### 3. Start Application
```bash
# Development mode
npm run dev

# Build
npm run build:win  # Windows
```

---

## Security Considerations

### 1. Secret Key Management
- ✅ `sdk.json` is excluded in `.gitignore`
- ✅ Stored in user's home directory (outside application)
- ⚠️ Regular key rotation is recommended
- ⚠️ Consider using environment variables or Secrets Manager for production

### 2. Firestore Security Rules
Since the implementation uses Firebase Admin SDK, security rules are bypassed. Ensure:

- Service account has minimal required permissions only
- Security rules are properly configured in Firebase Console
- Unnecessary read/write permissions are restricted

### 3. Error Handling
- User-friendly messages displayed on connection errors
- Transactions used to ensure data consistency
- Data validation performed for critical operations

---

## Troubleshooting

### SDK Configuration File Not Found
**Error**: "Firebase SDK connection information does not exist"

**Solution**:
1. Confirm `{HOME_DIRECTORY}/config/` directory exists
2. Verify `sdk.json` file is correctly placed
3. Check JSON file format is valid
4. Download new key from Firebase Console and replace

### Connection Error
**Error**: "Connection failed"

**Solution**:
1. Check internet connection
2. Verify Firebase project URL is correct
3. Confirm service account key is valid (not revoked)
4. Check project status in Firebase Console

### Data Integrity Error
**Error**: "Data integrity verification failed"

**Solution**:
1. Re-scan the student ID
2. Verify data exists correctly in Firestore
3. Check if multiple users are operating on same data simultaneously

---

## Summary

Firestore integration in this project is designed as follows:

1. **Secure**: Uses service account key, stored securely locally
2. **Separated**: Responsibilities separated between Main and Renderer processes
3. **Transaction-aware**: Ensures data consistency
4. **Error handling**: Appropriate error messages and user guidance

Firestore accounts are managed via **Firebase Console** and **Google Cloud Console**, and it is predicted that organization administrators have access permissions for this project.

---

**Created**: 2026-02-02  
**Version**: 1.0  
**Target System**: New Student Reception System v1.0.5
