import React, { useState, useEffect } from 'react';
import axios from 'axios'; // npm install axios
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import './AddCategory.css'; // Optional styling

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on load (using /expensesList, assuming it returns expense categories)
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/expensesList');
      // Extract unique categories from expenses
      const uniqueCategories = [...new Set(response.data.map(e => e.category))].filter(Boolean);
      setCategories(uniqueCategories);
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
    try {
      await axios.post('http://localhost:8080/categoryPost', { name: categoryName });
      setCategoryName('');
      fetchCategories(); // Refresh the category list after adding
    } catch (err) {
      alert('Failed to add category. Maybe it already exists?');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!window.confirm(`Delete category "${categoryName}"?`)) return;
    try {
      // If your backend expects DELETE /categoryPost, you can pass name as param or body.
      // This depends on your backend API design!
      await axios.delete('http://localhost:8080/categoryPost', { data: { name: categoryName } });
      fetchCategories(); // Refresh after delete
    } catch (err) {
      alert('Failed to delete category');
      console.error(err);
    }
  };

  return (
    <div className="add-category-container">
      <h2><FaPlus style={{marginRight: '8px'}} />Add New Expense Category</h2>
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

      {loading && <p className="loading">Loading categories...</p>}
      {error && <p className="error">{error}</p>}

      <h3>Existing Categories</h3>
      {categories.length === 0 ? (
        <p style={{color: '#666', fontStyle: 'italic'}}>No categories yet.</p>
      ) : (
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat}>
              {cat}
              <FaTrashAlt
                className="delete-icon"
                title="Delete category"
                onClick={() => handleDeleteCategory(cat)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddCategory;
