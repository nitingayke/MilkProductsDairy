export const slugify = (text) => {
  return text.toLowerCase().trim().replace(/\s+/g, "-");
};
