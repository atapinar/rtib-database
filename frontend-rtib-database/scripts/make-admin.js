// This script makes a user an admin
// Usage: node scripts/make-admin.js user@example.com

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, updateDoc, doc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Your Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function makeUserAdmin(email) {
  if (!email) {
    console.error('Please provide an email address');
    console.log('Usage: node scripts/make-admin.js user@example.com');
    process.exit(1);
  }

  try {
    // Query for the user document by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    // Get the first matching document
    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.id;
    
    // Update the user document
    await updateDoc(doc(db, 'users', userId), {
      isAdmin: true
    });

    console.log(`✅ User ${email} has been successfully made an admin!`);
    process.exit(0);
  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];
makeUserAdmin(email); 