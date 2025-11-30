/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
  type CollectionReference,
  type WhereFilterOp,
} from "firebase/firestore";
import { db } from "../firebase";

type WhereQuery = {
  field: string;
  op: WhereFilterOp;
  value: any;
};

type OrderQuery = {
  orderBy: string;
  direction?: "asc" | "desc";
};

type QueryOption = WhereQuery | OrderQuery;

class DataListener {
  private unsubscribe: Unsubscribe | null = null;
  private key: string;

  constructor(key: string, unsubscribe: Unsubscribe) {
    this.key = key;
    this.unsubscribe = unsubscribe;
  }

  dispose() {
    if (this.unsubscribe) {
      this.unsubscribe();
      delete listeners[this.key];
      this.unsubscribe = null;
    }
  }
}

export const listeners: Record<string, Unsubscribe> = {};

export const dataListener = (
  collectionName: string,
  documentId: string | null,
  listenerName: string,
  queryOptions: QueryOption[] = [],
  callback: (data: any) => void
): DataListener | null => {
  // Clean any previous listener with same name
  if (listeners[listenerName]) {
    listeners[listenerName]();
    delete listeners[listenerName];
  }

  // ✅ If listening to a single document
  if (documentId) {
    const ref = doc(db, collectionName, documentId);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      });
    });

    listeners[listenerName] = unsubscribe;
  }

  // ✅ Otherwise, listen to a collection with optional queries
  const ref: CollectionReference | any = collection(db, collectionName);
  let q = query(ref);

  queryOptions.forEach((opt) => {
    if ("field" in opt && "op" in opt) {
      q = query(q, where(opt.field, opt.op, opt.value));
    } else if ("orderBy" in opt) {
      q = query(q, orderBy(opt.orderBy, opt.direction || "asc"));
    }
  });

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() || {}),
    }));
    callback(data);
  });

  listeners[listenerName] = unsubscribe;
  return new DataListener(listenerName, unsubscribe);
};
