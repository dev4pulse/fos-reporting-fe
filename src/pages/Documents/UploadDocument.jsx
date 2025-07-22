import React, { useState } from 'react';
import axios from 'axios';
import './UploadDocument.css';

const UploadDocument = () => {
  const [formData, setFormData] = useState({
    documentType: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    renewalPeriodDays: '',
    responsibleParty: '',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) {
        data.append('file', file);
      }

      await axios.post('https://pulse-293050141084.asia-south1.run.app/api/documents', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Document uploaded successfully.');
      setFormData({
        documentType: '',
        issuingAuthority: '',
        issueDate: '',
        expiryDate: '',
        renewalPeriodDays: '',
        responsibleParty: '',
        notes: ''
      });
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload document.');
    }
  };

  return (
    <div className="upload-doc-container">
      <h2>Upload Document</h2>
      <form className="upload-doc-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Document Name/Type</label>
            <input
              type="text"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
              placeholder="e.g., Pollution Under Control Certificate"
            />
          </div>
          <div className="form-group">
            <label>Issuing Authority</label>
            <input
              type="text"
              name="issuingAuthority"
              value={formData.issuingAuthority}
              onChange={handleChange}
              placeholder="e.g., Regional Transport Office"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Renewal Period (Days)</label>
            <input
              type="number"
              name="renewalPeriodDays"
              value={formData.renewalPeriodDays}
              onChange={handleChange}
              placeholder="e.g., 720"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Responsible Party</label>
            <input
              type="text"
              name="responsibleParty"
              value={formData.responsibleParty}
              onChange={handleChange}
              placeholder="e.g., Mr. Sharma"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-full">
            <label>Scanned Copy/Digital File</label>
            <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-full">
            <label>Notes/Comments</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Remember to renew online via Parivahan portal."
              rows="3"
            />
          </div>
        </div>

        <div className="submit-row">
          <button type="submit" className="submit-btn">Save Document</button>
        </div>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default UploadDocument;
