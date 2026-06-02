import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    timeSlot: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const [confirmedReceipt, setConfirmedReceipt] = useState(null);

  const updateBooking = (fields) => {
    setBookingData((prev) => ({ ...prev, ...fields }));
  };

  const resetBooking = () => {
    setStep(1);
    setBookingData({
      service: '',
      date: '',
      timeSlot: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
    });
    setConfirmedReceipt(null);
  };

  return (
    <BookingContext.Provider
      value={{ step, setStep, bookingData, updateBooking, confirmedReceipt, setConfirmedReceipt, resetBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
