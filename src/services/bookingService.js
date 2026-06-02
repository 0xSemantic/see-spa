import { db } from '../firebase/firebase';
import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, where, onSnapshot, orderBy, serverTimestamp
} from 'firebase/firestore';
import { generateReceiptCode } from '../utils/receiptGenerator';
import { sendReceiptEmail } from './emailService';

export const createBooking = async (bookingData, cardLast4) => {
  const receiptCode = generateReceiptCode();
  const newBooking = {
    ...bookingData,
    receiptCode,
    paymentLast4: cardLast4,
    status: 'confirmed',
    createdAt: serverTimestamp(),
    emailSentToAdmin: false,
  };

  const docRef = await addDoc(collection(db, 'bookings'), newBooking);

  // Send emails async
  sendReceiptEmail({ ...newBooking, id: docRef.id }, false);
  sendReceiptEmail({ ...newBooking, id: docRef.id }, true);

  return { id: docRef.id, receiptCode };
};

export const getAllBookings = (callback) => {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(bookings);
  });
};

export const verifyReceipt = async (receiptCode) => {
  const q = query(
    collection(db, 'bookings'),
    where('receiptCode', '==', receiptCode.trim().toUpperCase())
  );
  const snap = await getDocs(q);
  if (snap.empty) return { success: false, message: 'Receipt not found' };

  const docSnap = snap.docs[0];
  const data = docSnap.data();
  if (data.status === 'checked_in') {
    return { success: false, message: 'Guest already checked in', booking: { id: docSnap.id, ...data } };
  }

  await updateDoc(docSnap.ref, { status: 'checked_in' });
  return { success: true, message: 'Guest checked in successfully!', booking: { id: docSnap.id, ...data } };
};

export const checkSlotAvailability = async (service, date, timeSlot) => {
  const q = query(
    collection(db, 'bookings'),
    where('service', '==', service),
    where('date', '==', date),
    where('timeSlot', '==', timeSlot),
    where('status', 'in', ['confirmed', 'checked_in'])
  );
  const snapshot = await getDocs(q);
  return snapshot.empty;
};