'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

import { X } from 'lucide-react';


interface PrescriptionModalProps {
  appointmentId: string;
  patientName: string;
  doctorName:string;
  mode: 'add' | 'edit';
  onClose: () => void;
}

export default function PrescriptionModal({
  appointmentId,
  patientName,
  mode,
  onClose,
}: PrescriptionModalProps) {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [patientId, setPatientId] = useState<string | null>(null);
  useEffect(() => {

      supabase
    .from("appointmentlist")
    .select("patient_id")
    .eq("id", appointmentId)
    .single()
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching patient_id:", error);
      } else {
        setPatientId(data?.patient_id || null);
      }
    });
    if (mode === 'edit') {
      supabase
        .from('prescriptions')
        .select('medicine_name, dosage, duration, notes')
        .eq('appointment_id', appointmentId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching prescription:', error);
          } else if (data) {
            setMedicineName(data.medicine_name || '');
            setDosage(data.dosage || '');
            setDuration(data.duration || '');
            setNotes(data.notes || '');
          }
        });
    }
  }, [mode, appointmentId]);

  // Save or update prescription
 const handleSave = async () => {
  try {
    let response;

    if (mode === 'add') {
      if (!patientId) {
        alert("Patient ID not found. Cannot save prescription.");
        return;
      }

      response = await supabase.from('prescriptions').insert([
  {
    appointment_id: appointmentId,
    patient_id: patientId,
    doctor_name: "Raj singh", // ✅ add this line
    medicine_name: medicineName,
    dosage,
    duration,
    notes,
  },
]);
    } else {
      response = await supabase
        .from('prescriptions')
        .update({
          medicine_name: medicineName,
          dosage,
          duration,
          notes,
        })
        .eq('appointment_id', appointmentId);
    }

    console.log('Supabase response:', response);

    if (response.error) {
      alert(`Error: ${response.error.message}`);
      return;
    }

    onClose();
  } catch (error) {
    console.error('Error saving prescription:', error);
  }
};


  // Delete prescription
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;

    try {
      await supabase.from('prescriptions').delete().eq('appointment_id', appointmentId);
      onClose();
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {mode === 'add' ? 'Add Prescription' : 'Edit Prescription'}
        </h2>

      <div className="space-y-3">
        <div>
              <label className="block text-sm font-medium text-gray-700">Doctor Name : <span className="text-blue-500 font-bold">Raj Singh</span></label>
             
            </div>
        <input
          type="text"
          placeholder="Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <textarea
          placeholder="Notes / Instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        {mode === 'edit' && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          
        </div>
      </div>
    </div>
    </div>
  );
}