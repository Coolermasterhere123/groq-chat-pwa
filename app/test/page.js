'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState('Loading...');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => {
        setStatus(data.hasApiKey ? '✅ API Key Found' : '❌ No API Key Found');
        setDetails(data);
        setLoading(false);
      })
      .catch(err => {
        setStatus('❌ Error: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
        <h2>Loading diagnostic...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>🔍 API Key Diagnostic</h1>
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '20px', 
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Status: {status}</h2>
        <pre style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '16px', 
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {JSON.stringify(details, null, 2)}
        </pre>
      </div>
      
      {details?.groqTest && (
        <div style={{ 
          background: details.groqTest.success ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          padding: '20px', 
          borderRadius: '12px',
          border: '1px solid ' + (details.groqTest.success ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)')
        }}>
          <h3 style={{ marginBottom: '10px' }}>
            {details.groqTest.success ? '✅ Groq API Test Passed' : '❌ Groq API Test Failed'}
          </h3>
          <pre style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '12px', 
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '13px'
          }}>
            {JSON.stringify(details.groqTest, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: '#3b82f6', textDecoration: 'underline' }}>← Back to Chat</a>
      </div>
    </div>
  );
}