import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';

interface Prescription {
  id: string;
  medicine_name: string;
  dosage: string;
  duration: string;
  notes?: string;
}

interface PrescriptionModalProps {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  mode: 'view';
  onClose: () => void;
}

export default function PrescriptionModal({
  appointmentId,
  patientName,
  doctorName,
  onClose,
}: PrescriptionModalProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);

  // New prescription form state
  const [newMedicineName, setNewMedicineName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Edit mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMedicineName, setEditMedicineName] = useState('');
  const [editDosage, setEditDosage] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, [appointmentId]);

  async function fetchPrescriptions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      alert('Error loading prescriptions');
    } else {
      setPrescriptions(data || []);
    }
    setLoading(false);
  }

  // Add new prescription
  const handleAdd = async () => {
    if (!newMedicineName || !newDosage) {
      alert('Please fill in medicine name and dosage');
      return;
    }

    const { error } = await supabase.from('prescriptions').insert([
      {
        appointment_id: appointmentId,
        doctor_name: doctorName,
        medicine_name: newMedicineName,
        dosage: newDosage,
        duration: newDuration,
        notes: newNotes,
      },
    ]);

    if (error) {
      alert('Failed to add prescription');
      console.error(error);
    } else {
      setNewMedicineName('');
      setNewDosage('');
      setNewDuration('');
      setNewNotes('');
      fetchPrescriptions();
    }
  };

  // Edit prescription: open edit form
  const startEdit = (presc: Prescription) => {
    setEditingId(presc.id);
    setEditMedicineName(presc.medicine_name);
    setEditDosage(presc.dosage);
    setEditDuration(presc.duration);
    setEditNotes(presc.notes || '');
  };

  // Save edited prescription
  const saveEdit = async () => {
    if (!editMedicineName || !editDosage) {
      alert('Please fill in medicine name and dosage');
      return;
    }

    const { error } = await supabase
      .from('prescriptions')
      .update({
        medicine_name: editMedicineName,
        dosage: editDosage,
        duration: editDuration,
        notes: editNotes,
      })
      .eq('id', editingId);

    if (error) {
      alert('Failed to update prescription');
      console.error(error);
    } else {
      setEditingId(null);
      fetchPrescriptions();
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Delete prescription
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    const { error } = await supabase.from('prescriptions').delete().eq('id', id);
    if (error) {
      alert('Failed to delete prescription');
      console.error(error);
    } else {
      fetchPrescriptions();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-2">
          Prescriptions for {patientName}
        </h2>
        <p className="mb-6">
          Doctor: <strong className="text-blue-600">{doctorName}</strong>
        </p>

        {loading && <p>Loading prescriptions...</p>}

        {/* Prescriptions List */}
        {!loading && prescriptions.length === 0 && (
          <p className="mb-6">No prescriptions found.</p>
        )}

        <div className="space-y-4 mb-8">
          {prescriptions.map((p) =>
            editingId === p.id ? (
              // Edit form for this prescription
              <div
                key={p.id}
                className="border rounded p-4 bg-gray-50"
              >
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    className="border p-2 rounded"
                    value={editMedicineName}
                    onChange={(e) => setEditMedicineName(e.target.value)}
                    placeholder="Medicine Name"
                  />
                  <input
                    type="text"
                    className="border p-2 rounded"
                    value={editDosage}
                    onChange={(e) => setEditDosage(e.target.value)}
                    placeholder="Dosage"
                  />
                  <input
                    type="text"
                    className="border p-2 rounded"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="Duration"
                  />
                  <textarea
                    className="border p-2 rounded"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Notes / Instructions"
                    rows={3}
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display prescription card
              <div
                key={p.id}
                className="border rounded p-4 flex justify-between items-start bg-gray-50"
              >
                <div>
                  <p><strong>Medicine:</strong> {p.medicine_name}</p>
                  <p><strong>Dosage:</strong> {p.dosage}</p>
                  <p><strong>Duration:</strong> {p.duration}</p>
                  {p.notes && <p><strong>Notes:</strong> {p.notes}</p>}
                </div>
                <div className="flex flex-col gap-1 ml-4 text-sm">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Add New Prescription Form */}
        <div className="border rounded p-4">
          <h3 className="text-lg font-semibold mb-3">Add New Prescription</h3>
          <input
            type="text"
            placeholder="Medicine Name"
            className="border p-2 rounded w-full mb-2"
            value={newMedicineName}
            onChange={(e) => setNewMedicineName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dosage"
            className="border p-2 rounded w-full mb-2"
            value={newDosage}
            onChange={(e) => setNewDosage(e.target.value)}
          />
          <input
            type="text"
            placeholder="Duration"
            className="border p-2 rounded w-full mb-2"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
          />
          <textarea
            placeholder="Notes / Instructions"
            className="border p-2 rounded w-full mb-4"
            rows={3}
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Add Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
