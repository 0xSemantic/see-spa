const dummyCards = [
  import.meta.env.VITE_DUMMY_CARD_1,
  import.meta.env.VITE_DUMMY_CARD_2,
  import.meta.env.VITE_DUMMY_CARD_3,
].filter(Boolean);

export const validateDummyCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  return dummyCards.includes(cleaned);
};

export const getLastFour = (cardNumber) => {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  return cleaned.slice(-4);
};

export const formatCardDisplay = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ').substring(0, 19);
};

export const getDummyCards = () => dummyCards;
