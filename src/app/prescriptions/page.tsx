'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Prescription {
  id: string;
  appointment_id: string;
  doctor_name: string;
  medicine_name: string;
  dosage: string;
  duration: string;
  notes: string;
  created_at: string;
  patient_name: string;
  patient_age: number;
  patient_blood_group: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPrescription, setPreviewPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    async function fetchPrescriptions() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from('prescriptions')
        .select(
          `id, appointment_id, medicine_name, dosage, duration, notes, created_at, patient_id, doctor_name, patient_name, patient_age, patient_blood_group`
        )
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPrescriptions(data);
      } else {
        console.error('Error fetching prescriptions:', error);
      }

      setLoading(false);
    }

    fetchPrescriptions();
  }, []);

 const handleDownloadPDF = (prescription: Prescription) => {
  try {
    const doc = new jsPDF();

    // Hospital Header
    doc.setFontSize(18);
    doc.text('City Care Hospital', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Beside kamineni college, Hyderabad', 105, 22, { align: 'center' });
    doc.text('Phone: +91-9876543210 | Email: medsci@kamineni.com', 105, 28, { align: 'center' });
    doc.line(10, 32, 200, 32); // separator

    // Doctor Info
    doc.setFontSize(12);
    doc.text(`Doctor: Dr. ${prescription.doctor_name}`, 14, 40);
    doc.text(`Date: ${new Date(prescription.created_at).toLocaleDateString()}`, 150, 40);

    // Patient Info
    doc.text(`Patient Name: ${prescription.patient_name}`, 14, 48);
    doc.text(`Age: ${prescription.patient_age}`, 14, 54);
    doc.text(`Blood Group: ${prescription.patient_blood_group}`, 14, 60);

    // Table of medicines
    autoTable(doc, {
      startY: 70,
      head: [['Medicine', 'Dosage', 'Duration', 'Notes']],
      body: [
        [
          prescription.medicine_name,
          prescription.dosage,
          prescription.duration,
          prescription.notes
        ]
      ],
    });

    // Save the PDF
    doc.save(`Prescription_${prescription.patient_name}_${prescription.id}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(`Failed to generate PDF: ${error}`);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>

        {loading ? (
          <p>Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white p-4 rounded-xl shadow border"
              >
                <div className="mb-2 text-sm text-gray-500">
                  Issued on: {new Date(prescription.created_at).toLocaleDateString()}
                </div>
                <h2 className="text-lg font-semibold">Dr. {prescription.doctor_name}</h2>
                <p><strong>Patient:</strong> {prescription.patient_name} ({prescription.patient_age} yrs, {prescription.patient_blood_group})</p>
                <p><strong>Medicine:</strong> {prescription.medicine_name}</p>
                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                <p><strong>Duration:</strong> {prescription.duration}</p>
                <p><strong>Notes:</strong> {prescription.notes}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setPreviewPrescription(prescription)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(prescription)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">
              Dr. {previewPrescription.doctor_name}
            </h2>
            <p><strong>Issued on:</strong> {new Date(previewPrescription.created_at).toLocaleDateString()}</p>
            <p><strong>Patient:</strong> {previewPrescription.patient_name}</p>
            <p><strong>Age:</strong> {previewPrescription.patient_age}</p>
            <p><strong>Blood Group:</strong> {previewPrescription.patient_blood_group}</p>
            <p><strong>Medicine:</strong> {previewPrescription.medicine_name}</p>
            <p><strong>Dosage:</strong> {previewPrescription.dosage}</p>
            <p><strong>Duration:</strong> {previewPrescription.duration}</p>
            <p><strong>Notes:</strong> {previewPrescription.notes}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPreviewPrescription(null)}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadPDF(previewPrescription);
                  setPreviewPrescription(null);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
