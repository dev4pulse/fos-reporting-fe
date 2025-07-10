import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SalesCollections = () => {
  const [entryDate, setEntryDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);

  const [products, setProducts] = useState([]);
  const [borrowers, setBorrowers] = useState([]);

  const [cashReceived, setCashReceived] = useState(0);
  const [phonePay, setPhonePay] = useState(0);
  const [creditCard, setCreditCard] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8081/active')
      .then(res => res.json())
      .then(setEmployees)
      .catch(() => alert('Failed to load employees'));
  }, []);

  const handleAddProduct = () => {
    setProducts(prev => [...prev, {
      productName: '',
      gun: '',
      opening: 0,
      closing: 0,
      price: 0,
      testing: 0,
      salesLiters: 0,
      salesRupees: 0
    }]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;

    if (['productName', 'gun'].includes(field)) {
      const { productName, gun } = updated[index];
      if (productName && gun) {
        fetch(`http://localhost:8080/sales/last?productName=${encodeURIComponent(productName)}&gun=${encodeURIComponent(gun)}`)
          .then(r => r.json())
          .then(data => {
            updated[index].opening = data.lastClosing || 0;
            return fetch(`http://localhost:8080/sales/price?productName=${encodeURIComponent(productName)}&gun=${encodeURIComponent(gun)}`);
          })
          .then(r => r.json())
          .then(price => {
            updated[index].price = price || 0;
            calculateSales(updated[index]);
            setProducts([...updated]);
          })
          .catch(console.error);
      }
    } else {
      calculateSales(updated[index]);
      setProducts([...updated]);
    }
  };

  const calculateSales = (row) => {
    const liters = Math.max((row.closing - row.opening - row.testing), 0);
    row.salesLiters = liters;
    row.salesRupees = parseFloat((liters * row.price).toFixed(2));
  };

  const handleAddBorrower = () => {
    setBorrowers(prev => [...prev, { name: '', amount: 0 }]);
  };

  const handleRemoveBorrower = (index) => {
    setBorrowers(prev => prev.filter((_, i) => i !== index));
  };

  const handleBorrowerChange = (index, field, value) => {
    const updated = [...borrowers];
    updated[index][field] = value;
    setBorrowers(updated);
  };

  const totalSales = products.reduce((sum, p) => sum + (parseFloat(p.salesRupees) || 0), 0);
  const totalCollection = parseFloat(cashReceived) + parseFloat(phonePay) + parseFloat(creditCard);
  const shortCollections = (totalCollection - totalSales).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId) return alert('Please select employee');
    const payloadSales = {
      date: entryDate,
      employeeId: parseInt(employeeId),
      products
    };
    const payloadCollections = {
      date: entryDate,
      employeeId: parseInt(employeeId),
      cashReceived: parseFloat(cashReceived || 0),
      phonePay: parseFloat(phonePay || 0),
      creditCard: parseFloat(creditCard || 0),
      shortCollections: parseFloat(shortCollections),
      borrowers
    };

    Promise.all([
      fetch('http://localhost:8080/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadSales)
      }),
      fetch('http://localhost:8080/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadCollections)
      })
    ])
      .then(responses => Promise.all(responses.map(r => r.text())))
      .then(([salesMsg, collectionsMsg]) => {
        alert(`✅ Sales: ${salesMsg}\n✅ Collections: ${collectionsMsg}`);
        window.location.reload();
      })
      .catch(err => alert('Error: ' + err.message));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Sales & Collections Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="entryDate" className="form-label">Entry Date & Time</label>
            <Flatpickr
              id="entryDate"
              className="form-control"
              value={entryDate}
              options={{ enableTime: true, dateFormat: "Y-m-d H:i:S" }}
              onChange={([date]) => setEntryDate(date)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="employeeDropdown" className="form-label">Employee</label>
            <select
              id="employeeDropdown"
              className="form-select"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeId} - {emp.employeeFirstName} {emp.employeeLastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h4 className="mt-4">Sales Entry</h4>
        {products.map((p, i) => (
          <div key={i} className="row g-3 border rounded p-3 mb-3">
            {['Product Name', 'Gun', 'Opening', 'Closing', 'Price', 'Testing', 'Sales Liters', 'Sales Rupees'].map((label, j) => {
              const fieldMap = ['productName', 'gun', 'opening', 'closing', 'price', 'testing', 'salesLiters', 'salesRupees'];
              const field = fieldMap[j];
              const isReadOnly = field === 'salesLiters' || field === 'salesRupees';
              const value = p[field];

              return (
                <div key={j} className="col-md-3">
                  <label className="form-label">{label}</label>
                  {['productName', 'gun'].includes(field) ? (
                    <select className="form-select" value={value} onChange={e => handleProductChange(i, field, e.target.value)}>
                      <option value="">Select</option>
                      {field === 'productName' && ['Petrol', 'Diesel', 'Other'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                      {field === 'gun' && ['G1', 'G2', 'G3'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      className="form-control"
                      value={value}
                      readOnly={isReadOnly}
                      onChange={e => handleProductChange(i, field, +e.target.value)}
                    />
                  )}
                </div>
              );
            })}
            <div className="col-md-3 d-flex align-items-end">
              <button type="button" className="btn btn-outline-danger w-100" onClick={() => handleRemoveProduct(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-primary mb-3" onClick={handleAddProduct}>Add Product</button>

        <h4 className="mt-4">Collections</h4>
        <div className="row mb-3">
          {[
            { label: 'Cash Received', value: cashReceived, setter: setCashReceived },
            { label: 'Phone Pay', value: phonePay, setter: setPhonePay },
            { label: 'Credit Card', value: creditCard, setter: setCreditCard },
            { label: 'Short Collections', value: shortCollections, readOnly: true },
            { label: 'Total Collection', value: totalCollection.toFixed(2), readOnly: true },
          ].map(({ label, value, setter, readOnly }, i) => (
            <div key={i} className="col-md-3">
              <label className="form-label">{label}</label>
              <input
                type="number"
                className="form-control"
                value={value}
                onChange={e => setter?.(e.target.value)}
                readOnly={readOnly}
              />
            </div>
          ))}
        </div>

        <h4 className="mt-4">Borrowers</h4>
        {borrowers.map((b, i) => (
          <div key={i} className="row g-3 border p-3 mb-2">
            <div className="col-md-6">
              <label className="form-label">Borrower Name</label>
              <input type="text" className="form-control" value={b.name} onChange={e => handleBorrowerChange(i, 'name', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Amount</label>
              <input type="number" className="form-control" value={b.amount} onChange={e => handleBorrowerChange(i, 'amount', +e.target.value)} />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="button" className="btn btn-outline-danger w-100" onClick={() => handleRemoveBorrower(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-4" onClick={handleAddBorrower}>Add Borrower</button>

        <button type="submit" className="btn btn-success w-100">Submit All</button>
      </form>
    </div>
  );
};

export default SalesCollections;
