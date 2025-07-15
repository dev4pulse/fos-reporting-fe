import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import './SalesCollections.css';

const SalesCollections = () => {
  const [entryDate, setEntryDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeFetchError, setEmployeeFetchError] = useState('');
  const [products, setProducts] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [cashReceived, setCashReceived] = useState('');
  const [phonePay, setPhonePay] = useState('');
  const [creditCard, setCreditCard] = useState('');

  useEffect(() => {
    fetch('https://pulse-293050141084.asia-south1.run.app/active')
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(setEmployees)
      .catch(err => {
        setEmployeeFetchError('Failed to load employees.');
        console.error(err);
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
      fetch(`https://pulse-293050141084.asia-south1.run.app/inventory/price?productName=${value}`)
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
        .then(price => {
          updated[index].price = price;
          calculateSales(updated[index]);
          setProducts(updated);
        })
        .catch(err => {
          alert(`Failed to fetch price for ${value}`);
          console.error(err);
        });
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

  const handleAddBorrower = () => {
    setBorrowers(prev => [...prev, { name: '', amount: '' }]);
  };

  const handleRemoveBorrower = index => {
    setBorrowers(prev => prev.filter((_, i) => i !== index));
  };

  const handleBorrowerChange = (index, field, value) => {
    const updated = [...borrowers];
    updated[index][field] = value;
    setBorrowers(updated);
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
      shortCollections: parseFloat(shortCollections),
      borrowers: borrowers.map(b => ({
        ...b,
        amount: parseFloat(b.amount) || 0,
      }))
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
    <div className="container">
      <h2 className="text-center">Sales & Collections</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Entry Date & Time</label>
            <Flatpickr
              className="form-control"
              value={entryDate}
              options={{ enableTime: true, dateFormat: "d-m-Y H:i" }}
              onChange={([date]) => setEntryDate(date)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeId} - {emp.employeeFirstName} {emp.employeeLastName}
                </option>
              ))}
            </select>
            {employeeFetchError && <small className="text-danger">{employeeFetchError}</small>}
          </div>
        </div>

        <h4>Sales</h4>
        {products.map((p, i) => (
          <div className="row mb-2" key={i}>
            {['productName', 'gun', 'opening', 'closing', 'price', 'testing', 'salesLiters', 'salesRupees'].map((field, j) => (
              <div className="col-md-3" key={j}>
                <label className="form-label">{field.replace(/([A-Z])/g, ' $1')}</label>
                {['productName', 'gun'].includes(field) ? (
                  <select
                    className="form-select"
                    value={p[field]}
                    onChange={e => handleProductChange(i, field, e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {field === 'productName' && ['Petrol', 'Diesel'].map(opt => <option key={opt}>{opt}</option>)}
                    {field === 'gun' && ['G1', 'G2', 'G3'].map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type="number"
                    className={`form-control ${
                      field === 'closing' && parseFloat(p.closing) < parseFloat(p.opening)
                        ? 'input-error'
                        : ''
                    }`}
                    value={p[field]}
                    onChange={e => handleProductChange(i, field, e.target.value)}
                    readOnly={['salesLiters', 'salesRupees', 'price', 'opening'].includes(field)}
                  />
                )}
              </div>
            ))}
            <div className="col-md-3 d-flex align-items-end">
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveProduct(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-primary mb-3" onClick={handleAddProduct}>Add Product</button>

        <h4>Collections</h4>
        <div className="row">
          {[{ label: 'Cash Received', value: cashReceived, setter: setCashReceived },
            { label: 'Phone Pay', value: phonePay, setter: setPhonePay },
            { label: 'Credit Card', value: creditCard, setter: setCreditCard },
            { label: 'Total Collection', value: totalCollection.toFixed(2), readOnly: true },
            { label: 'Short Collections', value: shortCollections, readOnly: true }
          ].map(({ label, value, setter, readOnly }, i) => (
            <div className="col-md-6 mb-2" key={i}>
              <label className="form-label">{label}</label>
              <input
                type="number"
                className="form-control"
                value={value}
                readOnly={readOnly}
                onChange={e => setter?.(e.target.value)}
              />
            </div>
          ))}
        </div>

        <h4>Borrowers</h4>
        {borrowers.map((b, i) => (
          <div className="row mb-2" key={i}>
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={b.name} onChange={e => handleBorrowerChange(i, 'name', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Amount</label>
              <input type="number" className="form-control" value={b.amount} onChange={e => handleBorrowerChange(i, 'amount', e.target.value)} />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveBorrower(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={handleAddBorrower}>Add Borrower</button>

        <button type="submit" className="btn btn-success w-100">Submit All</button>
      </form>
    </div>
  );
};

export default SalesCollections;
