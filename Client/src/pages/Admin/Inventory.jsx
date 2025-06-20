import React from "react";
import OverallInventory from "../../components/AdminComponents/InventoryComponents/OverallInventory";
import ProductsList from "../../components/AdminComponents/InventoryComponents/ProductsList";
import { getProducts } from "../../services/productServices";
import { useState, useEffect } from "react";
import { getExpiryStatusCounts, lowStockCount, outOfStockProducts, totalCategories, totalStock } from "../../services/inventoryServices";

export default function Inventory() {
  const [fetchedProducts, setFetchedProducts] = useState([])
  const fetchProducts = async () => {
    try {
      const dbProducts = await getProducts();

      setFetchedProducts(dbProducts?.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // console.log(fetchedProducts)

  const categoryCount = totalCategories(fetchedProducts)

  const stockCount = totalStock(fetchedProducts)

  const lowStockProducts = lowStockCount(fetchedProducts)

  const outOfStockCount = outOfStockProducts(fetchedProducts)

  const { expiredCount, expiringSoonCount } = getExpiryStatusCounts(fetchedProducts);

  
  return (
    <>
      <div className="p-3">
        <OverallInventory 
        totalCategories={categoryCount} 
        totalStock={stockCount} 
        lowStockCount={lowStockProducts}
        outOfStockProducts={outOfStockCount}
        expiringSoonCount={expiringSoonCount}
        expiredCount={expiredCount}
        />
      </div>
      <div className="p-3">
        <ProductsList fetchProducts={fetchProducts} fetchedProducts={fetchedProducts} />
      </div>
    </>
  );
}
