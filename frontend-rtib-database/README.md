# RTIB Database

A Next.js application for managing company information with Firebase authentication and Firestore database.

## Features

- **User Authentication**: Email/password login and signup using Firebase Authentication
- **Company Management**: Add, view, edit, and delete company records
- **Admin Panel**: User management and advanced company administration
- **Responsive Design**: Works on mobile and desktop with a modern UI
- **Real-time Database**: Uses Firestore for real-time data updates

## Technologies Used

- **Next.js 15**: React framework with server-side rendering
- **TypeScript**: Type-safe JavaScript
- **Firebase**: Authentication and Firestore database
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password sign-in method
3. Create a Firestore database in test mode
4. Create a web app in your Firebase project and copy the configuration values to your `.env.local` file

## Project Structure

- `/app`: Next.js app router components
- `/components`: Reusable React components
- `/lib`: Utility functions and Firebase configuration
- `/context`: React context providers
- `/hooks`: Custom React hooks
- `/public`: Static assets

## Database Structure

The Firestore database contains the following collections:

1. **companies**: Company information
   - Fields: name, industry, location, description, website, contactEmail, contactPhone, employeeCount, foundedYear, createdAt, updatedAt

2. **users**: User information and roles
   - Fields: email, isAdmin, createdAt

## Admin Panel

The application includes an admin panel accessible only to users with the `isAdmin` flag set to `true` in their user record. To make a user an admin:

1. Sign up a new user through the application
2. In the Firebase console, go to Firestore Database
3. Find the user in the "users" collection
4. Edit the document and set `isAdmin` to `true`

The admin panel provides the following functionality:

- **User Management**: View users and toggle admin status
- **Company Management**: Add, edit, and delete companies with enhanced controls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 