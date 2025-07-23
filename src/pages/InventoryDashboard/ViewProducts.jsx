import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewProducts.css";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:8080/products/${productId}`);
      setProducts((prev) => prev.filter((p) => (p.productId ?? p.id) !== productId));
      alert("Product deleted successfully.");
    } catch (err) {
      if (err.response?.status === 409) {
        alert(
          "Cannot delete this product because it is referenced in other records (e.g., sales, inventory, or collections)."
        );
      } else {
        alert("Delete failed: " + (err.response?.data || err.message));
      }
    }
  };

  // Open update form
  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setNewStatus(product.status);
  };

  // Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = { ...selectedProduct, status: newStatus };
      const productId = selectedProduct.productId ?? selectedProduct.id;
      await axios.put(`http://localhost:8080/products/${productId}`, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.productId ?? p.id) === productId ? updatedProduct : p)
      );
      setSelectedProduct(null);
      alert("Product updated successfully.");
    } catch (err) {
      alert("Update failed: " + (err.response?.data || err.message));
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="view-products-container">
      <h2 className="view-products-heading">View Products</h2>
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Tank Capacity (L)</th>
              <th>Price (₹)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const productId = product.productId ?? product.id; // ensure correct key
              return (
                <tr key={productId}>
                  <td>{index + 1}</td>
                  <td>{product.productName}</td>
                  <td>{product.description}</td>
                  <td>{product.tankCapacity}</td>
                  <td>{product.price}</td>
                  <td>{product.status}</td>
                  <td>
                    <button
                      className="btn btn-update"
                      onClick={() => handleUpdateClick(product)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(productId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <div className="update-form-overlay">
          <div className="update-form">
            <h3>Update Product Status</h3>
            <form onSubmit={handleUpdateSubmit}>
              <label>Product Name</label>
              <input type="text" value={selectedProduct.productName} disabled />

              <label>Description</label>
              <input type="text" value={selectedProduct.description} disabled />

              <label>Tank Capacity (L)</label>
              <input type="number" value={selectedProduct.tankCapacity} disabled />

              <label>Price (₹)</label>
              <input type="number" value={selectedProduct.price} disabled />

              <label>Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <div className="update-buttons">
                <button type="submit" className="btn btn-save">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setSelectedProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
