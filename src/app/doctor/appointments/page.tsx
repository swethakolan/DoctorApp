'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCcw, XCircle, Trash2 } from 'lucide-react';

interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [filter, setFilter] = useState<string>('All'); // NEW: Filter state

  // Fetch Appointments
  const fetchAppointments = async () => {
    const { data: doctorProfile } = await supabase
      .from('doctorslist')
      .select('id')
      .eq('name', 'Dr. Raj Singh')
      .single();

    if (!doctorProfile) return;

    const { data } = await supabase
      .from('appointmentlist')
      .select('id, patient_name, date, time, status')
      .eq('doctor_id', doctorProfile.id);

    setAppointments(data || []);
  };

  // Realtime Sync
  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointmentlist' },
        () => fetchAppointments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update Status
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('appointmentlist')
      .update({ status })
      .eq('id', id);

    if (!error) {
      fetchAppointments();
    } else {
      console.error('Error updating status:', error);
    }
  };

  // Reschedule Appointment
  const rescheduleAppointment = async () => {
    if (!rescheduleId || !newDate || !newTime) return;
    const { error } = await supabase
      .from('appointmentlist')
      .update({ date: newDate, time: newTime, status: 'Rescheduled' })
      .eq('id', rescheduleId);

    if (!error) {
      setRescheduleId(null);
      setNewDate('');
      setNewTime('');
      fetchAppointments();
    } else {
      console.error('Error rescheduling:', error);
    }
  };

  // Delete Appointment
  const deleteAppointment = async (id: string) => {
    const { error } = await supabase
      .from('appointmentlist')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchAppointments();
    } else {
      console.error('Error deleting appointment:', error);
    }
  };

  // Filtered Appointments
  
  const filteredAppointments = appointments.filter(app =>
    filter === 'All' ? true : app.status === filter
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-2">
        {['All', 'Scheduled', 'Rescheduled', 'Completed', 'Cancelled'].map(option => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-2 rounded ${
              filter === option ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } hover:bg-blue-400 transition-all duration-200`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAppointments.map(app => (
          <div
            key={app.id}
            className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between
                       hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <h2 className="font-semibold text-lg">{app.patient_name}</h2>
              <p className="text-sm text-gray-500">
                {app.date} at {app.time}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full inline-block mt-2 transition-transform duration-200 hover:scale-105 ${
                  app.status === 'Scheduled'
                    ? 'bg-sky-100 text-sky-600'
                    : app.status === 'Cancelled'
                    ? 'bg-red-100 text-red-600'
                    : app.status === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {app.status}
              </span>
            </div>

            {(app.status === 'Scheduled' || app.status === 'Rescheduled') && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setRescheduleId(app.id)}
                  className="text-yellow-600 hover:text-yellow-800 transition-transform duration-200 hover:scale-110"
                >
                  <RefreshCcw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'Cancelled')}
                  className="text-red-500 hover:text-red-700 transition-transform duration-200 hover:scale-110"
                >
                  <XCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'Completed')}
                  className="text-green-600 hover:text-green-800 transition-transform duration-200 hover:scale-110"
                >
                  Complete
                </button>
              </div>
            )}

            {app.status === 'Cancelled' && (
              <div className="flex justify-center mt-4">
                <button onClick={() => deleteAppointment(app.id)}>
                  <Trash2 className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 scale-105">
            <h2 className="text-lg font-semibold mb-4">Reschedule Appointment</h2>
            <input
              type="date"
              className="border p-2 mb-2 w-full"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
            />
            <input
              type="time"
              className="border p-2 mb-4 w-full"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={rescheduleAppointment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200"
              >
                Save
              </button>
              <button
                onClick={() => setRescheduleId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
