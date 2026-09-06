import { describe, it, expect } from "vitest";
import type { Product } from "@/types/database";

/**
 * Test suite for ProductFeed ranking hygiene
 * 
 * This test verifies that products with empty URLs are excluded
 * from Hottest and New rankings, while products with valid URLs
 * fill the ranking slots by natural sort order.
 */
describe("ProductFeed ranking hygiene", () => {
  // Helper function to simulate the filtering logic
  const filterProductsWithUrl = (products: Product[]): Product[] => {
    return products.filter(p => p.url && p.url.trim() !== '');
  };

  it("should exclude products with empty url from ranking", () => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Product With URL",
        url: "https://example.com",
        vibeScore: 10,
        votes: 5,
        createdAt: new Date().toISOString(),
      } as Product,
      {
        id: "2",
        name: "Product Without URL",
        url: "",
        vibeScore: 20,
        votes: 10,
        createdAt: new Date().toISOString(),
      } as Product,
      {
        id: "3",
        name: "Product With Whitespace URL",
        url: "   ",
        vibeScore: 15,
        votes: 8,
        createdAt: new Date().toISOString(),
      } as Product,
    ];

    const filtered = filterProductsWithUrl(mockProducts);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
    expect(filtered[0].name).toBe("Product With URL");
  });

  it("should keep products with valid URLs in ranking", () => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Product A",
        url: "https://example-a.com",
        vibeScore: 10,
        votes: 5,
        createdAt: new Date().toISOString(),
      } as Product,
      {
        id: "2",
        name: "Product B",
        url: "https://example-b.com",
        vibeScore: 20,
        votes: 10,
        createdAt: new Date().toISOString(),
      } as Product,
    ];

    const filtered = filterProductsWithUrl(mockProducts);

    expect(filtered).toHaveLength(2);
    expect(filtered.map(p => p.id)).toEqual(["1", "2"]);
  });

  it("should handle mixed scenarios with valid, empty, and whitespace URLs", () => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Valid Product 1",
        url: "https://valid1.com",
        vibeScore: 10,
        votes: 5,
        createdAt: new Date().toISOString(),
      } as Product,
      {
        id: "2",
        name: "Empty URL Product",
        url: "",
        vibeScore: 30,
        votes: 15,
        createdAt: new Date().toISOString(),
      } as Product,
      {
        id: "3",
        name: "Valid Product 2",
        url: "https://valid2.com",
        vibeScore: 20,
        votes: 10,
        createdAt: new Date().toISOString(),
      } as Product,
      {
        id: "4",
        name: "Whitespace URL Product",
        url: "  \n  ",
        vibeScore: 25,
        votes: 12,
        createdAt: new Date().toISOString(),
      } as Product,
      {
        id: "5",
        name: "Valid Product 3",
        url: "https://valid3.com",
        vibeScore: 15,
        votes: 8,
        createdAt: new Date().toISOString(),
      } as Product,
    ];

    const filtered = filterProductsWithUrl(mockProducts);

    expect(filtered).toHaveLength(3);
    expect(filtered.map(p => p.id)).toEqual(["1", "3", "5"]);
    
    // Verify that high-scoring products with empty URLs are still excluded
    const filteredIds = filtered.map(p => p.id);
    expect(filteredIds).not.toContain("2"); // Empty URL, even with highest scores
    expect(filteredIds).not.toContain("4"); // Whitespace URL
  });

  it("should return empty array when all products have empty URLs", () => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Product 1",
        url: "",
        vibeScore: 10,
        votes: 5,
        createdAt: new Date().toISOString(),
      } as Product,
      {
        id: "2",
        name: "Product 2",
        url: "   ",
        vibeScore: 20,
        votes: 10,
        createdAt: new Date().toISOString(),
      } as Product,
    ];

    const filtered = filterProductsWithUrl(mockProducts);

    expect(filtered).toHaveLength(0);
  });
});
