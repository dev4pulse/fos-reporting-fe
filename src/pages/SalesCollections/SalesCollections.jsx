import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SalesCollections.css';

const SalesCollections = () => {
  const [entryDate, setEntryDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeFetchError, setEmployeeFetchError] = useState('');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Only ACTIVE products
  const [cashReceived, setCashReceived] = useState('');
  const [phonePay, setPhonePay] = useState('');
  const [creditCard, setCreditCard] = useState('');

  // Fetch employees
  useEffect(() => {
    fetch('https://pulse-293050141084.asia-south1.run.app/active')
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(setEmployees)
      .catch(err => {
        setEmployeeFetchError('Failed to load employees.');
        console.error(err);
      });
  }, []);

  // Fetch only active products
  useEffect(() => {
    fetch('https://pulse-293050141084.asia-south1.run.app/products')
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => {
        const activeProducts = data.filter(
          p => p.status && p.status.toUpperCase() === 'ACTIVE'
        );
        setAllProducts(activeProducts);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        alert('Unable to load products');
      });
  }, []);

  const handleAddProduct = () => {
    setProducts(prev => [...prev, {
      productName: '', gun: '', opening: '', closing: '', price: '', testing: '',
      salesLiters: 0, salesRupees: 0
    }]);
  };

  const handleRemoveProduct = index => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const calculateSales = row => {
    const opening = parseFloat(row.opening) || 0;
    const closing = parseFloat(row.closing) || 0;
    const testing = parseFloat(row.testing) || 0;
    const price = parseFloat(row.price) || 0;
    const liters = Math.max(closing - opening - testing, 0);
    row.salesLiters = liters;
    row.salesRupees = parseFloat((liters * price).toFixed(2));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;

    const { productName, gun } = updated[index];

    if (field === 'productName') {
      const selectedProduct = allProducts.find(p => p.productName === value);
      if (selectedProduct) {
        updated[index].price = selectedProduct.price; // set price automatically
      }
      calculateSales(updated[index]);
      setProducts(updated);
    }

    if ((field === 'productName' || field === 'gun') && productName && gun) {
      fetch(`https://pulse-293050141084.asia-south1.run.app/sales/last?productName=${productName}&gun=${gun}`)
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
        .then(data => {
          updated[index].opening = data.lastClosing || 0;
          calculateSales(updated[index]);
          setProducts(updated);
        })
        .catch(err => {
          alert(`Error fetching last closing for ${productName} - ${gun}`);
          console.error(err);
        });
    } else {
      calculateSales(updated[index]);
      setProducts(updated);
    }
  };

  const totalSales = products.reduce((sum, p) => sum + (parseFloat(p.salesRupees) || 0), 0);
  const totalCollection = (parseFloat(cashReceived) || 0) + (parseFloat(phonePay) || 0) + (parseFloat(creditCard) || 0);
  const shortCollections = (totalCollection - totalSales).toFixed(2);

  const formatDate = (date) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) return alert("Select employee");

    const hasInvalidClosing = products.some(
      (p) => parseFloat(p.closing) < parseFloat(p.opening)
    );
    if (hasInvalidClosing) {
      alert('One or more products have Closing less than Opening. Please correct them.');
      return;
    }

    if (parseFloat(shortCollections) < -10) {
      alert('Short Collections cannot be less than -10');
      return;
    }

    const payloadSales = {
      date: formatDate(entryDate),
      employeeId: parseInt(employeeId),
      products: products.map(p => ({
        ...p,
        opening: parseFloat(p.opening) || 0,
        closing: parseFloat(p.closing) || 0,
        price: parseFloat(p.price) || 0,
        testing: parseFloat(p.testing) || 0,
        salesLiters: parseFloat(p.salesLiters) || 0,
        salesRupees: parseFloat(p.salesRupees) || 0,
      }))
    };

    const payloadCollections = {
      date: formatDate(entryDate),
      employeeId: parseInt(employeeId),
      cashReceived: parseFloat(cashReceived) || 0,
      phonePay: parseFloat(phonePay) || 0,
      creditCard: parseFloat(creditCard) || 0,
      shortCollections: parseFloat(shortCollections)
    };

    try {
      const [res1, res2] = await Promise.all([
        fetch('https://pulse-293050141084.asia-south1.run.app/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadSales)
        }),
        fetch('https://pulse-293050141084.asia-south1.run.app/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadCollections)
        })
      ]);

      const msg1 = await res1.text();
      const msg2 = await res2.text();

      if (!res1.ok || !res2.ok) throw new Error(`${msg1}\n${msg2}`);

      alert(`Submitted!\nSales: ${msg1}\nCollections: ${msg2}`);
      window.location.reload();
    } catch (err) {
      alert('Error submitting form');
      console.error(err);
    }
  };

  return (
    <div className="sales-collections-container">
      <h2 className="section-title">Sales & Collections</h2>
      <form onSubmit={handleSubmit}>
        <div className="sales-form">
          <div className="form-group">
            <label>Entry Date & Time</label>
            <DatePicker
              selected={entryDate}
              onChange={setEntryDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd-MM-yyyy HH:mm"
              placeholderText="Select date and time"
              className="datetime-input"
            />
          </div>

          <div className="form-group">
            <label>Employee</label>
            <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} required>
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeId} - {emp.employeeFirstName} {emp.employeeLastName}
                </option>
              ))}
            </select>
            {employeeFetchError && <small>{employeeFetchError}</small>}
          </div>
        </div>

        <h4 className="section-title">Sales</h4>
        {products.map((p, i) => (
          <div className="sales-form" key={i}>
            {['productName', 'gun', 'opening', 'closing', 'price', 'testing', 'salesLiters', 'salesRupees'].map((field, j) => (
              <div className="form-group" key={j}>
                <label>{field.replace(/([A-Z])/g, ' $1')}</label>
                {field === 'productName' ? (
                  <select
                    value={p[field]}
                    onChange={e => handleProductChange(i, field, e.target.value)}
                    required
                  >
                    <option value="">Select Product</option>
                    {allProducts.map(prod => (
                      <option key={prod.productId} value={prod.productName}>
                        {prod.productName}
                      </option>
                    ))}
                  </select>
                ) : field === 'gun' ? (
                  <select
                    value={p[field]}
                    onChange={e => handleProductChange(i, field, e.target.value)}
                    required
                  >
                    <option value="">Select Gun</option>
                    {['G1', 'G2', 'G3'].map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={p[field]}
                    onChange={e => handleProductChange(i, field, e.target.value)}
                    readOnly={['salesLiters', 'salesRupees', 'price', 'opening'].includes(field)}
                    className={field === 'closing' && parseFloat(p.closing) < parseFloat(p.opening) ? 'input-error' : ''}
                  />
                )}
              </div>
            ))}
            <button type="button" className="clear-btn" onClick={() => handleRemoveProduct(i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="submit-btn" onClick={handleAddProduct}>Add Product</button>

        <h4 className="section-title">Collections</h4>
        <div className="sales-form">
          {[
            { label: 'Cash Received', value: cashReceived, setter: setCashReceived },
            { label: 'Phone Pay', value: phonePay, setter: setPhonePay },
            { label: 'Credit Card', value: creditCard, setter: setCreditCard },
            { label: 'Total Collection', value: totalCollection.toFixed(2), readOnly: true },
            { label: 'Short Collections', value: shortCollections, readOnly: true }
          ].map(({ label, value, setter, readOnly }, i) => (
            <div className="form-group" key={i}>
              <label>{label}</label>
              <input
                type="number"
                value={value}
                readOnly={readOnly}
                onChange={e => setter?.(e.target.value)}
                className={label === 'Short Collections' && parseFloat(shortCollections) < -10 ? 'short-collection-error' : ''}
              />
              {label === 'Short Collections' && parseFloat(shortCollections) < -10 && (
                <small>Short collections cannot be less than -10</small>
              )}
            </div>
          ))}
        </div>

        <div className="sales-actions">
          <button type="submit" className="submit-btn">Submit All</button>
        </div>
      </form>
    </div>
  );
};

export default SalesCollections;
