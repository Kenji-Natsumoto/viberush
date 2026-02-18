// Product categories for the Explore / Backstage Directory page
export const PRODUCT_CATEGORIES = [
  "AI & Automation",
  "Productivity & Focus",
  "Family & Kids",
  "Creative & Design",
  "Career & Education",
  "Other",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
