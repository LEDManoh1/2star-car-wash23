/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // adjust your path

export class DataWrite {
  // ✅ Create Document (no async keyword)
  static create(collectionName: string, data: any) {
    return addDoc(collection(db, collectionName), data);
  }

  // ✅ Set Document (replace or merge)
  static set(collectionName: string, docId: string, data: any, merge = true) {
    return setDoc(doc(db, collectionName, docId), data, { merge });
  }

  // ✅ Update Document
  static update(collectionName: string, docId: string, data: any) {
    return updateDoc(doc(db, collectionName, docId), data);
  }

  // ✅ Delete a document
  static delete(collectionName: string, docId: string) {
    return deleteDoc(doc(db, collectionName, docId));
  }

  // ✅ Array Union Example
  static addToArray(
    collectionName: string,
    docId: string,
    field: string,
    value: any
  ) {
    return updateDoc(doc(db, collectionName, docId), {
      [field]: arrayUnion(value),
    });
  }
}
