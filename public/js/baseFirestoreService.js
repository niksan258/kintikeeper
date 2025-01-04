// firestoreService.js
import { db } from "./firebaseinit.js";
import { collection, query, where, getDocs, doc,getDoc, addDoc, updateDoc, deleteDoc, orderBy, startAfter, limit, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

class BaseFirestoreService {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.col = collection(db, collectionName);
    }

    async getDocumentById(documentId) {
        const docRef = doc(db, this.collectionName, documentId);
        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                return {
                    id: docSnapshot.id,
                    ...docSnapshot.data()
                };
            } else {
                throw new Error(`No such document with ID: ${documentId}`);
            }
        } catch (error) {
            console.error(`Error getting document by ID from ${this.collectionName}:`, error);
            throw error;
        }
    }

    async getDocuments(filter, lastVisibleDoc = null, pageSize = null) {
        let q = query(this.col, orderBy("updatedAt", "desc"));
        
        if (filter) 
            q = query(q, where(filter.field, filter.operator, filter.value));

        if (lastVisibleDoc)
            q = query(q, startAfter(lastVisibleDoc));

        if(pageSize)
            q = query(q, limit(pageSize));

        try {
            const querySnapshot = await getDocs(q);
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            return {
                documents,
                lastVisible
            };
        } catch (error) {
            console.error(`Error getting documents from ${this.collectionName}:`, error);
            throw error;
        }
    }

    async addDocument(data) {
        try {
            const documentData = {
                ...data,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };
            
            await addDoc(this.col, documentData);
            console.log(`Document added to ${this.collectionName}`);
        } catch (error) {
            console.error(`Error adding document to ${this.collectionName}:`, error);
            throw error;
        }
    }

    async updateDocument(updatedData) {
        const {id, ...updatedFields} = updatedData;
        const docRef = doc(db, this.collectionName, id);
        try {
            const documentData = {
                ...updatedFields,
                updatedAt: Timestamp.now(),
            };
            await updateDoc(docRef, documentData);
            console.log(`Document in ${this.collectionName} updated`);
        } catch (error) {
            console.error(`Error updating document in ${this.collectionName}:`, error);
            throw error;
        }
    }

    async deleteDocument(documentId) {
        const docRef = doc(db, this.collectionName, documentId);
        try {
            await deleteDoc(docRef);
            console.log(`Document from ${this.collectionName} deleted`);
        } catch (error) {
            console.error(`Error deleting document from ${this.collectionName}:`, error);
            throw error;
        }
    }
}

export default BaseFirestoreService;
