"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  Unsubscribe,
} from "firebase/firestore";

type FirestoreOptions = {
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  whereConstraints?: { field: string; operator: string; value: any }[];
};

export function useFirestore<T>(
  collectionName: string,
  options: FirestoreOptions = {}
) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let unsubscribe: Unsubscribe;

    try {
      console.log(`Setting up Firestore subscription for '${collectionName}' collection`);
      
      const queryConstraints: QueryConstraint[] = [];

      // Add where constraints if provided
      if (options.whereConstraints && options.whereConstraints.length > 0) {
        options.whereConstraints.forEach((constraint) => {
          console.log(`Adding where constraint: ${constraint.field} ${constraint.operator} ${constraint.value}`);
          queryConstraints.push(
            where(constraint.field, constraint.operator as any, constraint.value)
          );
        });
      }

      // Add orderBy constraint if provided
      if (options.orderByField) {
        console.log(`Adding orderBy constraint: ${options.orderByField} ${options.orderDirection || "asc"}`);
        queryConstraints.push(
          orderBy(options.orderByField, options.orderDirection || "asc")
        );
      }

      const collectionRef = collection(db, collectionName);
      const q = queryConstraints.length > 0
        ? query(collectionRef, ...queryConstraints)
        : query(collectionRef);

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(`Received snapshot for '${collectionName}' with ${snapshot.size} documents`);
          const results: T[] = [];
          
          snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            console.log(`Document ID: ${doc.id}, Data:`, data);
            
            results.push({
              id: doc.id,
              ...data,
            } as T);
          });
          
          setDocuments(results);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`Firestore subscription error for '${collectionName}':`, err);
          setError(`Failed to fetch ${collectionName}: ${err.message}`);
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.error(`Firestore hook setup error for '${collectionName}':`, err);
      setError(`Error setting up Firestore hook: ${err.message}`);
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      console.log(`Cleaning up Firestore subscription for '${collectionName}'`);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, JSON.stringify(options)]);

  return { documents, loading, error };
} 