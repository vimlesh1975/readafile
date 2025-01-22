'use client';

import { useState, useEffect } from 'react';

export default function DisplayFilePage() {
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the data from the API
    const fetchFileContent = async () => {
      try {
        const response = await fetch('/api/read-file');
        const data = await response.json();

        if (response.ok) {
          setFileContent(data.content);
        } else {
          setError(data.error || 'Failed to fetch file content.');
        }
      } catch (err) {
        setError('An error occurred while fetching file content.');
        console.error('Fetch error:', err);
      }
    };

    fetchFileContent();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>File Content</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <pre
          style={{
            background: '#f4f4f4',
            padding: '10px',
            borderRadius: '5px',
            overflowX: 'auto',
          }}
        >
          {fileContent || 'Loading...'}
        </pre>
      )}
    </div>
  );
}
