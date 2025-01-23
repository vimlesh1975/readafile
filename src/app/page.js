'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client'; // Import socket.io-client

const socket = io(); // Connect to the WebSocket server

export default function DisplayFilePage() {
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for file updates
    socket.on('file-update', (data) => {
      setFileContent(data.content || 'File is empty.');
    });

    // Handle errors
    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
      setError('Unable to connect to WebSocket server.');
    });

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off('file-update');
      socket.off('connect_error');
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real-Time File Monitor</h1>
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
          {fileContent || 'Waiting for file updates...'}
        </pre>
      )}
    </div>
  );
}
