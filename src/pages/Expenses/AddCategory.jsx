import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import './AddCategory.css';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/categoryList');
      const list = response.data || [];
      setCategories(list); // [{ id, name }]
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setSuccessMsg('');
    try {
      await axios.post('http://localhost:8080/categoryPost', { name: categoryName });
      setCategoryName('');
      setSuccessMsg('Category added successfully!');
      fetchCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to add category. Maybe it already exists?');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await axios.delete(`http://localhost:8080/categoryDelete/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
      console.error(err);
    }
  };

  return (
    <div className="add-category-container">
      <h2><FaPlus style={{ marginRight: '8px' }} />Add New Expense Category</h2>
      <form onSubmit={handleSubmitCategory}>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category name"
          required
        />
        <button type="submit">Add</button>
      </form>

      {successMsg && <p className="success-message">{successMsg}</p>}
      {loading && <p className="loading">Loading categories...</p>}
      {error && <p className="error">{error}</p>}

      <h3>Existing Categories</h3>
      {categories.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No categories yet.</p>
      ) : (
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.name}
              <FaTrashAlt
                className="delete-icon"
                title="Delete category"
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddCategory;
