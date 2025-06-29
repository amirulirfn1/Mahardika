"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import CustomerLoyaltyCard from '@/components/CustomerLoyaltyCard';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface PointsHistoryItem {
  date: string;
  points: number;
}

interface Customer {
  id: string;
  name: string;
  loyalty_points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const LoyaltyPage = () => {
  const params = useParams();
  const customerId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [history, setHistory] = useState<PointsHistoryItem[]>([]);

  useEffect(() => {
    if (!customerId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custRes, histRes] = await Promise.all([
          fetch(`/api/customers/${customerId}`),
          fetch(`/api/customers/${customerId}/loyalty`),
        ]);
        const customerData = await custRes.json();
        const historyData = await histRes.json();
        setCustomer(customerData);
        setHistory(historyData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  const data = {
    labels: history.map((h) => h.date),
    datasets: [
      {
        label: 'Points',
        data: history.map((h) => h.points),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.3)',
        fill: true,
      },
    ],
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">{customer.name} Loyalty</h2>

      <CustomerLoyaltyCard tier={customer.tier} points={customer.loyalty_points} />

      <div className="mt-4">
        <Line data={data} />
      </div>
    </div>
  );
};

export default LoyaltyPage; 