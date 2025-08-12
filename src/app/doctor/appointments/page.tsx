'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Dropdown from '@/components/Dropdown';
import PrescriptionModal from '@/components/PrescriptionModal';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  hasPrescription: boolean;
}

interface MedicalHistoryRecord {
  id: string;
  title: string;
  description: string;
  file_url?: string | null;
  created_at: string;
}
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState('All');

  const [prescriptionModal, setPrescriptionModal] = useState<{
    id: string;
    patientName: string;
  } | null>(null);

  const [doctorName, setDoctorName] = useState('');

  // Medical history modal states
  const [medicalHistoryModal, setMedicalHistoryModal] = useState<{
    patientId: string;
    patientName: string;
  } | null>(null);

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchAppointments = async () => {
    try {
      const { data: doctorProfile, error: doctorError } = await supabase
        .from('doctorslist')
        .select('id, name')
        .eq('name', 'Dr. Raj Singh')
        .single();

      if (doctorError || !doctorProfile) {
        console.error('Error fetching doctor:', doctorError);
        return;
      }

      setDoctorName(doctorProfile.name);

      const { data: appts, error: apptsError } = await supabase
        .from('appointmentlist')
        .select('id, patient_id, patient_name, date, time, status')
        .eq('doctor_id', doctorProfile.id);

      if (apptsError) {
        console.error('Error fetching appointments:', apptsError);
        return;
      }

      const { data: prescs, error: prescsError } = await supabase
        .from('prescriptions')
        .select('appointment_id');

      if (prescsError) {
        console.error('Error fetching prescriptions:', prescsError);
      }

      const prescribedIds = prescs?.map((p) => p.appointment_id) || [];

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

    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointmentlist' },
        () => fetchAppointments()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'prescriptions' },
        () => fetchAppointments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointmentlist').update({ status }).eq('id', id);
    fetchAppointments();
  };

  const fetchMedicalHistory = async (patientId: string) => {
    setLoadingHistory(true);
    const { data, error } = await supabase
  .from('medical_history')
  .select('id, title, description, file_url, created_at')
  .eq('patient_id', patientId)
  .order('created_at', { ascending: false });


    if (error) {
      console.error('Error fetching medical history:', error);
      setMedicalHistory([]);
    } else {
      setMedicalHistory(data || []);
    }
    setLoadingHistory(false);
  };

  const openMedicalHistory = (patientId: string, patientName: string) => {
    setMedicalHistoryModal({ patientId, patientName });
    fetchMedicalHistory(patientId);
  };

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

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.map((app) => (
          <div
            key={app.id}
            className="bg-white shadow-lg rounded-xl p-4 border hover:shadow-xl transition relative"
          >
            {/* 3-Dots Menu */}
            <div className="absolute top-2 right-2">
              <Menu as="div" className="relative">
                <MenuButton className="p-2 text-gray-500 hover:text-gray-700">
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </MenuButton>

                <MenuItems className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg focus:outline-none">
                  <MenuItem
                    as="button"
                    onClick={() => openMedicalHistory(app.patient_id, app.patient_name)}
                    className="w-full text-left px-4 py-2 text-sm ui-active:bg-blue-500 ui-active:text-white"
                  >
                    View Medical History
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            {/* Patient Name */}
            <h3 className="text-lg font-semibold text-gray-800">{app.patient_name}</h3>

            {/* Date & Time */}
            <p className="text-sm text-gray-500 mt-1">
              {app.date} <span className="text-gray-400">at</span> {app.time}
            </p>

            {/* Status */}
            <div className="mt-2">
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
            </div>

            {/* Prescription Status */}
            <p className="mt-2 text-sm">
              {app.hasPrescription ? (
                <span className="text-green-600 font-medium">Prescribed</span>
              ) : (
                <span className="text-gray-400">Not Prescribed</span>
              )}
            </p>

            {/* Actions */}
            <div className="mt-4 flex justify-between items-center">
              <button
                className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => updateStatus(app.id, 'Completed')}
              >
                Complete
              </button>
              <button
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() =>
                  setPrescriptionModal({
                    id: app.id,
                    patientName: app.patient_name,
                  })
                }
              >
                Manage Prescriptions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Modal */}
      {prescriptionModal && (
        <PrescriptionModal
          appointmentId={prescriptionModal.id}
          patientName={prescriptionModal.patientName}
          doctorName={doctorName}
          mode="view"
          onClose={() => {
            setPrescriptionModal(null);
            fetchAppointments();
          }}
        />
      )}

      {/* Medical History Modal */}
     {medicalHistoryModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4 backdrop-blur-sm animate-fadeIn"
    role="dialog"
    aria-modal="true"
  >
    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
      <button
        onClick={() => setMedicalHistoryModal(null)}
        className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 transition"
        aria-label="Close modal"
      >
        <span className="text-3xl font-bold leading-none">&times;</span>
      </button>

      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Medical History for <span className="text-blue-600">{medicalHistoryModal.patientName}</span>
      </h2>

      {loadingHistory && (
        <p className="text-gray-600 text-center py-10 text-lg font-medium">Loading medical history...</p>
      )}

      {!loadingHistory && medicalHistory.length === 0 && (
        <p className="text-center text-gray-500 text-lg italic">No medical history records found.</p>
      )}

      {!loadingHistory && medicalHistory.length > 0 && (
        <ul className="space-y-6">
          {medicalHistory.map((record) => (
            <li
              key={record.id}
              className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-tr from-white to-gray-50"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">
                  {new Date(record.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                {record.file_url && (
                  <a
                    href={record.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline transition"
                  >
                    View Document
                  </a>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{record.title}</h3>
              <p className="text-gray-700 whitespace-pre-line">{record.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}


    </div>
  );
}
