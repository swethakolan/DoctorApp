'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface Appointment {
  id: string;
  status: string;
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: doctorProfile } = await supabase
        .from('doctorslist')
        .select('id, name')
        .eq('name', 'Dr. Raj Singh')
        .single();

      if (!doctorProfile) return;
      setDoctorName(doctorProfile.name);

      const { data } = await supabase
        .from('appointmentlist')
        .select('id, status')
        .eq('doctor_id', doctorProfile.id);

      setAppointments(data || []);
    };
    fetchData();
  }, []);

  const statusCounts = [
    {
      name: 'Scheduled',
      value: appointments.filter((a) => a.status === 'Scheduled').length,
    },
    {
      name: 'Completed',
      value: appointments.filter((a) => a.status === 'Completed').length,
    },
    {
      name: 'Cancelled',
      value: appointments.filter((a) => a.status === 'Cancelled').length,
    },
    {
      name: 'Rescheduled',
      value: appointments.filter((a) => a.status === 'Rescheduled').length,
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b']; // Blue, Green, Red, Yellow
  const CARD_COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-sky-700">
        Welcome, {doctorName || 'Doctor'}
      </h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {statusCounts.map((stat, i) => (
          <div
            key={i}
            className={`${CARD_COLORS[i]} text-white p-1 rounded-xl shadow-lg text-center transform hover:scale-105 transition duration-300`}
          >
            <h2 className="text-lg font-semibold">{stat.name}</h2>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Appointments Overview
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Appointments by Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusCounts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
