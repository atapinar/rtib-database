import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  DocumentData,
  QueryConstraint,
  orderBy,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  CollectionReference,
  Query
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Generic function to add a document to a collection
export const addDocument = async <T extends DocumentData>(collectionName: string, data: T): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

// Get a document by its ID
export const getDocument = async <T>(collectionName: string, documentId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;
    }
    return null;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Update a document
export const updateDocument = async <T extends DocumentData>(collectionName: string, documentId: string, data: Partial<T>): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, documentId: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Get all documents from a collection
export const getAllDocuments = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as unknown as T);
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

// Query documents with filters
export const queryDocuments = async <T>(
  collectionName: string, 
  constraints: QueryConstraint[]
): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as unknown as T);
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
};

export const getDocuments = async <T>(
  collectionName: string,
  orderByField?: string
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = orderByField ? query(collectionRef, orderBy(orderByField)) : collectionRef;
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

// Upload a file to Firebase Storage
export const uploadFile = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path: string): Promise<void> => {
  try {
    // Create a reference to the file to delete
    const storageRef = ref(storage, path);
    
    // Delete the file
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}; 