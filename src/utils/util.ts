export const convertPriceToCentsInteger = (price: string) => {
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    throw new Error("Price must be a number.");
  }
  return Math.round(parsedPrice * 100);
};
