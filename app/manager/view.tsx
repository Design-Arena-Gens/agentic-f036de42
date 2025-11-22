"use client";
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

const Map = dynamic(() => import('@/components/LiveMap'), { ssr: false });

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Driver = { id: string; name: string; phone: string; active: boolean };

type Order = {
  id: string; referenceCode: string; customerName: string; customerPhone: string; address: string; status: string; assignedDriverId?: string; cashOnDelivery?: number
};

export default function ManagerContent() {
  const { data: drivers } = useSWR<Driver[]>('/api/drivers', fetcher, { refreshInterval: 5000 });
  const { data: orders, mutate } = useSWR<Order[]>('/api/orders', fetcher, { refreshInterval: 5000 });
  const [selectedDriver, setSelectedDriver] = useState('');

  const assign = async (orderId: string) => {
    if (!selectedDriver) return alert('Select driver');
    await fetch('/api/assign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, driverId: selectedDriver }) });
    mutate();
  };

  const createOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    (e.target as HTMLFormElement).reset();
    mutate();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid grid-cols-2">
        <div className="card">
          <h3>Live Drivers</h3>
          <div style={{ height: 420 }}>
            <Map />
          </div>
        </div>
        <div className="card">
          <h3>New Order</h3>
          <form onSubmit={createOrder} className="grid">
            <input className="input" name="referenceCode" placeholder="Waybill / Barcode" required />
            <input className="input" name="customerName" placeholder="Customer name" required />
            <input className="input" name="customerPhone" placeholder="Customer phone" required />
            <input className="input" name="address" placeholder="Delivery address" required />
            <input className="input" name="cashOnDelivery" placeholder="COD amount (optional)" />
            <button className="btn primary" type="submit">Create</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <h3>Orders</h3>
          <div className="flex">
            <label>Assign to</label>
            <select className="select" value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
              <option value="">Select driver</option>
              {drivers?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(o => (
              <tr key={o.id}>
                <td>{o.referenceCode}</td>
                <td>{o.customerName}</td>
                <td>{o.customerPhone}</td>
                <td>{o.address}</td>
                <td><span className="badge">{o.status}</span></td>
                <td>{drivers?.find(d => d.id === o.assignedDriverId)?.name ?? '-'}</td>
                <td>
                  <button className="btn" onClick={() => assign(o.id)}>Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
