'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Dropdown from '@/components/Dropdown';
import ActionMenu from '@/components/ActionMenu';
import Modal from '@/components/Modal';
import PrescriptionModal from '@/components/PrescriptionModal';

interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  hasPrescription: boolean;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState('All');
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [prescriptionModal, setPrescriptionModal] = useState<{
    id: string;
    patient: string;
    mode: 'add' | 'edit';
  } | null>(null);

  // Fetch appointments along with prescription info
  const fetchAppointments = async () => {
    try {
      // Get doctor ID (replace with actual logged-in doctor logic if needed)
      const { data: doctorProfile } = await supabase
        .from('doctorslist')
        .select('id')
        .eq('name', 'Dr. Raj Singh')
        .single();
      if (!doctorProfile) return;

      // Fetch appointments for this doctor
      const { data: appts } = await supabase
        .from('appointmentlist')
        .select('id, patient_name, date, time, status')
        .eq('doctor_id', doctorProfile.id);

      // Fetch prescriptions and map appointment IDs
      const { data: prescs } = await supabase.from('prescriptions').select('appointment_id');
      const prescribedIds = prescs?.map((p) => p.appointment_id) || [];

      // Combine data
      setAppointments(
        (appts || []).map((a) => ({
          ...a,
          hasPrescription: prescribedIds.includes(a.id),
        }))
      );
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Listen for real-time changes
    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointmentlist' }, fetchAppointments)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prescriptions' }, fetchAppointments)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update appointment status (Cancel/Complete)
  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointmentlist').update({ status }).eq('id', id);
    fetchAppointments();
  };

  // Reschedule appointment
  const rescheduleAppointment = async () => {
    if (!rescheduleId || !newDate || !newTime) return;
    await supabase
      .from('appointmentlist')
      .update({ date: newDate, time: newTime, status: 'Rescheduled' })
      .eq('id', rescheduleId);
    setRescheduleId(null);
    setNewDate('');
    setNewTime('');
    fetchAppointments();
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    const statusMatch = filter === 'All' ? true : app.status === filter;
    const prescriptionMatch =
      prescriptionFilter === 'All'
        ? true
        : prescriptionFilter === 'Prescribed'
        ? app.hasPrescription
        : !app.hasPrescription;
    return statusMatch && prescriptionMatch;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Dropdown
          label="Filter by Status"
          value={filter}
          options={['All', 'Scheduled', 'Rescheduled', 'Completed', 'Cancelled']}
          onChange={setFilter}
        />
        <Dropdown
          label="Filter by Prescription"
          value={prescriptionFilter}
          options={['All', 'Prescribed', 'Not Prescribed']}
          onChange={setPrescriptionFilter}
        />
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Prescription</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((app) => (
              <tr key={app.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{app.patient_name}</td>
                <td className="px-4 py-3">
                  {app.date} <span className="text-gray-500">at</span> {app.time}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
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
                </td>
                <td className="px-4 py-3">
                  {app.hasPrescription ? (
                    <span className="text-green-600 font-medium">Prescribed</span>
                  ) : (
                    <span className="text-gray-400">Not Prescribed</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionMenu
                    hasPrescription={app.hasPrescription}
                    onReschedule={() => setRescheduleId(app.id)}
                    onCancel={() => updateStatus(app.id, 'Cancelled')}
                    onComplete={() => updateStatus(app.id, 'Completed')}
                    onPrescribe={() =>
                      setPrescriptionModal({
                        id: app.id,
                        patient: app.patient_name,
                        mode: app.hasPrescription ? 'edit' : 'add',
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <Modal title="Reschedule Appointment" onClose={() => setRescheduleId(null)}>
          <input
            type="date"
            className="border p-2 w-full mb-3 rounded"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <input
            type="time"
            className="border p-2 w-full mb-4 rounded"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={rescheduleAppointment}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setRescheduleId(null)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Prescription Modal */}
      {prescriptionModal && (
        <PrescriptionModal
          appointmentId={prescriptionModal.id}
          patientName={prescriptionModal.patient}
          mode={prescriptionModal.mode}
          onClose={() => {
            setPrescriptionModal(null);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
}
