import { useState } from "react";
/*
*/
import axios from 'axios';

function GiveList(text) {
  const responseList = text.split("|")
  return responseList
}

function FileUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        
          
        },
      });
      
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error uploading file");
      setLoading(false);
    }
  };

  return (

    
    <div className="file-upload-container">
      <div className="logo-container" style={{ textAlign: 'center', padding: '20px' }}>
        <img 
          src="/logo.png" 
          alt="Un-Unemployed Logo" 
          style={{ maxWidth: '200px', height: 'auto' }}

        />
      </div>
      <h2 className="center">Un-Unemployed</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload PDF'}
        </button>
      </form>

      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="results">
          <h3>Results:</h3>
          <p><strong>Message:</strong>
          <ul>
            {GiveList(result.message).map((item, index) => (
              <li key={index}><form class="my-form">
              <div>
                <input id="check-1" type="checkbox" />
                <label for="check-1" aria-setsize={10}>{item}</label>
              </div>
            </form></li>
            ))}
          </ul>
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;