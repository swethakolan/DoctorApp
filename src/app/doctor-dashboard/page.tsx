'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FaCalendarAlt, FaUserMd, FaListUl, FaUser } from 'react-icons/fa';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  status: string;
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorName, setDoctorName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'calendar' | 'profile'>('dashboard');
  const router = useRouter();

  // Fetch doctor data
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch doctor profile (adjust query as needed)
      const { data: doctorProfile } = await supabase
        .from('doctorslist')
        .select('id, name')
        .eq('name', 'Dr. Raj Singh')
        .single();

      if (!doctorProfile) {
        setLoading(false);
        return;
      }
      setDoctorName(doctorProfile.name);

      // Fetch appointments
      const { data, error } = await supabase
        .from('appointmentlist')
        .select('id, patient_name, date, time, status')
        .eq('doctor_id', doctorProfile.id);

      if (error) console.error('Error fetching appointments:', error.message);
      else setAppointments(data || []);

      setLoading(false);
    };
    fetchAppointments();
  }, []);

  // Graph Data
  const statusCounts = [
    { name: 'Scheduled', value: appointments.filter(a => a.status === 'Scheduled').length },
    { name: 'Completed', value: appointments.filter(a => a.status === 'Completed').length },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length },
    { name: 'Rescheduled', value: appointments.filter(a => a.status === 'Rescheduled').length },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

  // Update status of appointment
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('appointmentlist').update({ status }).eq('id', id);
    if (!error) setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
  };

  // Handle drag & drop on calendar
  const handleEventDrop = async (info: any) => {
    const { error } = await supabase
      .from('appointmentlist')
      .update({ date: info.event.startStr })
      .eq('id', info.event.id);

    if (error) {
      alert('Error updating appointment date');
      info.revert();
    } else {
      setAppointments(prev =>
        prev.map(a => (a.id === info.event.id ? { ...a, date: info.event.startStr } : a))
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col bg-white shadow-lg w-64 p-6">
        <h2 className="text-2xl font-bold text-sky-600 mb-8">Doctor Panel</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}
          >
            <FaUserMd /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === 'appointments' ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}
          >
            <FaListUl /> Appointments
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === 'calendar' ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}
          >
            <FaCalendarAlt /> Calendar
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === 'profile' ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}
          >
            <FaUser /> Profile
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, {doctorName || 'Doctor'}</h1>

        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Appointments Overview</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Appointments by Status</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusCounts}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : activeTab === 'appointments' ? (
          <div className="space-y-4">
            {appointments.map(app => (
              <div key={app.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{app.patient_name}</h2>
                  <p className="text-sm text-gray-500">{app.date} at {app.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    app.status === 'Scheduled'
                      ? 'bg-sky-100 text-sky-600'
                      : app.status === 'Cancelled'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
                {app.status === 'Scheduled' && (
                  <div className="flex gap-3">
                    <button onClick={() => updateStatus(app.id, 'Completed')} className="text-green-600 hover:text-green-800">Complete</button>
                    <button onClick={() => updateStatus(app.id, 'Cancelled')} className="text-red-500 hover:text-red-700">Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : activeTab === 'calendar' ? (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              editable={true}
              droppable={true}
              events={appointments.map(app => ({
                id: app.id,
                title: `${app.patient_name} (${app.status})`,
                date: app.date,
              }))}
              eventDrop={handleEventDrop}
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold">Profile Settings</h2>
            <p className="text-gray-500">Doctor details and profile management go here.</p>
          </div>
        )}
      </div>

      {/* Bottom Navbar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around py-3 md:hidden">
        <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'text-sky-600' : 'text-gray-500'}`}>
          <FaUserMd size={22} />
        </button>
        <button onClick={() => setActiveTab('appointments')} className={`${activeTab === 'appointments' ? 'text-sky-600' : 'text-gray-500'}`}>
          <FaListUl size={22} />
        </button>
        <button onClick={() => setActiveTab('calendar')} className={`${activeTab === 'calendar' ? 'text-sky-600' : 'text-gray-500'}`}>
          <FaCalendarAlt size={22} />
        </button>
        <button onClick={() => setActiveTab('profile')} className={`${activeTab === 'profile' ? 'text-sky-600' : 'text-gray-500'}`}>
          <FaUser size={22} />
        </button>
      </div>
    </div>
  );
}
