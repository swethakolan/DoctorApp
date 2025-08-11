'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

interface HistoryRecord {
  id: string;
  patient_id: string;
  title: string;
  description: string;
  file_url: string;
  created_at: string;
}

export default function MedicalHistoryPage() {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }
      if (data.user) {
        setPatientId(data.user.id);
      }
    };
    getUser();
  }, []);

  // Fetch medical history records
  useEffect(() => {
    if (patientId) fetchHistory();
  }, [patientId]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('medical_history')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching history:', error);
    else setRecords(data || []);
    setLoading(false);
  };

  // Add new record
  const addRecord = async () => {
    if (!file || !title) return alert('Please provide a title and file');

    const filePath = `${patientId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('medical-history-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('medical-history-files')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from('medical_history')
      .insert([
        {
          patient_id: patientId,
          title,
          description,
          file_url: publicUrlData.publicUrl,
        },
      ]);

    if (insertError) {
      console.error('Error inserting record:', insertError);
    } else {
      fetchHistory();
      setShowModal(false);
      setTitle('');
      setDescription('');
      setFile(null);
    }
  };

  // Delete record
  const deleteRecord = async (record: HistoryRecord) => {
    const filePath = record.file_url.split('/').slice(-1)[0];
    await supabase.storage.from('').remove([`${patientId}/${filePath}`]);
    await supabase.from('medical_history').delete().eq('id', record.id);
    fetchHistory();
  };

  return (
     <div className="min-h-screen text-gray-800">
          <Navbar />
    <div className="p-6 max-w-3xl mx-auto">
      

      {/* Add Record Button */}
      <div className="flex flex-row justify-center">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        upload new history
      </button>
      </div>

      {/* Records List */}
      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p>No history records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{record.title}</h2>
                <p className="text-sm text-gray-600">{record.description}</p>
                <a
                  href={record.file_url}
                  target="_blank"
                  className="text-blue-500 underline text-sm"
                >
                  View File
                </a>
              </div>
              <button
                onClick={() => deleteRecord(record)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">Add Medical History</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={addRecord}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
