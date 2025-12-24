import { collection, getDocs, query, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface ResourceInput {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

/**
 * Fetch all resources from Firestore
 */
export async function getResources(): Promise<Resource[]> {
  try {
    const resourcesRef = collection(db, "resources");
    const q = query(resourcesRef, orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const resourcesData: Resource[] = [];
    querySnapshot.forEach((doc) => {
      resourcesData.push({
        id: doc.id,
        ...doc.data(),
      } as Resource);
    });
    return resourcesData;
  } catch (error) {
    // If ordering fails (e.g., index not created), fetch without order
    console.error("Error fetching resources with order: ", error);
    try {
      const querySnapshot = await getDocs(collection(db, "resources"));
      const resourcesData: Resource[] = [];
      querySnapshot.forEach((doc) => {
        resourcesData.push({
          id: doc.id,
          ...doc.data(),
        } as Resource);
      });
      return resourcesData;
    } catch (fallbackError) {
      console.error("Error in fallback fetch: ", fallbackError);
      throw fallbackError;
    }
  }
}

/**
 * Fetch a single resource by ID
 */
export async function getResource(id: string): Promise<Resource | null> {
  try {
    const docRef = doc(db, "resources", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Resource;
    }
    return null;
  } catch (error) {
    console.error("Error fetching resource: ", error);
    throw error;
  }
}

/**
 * Add a new resource to Firestore
 */
export async function addResource(data: ResourceInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "resources"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding resource: ", error);
    throw error;
  }
}

/**
 * Update an existing resource in Firestore
 */
export async function updateResource(id: string, data: ResourceInput): Promise<void> {
  try {
    const docRef = doc(db, "resources", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating resource: ", error);
    throw error;
  }
}

/**
 * Delete a resource from Firestore
 */
export async function deleteResource(id: string): Promise<void> {
  try {
    const docRef = doc(db, "resources", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting resource: ", error);
    throw error;
  }
}

