import { useState } from 'react';
import { checkSlotAvailability } from '../services/bookingService';

export const useAvailability = () => {
  const [loading, setLoading] = useState(false);

  const checkSlot = async (service, date, timeSlot) => {
    setLoading(true);
    try {
      const available = await checkSlotAvailability(service, date, timeSlot);
      return available;
    } finally {
      setLoading(false);
    }
  };

  return { checkSlot, loading };
};
