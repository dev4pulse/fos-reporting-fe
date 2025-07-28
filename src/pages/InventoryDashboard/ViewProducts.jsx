import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewProducts.css";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://pulse-293050141084.asia-south1.run.app/products");
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

  // Show messages temporarily
  const showMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(""), 3000);
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`https://pulse-293050141084.asia-south1.run.app/products/${productId}`);
      setProducts((prev) => prev.filter((p) => (p.productId ?? p.id) !== productId));
      showMessage(setSuccess, "Product deleted successfully.");
    } catch (err) {
      if (err.response?.status === 409) {
        if (
          window.confirm(
            "This product is linked to inventory or sales. Would you like to deactivate it instead?"
          )
        ) {
          await deactivateProduct(productId);
        }
      } else {
        showMessage(setError, "Delete failed: " + (err.response?.data || err.message));
      }
    }
  };

  // Deactivate product (soft delete)
  const deactivateProduct = async (productId) => {
    try {
      const product = products.find((p) => (p.productId ?? p.id) === productId);
      if (!product) return;

      const updatedProduct = { ...product, status: "INACTIVE" };
      await axios.put(`https://pulse-293050141084.asia-south1.run.app/products/${productId}`, updatedProduct);

      setProducts((prev) =>
        prev.map((p) => (p.productId ?? p.id) === productId ? updatedProduct : p)
      );
      showMessage(setSuccess, "Product has been deactivated.");
    } catch (err) {
      showMessage(setError, "Failed to deactivate product: " + (err.response?.data || err.message));
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
      await axios.put(`https://pulse-293050141084.asia-south1.run.app/products/${productId}`, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.productId ?? p.id) === productId ? updatedProduct : p)
      );
      setSelectedProduct(null);
      showMessage(setSuccess, "Product updated successfully.");
    } catch (err) {
      showMessage(setError, "Update failed: " + (err.response?.data || err.message));
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;
  if (error && !success) return <p className="error-text">{error}</p>;

  return (
    <div className="view-products-container">
      <h2 className="view-products-heading">View Products</h2>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

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
              const productId = product.productId ?? product.id;
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
