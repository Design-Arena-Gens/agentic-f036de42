"use client";
import { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Manager' | 'Driver'>('Manager');
  const [driverId, setDriverId] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const requestOtp = async () => {
    setMessage('');
    const res = await fetch('/api/auth/request-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, role, driverId: role === 'Driver' ? driverId : undefined }) });
    const data = await res.json();
    if (res.ok) {
      setStep('verify');
      setMessage(`OTP sent${data.demoCode ? ` (demo: ${data.demoCode})` : ''}`);
    } else {
      setMessage(data.error || 'Failed');
    }
  };

  const verifyOtp = async () => {
    setMessage('');
    const res = await fetch('/api/auth/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, code }) });
    const data = await res.json();
    if (res.ok) {
      window.location.href = role === 'Manager' ? '/manager' : '/driver';
    } else {
      setMessage(data.error || 'Invalid code');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
      <h2>Login</h2>
      <div className="grid">
        <label>
          Role
          <select className="select" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="Manager">Logistics Manager</option>
            <option value="Driver">Driver</option>
          </select>
        </label>
        <label>
          Phone
          <input className="input" placeholder="+91..." value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        {role === 'Driver' && (
          <label>
            Driver ID (demo)
            <input className="input" placeholder="driver-id" value={driverId} onChange={(e) => setDriverId(e.target.value)} />
          </label>
        )}
        {step === 'request' ? (
          <button className="btn primary" onClick={requestOtp}>Send OTP</button>
        ) : (
          <>
            <label>
              Enter OTP
              <input className="input" placeholder="000000" value={code} onChange={(e) => setCode(e.target.value)} />
            </label>
            <button className="btn primary" onClick={verifyOtp}>Verify</button>
          </>
        )}
        {message && <div className="badge">{message}</div>}
      </div>
    </div>
  );
}
