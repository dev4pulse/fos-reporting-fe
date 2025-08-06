import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewDocuments.css';

const ViewDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get('https://pulse-766719709317.asia-south1.run.app/api/documents');
        setDocuments(res.data || []);
      } catch (err) {
        console.error('Failed to fetch documents:', err);
        setError('Failed to load documents.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDownload = async (fileUrl, docType) => {
    const blobName = fileUrl.split('/').pop(); // Extract the actual GCS blob key

    try {
      const response = await axios.get(
        `https://pulse-766719709317.asia-south1.run.app/api/documents/${blobName}`
      );
      const signedUrl = response.data;

      const link = document.createElement('a');
      link.href = signedUrl;
      link.setAttribute('download', `${docType || 'document'}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  return (
    <div className="view-documents-container">
      <h2>All Documents</h2>

      {loading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : (
        <table className="documents-table">
          <thead>
            <tr>
              <th>Document Type</th>
              <th>Issuing Authority</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Document Link</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <tr key={index}>
                  <td>{doc.documentType}</td>
                  <td>{doc.issuingAuthority || '-'}</td>
                  <td>{doc.issueDate || '-'}</td>
                  <td>{doc.expiryDate || '-'}</td>
                  <td>
                    <button
                      className="view-document-link"
                      onClick={() => handleDownload(doc.fileUrl, doc.documentType)}
                    >
                      View Document
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No documents available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="upload-button-container">
        <button
          className="upload-doc-button"
          onClick={() => (window.location.href = '/dashboard/documents/upload')}
        >
          Upload New Document
        </button>
      </div>
    </div>
  );
};

export default ViewDocuments;
