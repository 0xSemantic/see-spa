import { format, addDays, isBefore, startOfToday } from 'date-fns';

export const getTodayString = () => format(new Date(), 'yyyy-MM-dd');

export const getMinDate = () => format(addDays(new Date(), 1), 'yyyy-MM-dd');

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const isFutureDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return !isBefore(date, startOfToday());
};

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const formatTime = (time) => {
  const [hour, min] = time.split(':');
  const h = parseInt(hour);
  return `${h > 12 ? h - 12 : h}:${min} ${h >= 12 ? 'PM' : 'AM'}`;
};
