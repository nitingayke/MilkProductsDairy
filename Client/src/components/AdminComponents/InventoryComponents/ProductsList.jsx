import FilterListIcon from '@mui/icons-material/FilterList';
import { useState } from 'react';
// import { getProducts } from '../../../services/productServices';
import { useEffect } from 'react';
import UpdateProductModel from './Models/UpdateProductModal';
import AddProductModal from './Models/AddProductModal';
import RemoveModel from './Models/RemoveModel';

export default function ProductsList({ fetchProducts, fetchedProducts }) {
  const [addModel, setAddModel] = useState(false)
  const [updateModel, setUpdateModel] = useState(false)
  const [removeModel, setRemoveModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  useEffect(() => {
    if (!addModel || !removeModel || !updateModel) fetchProducts();

  },);


  return (
    <div className="bg-white dark:bg-gray-500/20 rounded-xl p-6  shadow-md w-full overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Products</h2>
        <div className="flex gap-2">
          <button onClick={() => {
            setAddModel(true)
          }} className="bg-blue-500 dark:bg-orange-600/30 dark:hover:bg-orange-600/40 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Add Product
          </button>
          <div className="bg-gray-200 flex justify-between text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
            <span><FilterListIcon /></span>
            <button >
              Filter
            </button>
          </div>
        </div>
      </div>

      {fetchedProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-300">
          <p className="text-lg font-medium">No products found.</p>
          <p className="text-sm mt-2">Add a new product to get started.</p>
        </div>
      ) : (<table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-600 dark:text-gray-300">
            <th className="pb-3 px-3">Products</th>
            <th className="pb-3 px-3">Selling Price</th>
            <th className="pb-3 px-3">Quantity</th>
            <th className="pb-3 px-3">Threshold Value</th>
            <th className="pb-3 px-3">Category</th>

          </tr>
        </thead>
        <tbody>

          {fetchedProducts.map((product, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 "
            >
              <td className="py-2 px-3 font-medium text-gray-700 dark:text-white">
                {product.name}
              </td>
              <td className="py-2 md:px-7 ">₹ {product.price}</td>
              <td className="py-2 px-3">{product.stock} {" "} {product.quantityUnit}</td>
              <td className="py-2 px-3">{product.thresholdVal}{" "} {product.quantityUnit}</td>
              <td className="py-2 px-3">{product.category}</td>
              <td className="py-2">
                <div className='flex gap-x-2.5'>
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setUpdateModel(true)
                    }}
                    className="text-sm bg-green-200 text-black dark:bg-blue-800/40 dark:hover:bg-blue-800/50 dark:text-white  px-3 py-1 rounded-md hover:bg-green-300/80">
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setRemoveModel(true)
                    }}
                    className="text-sm bg-red-200 text-black dark:bg-blue-800/40 dark:hover:bg-blue-800/50 dark:text-white  px-3 py-1 rounded-md hover:bg-red-300/80">
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>)}



      <div className="flex justify-between items-center px-3 mt-6">
        <button className="border p-2 rounded-xl">Previous</button>
        <h3>Page 1 of 12</h3>
        <button className='border p-2 rounded-xl'>Next</button>
      </div>

      {addModel && (
        <AddProductModal setAddModel={setAddModel} />
      )}

      {updateModel && (
        <UpdateProductModel setUpdateModel={setUpdateModel} selectedProduct={selectedProduct} />
      )}

      {removeModel && (
        <RemoveModel setRemoveModel={setRemoveModel} selectedProduct={selectedProduct} />
      )}
    </div>
  );
}
