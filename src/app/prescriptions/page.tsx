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

interface Review {
  id: string;
  doctor_name: string;
  patient_id: string;
  patient_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
 const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
 
  
  const [newReview, setNewReview] = useState<{ rating: number; comment: string; doctor: string }>({
    rating: 5,
    comment: '',
    doctor: ''
  });

  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  

  useEffect(() => {
    async function fetchPrescriptions() {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUser({ id: user.id, name: user.user_metadata.full_name || 'John sharma' });

      const { data, error } = await supabase
        .from('prescriptions')
        .select(
          `id, appointment_id, medicine_name, dosage, duration, notes, created_at, patient_id, doctor_name, patient_name, patient_age, patient_blood_group`
        )
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPrescriptions(data);
      }
      setLoading(false);
    }

    async function fetchReviews() {
      const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (data) setReviews(data);
    }

    fetchPrescriptions();
    fetchReviews();
  }, []);

  async function submitReview(doctor: string) {
    if (!currentUser) return;

    const { error } = await supabase.from('reviews').insert([
      {
        doctor_name: doctor,
        patient_id: currentUser.id,
        patient_name: currentUser.name,
        rating: newReview.rating,
        comment: newReview.comment
      }
    ]);

    if (!error) {
      alert('Review submitted!');
      setReviews((prev) => [
        {
          id: Math.random().toString(),
          doctor_name: doctor,
          patient_id: currentUser.id,
          patient_name: currentUser.name,
          rating: newReview.rating,
          comment: newReview.comment,
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
      setNewReview({ rating: 5, comment: '', doctor: '' });
    }
  }

  const handleDownloadPDF = (prescription: Prescription) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('City Care Hospital', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Beside kamineni college, Hyderabad', 105, 22, { align: 'center' });
    doc.text('Phone: +91-9876543210 | Email: medsci@kamineni.com', 105, 28, { align: 'center' });
    doc.line(10, 32, 200, 32);
    doc.setFontSize(12);
    doc.text(`Doctor: Dr. ${prescription.doctor_name}`, 14, 40);
    doc.text(`Date: ${new Date(prescription.created_at).toLocaleDateString()}`, 150, 40);
    doc.text(`Patient Name: ${prescription.patient_name}`, 14, 48);
    doc.text(`Age: ${prescription.patient_age}`, 14, 54);
    doc.text(`Blood Group: ${prescription.patient_blood_group}`, 14, 60);
    autoTable(doc, {
      startY: 70,
      head: [['Medicine', 'Dosage', 'Duration', 'Notes']],
      body: [[prescription.medicine_name, prescription.dosage, prescription.duration, prescription.notes]]
    });
    doc.save(`Prescription_${prescription.patient_name}_${prescription.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <div className="max-w-4xl  mx-auto py-10 px-4">
  <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">My Prescriptions</h1>

  {loading ? (
    <p className="text-center text-gray-500 text-lg">Loading prescriptions...</p>
  ) : prescriptions.length === 0 ? (
    <p className="text-center text-gray-400 text-lg">No prescriptions found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
      {prescriptions.map((prescription) => (
        <div
          key={prescription.id}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg 
                     transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div className="mb-3 text-sm text-gray-400">
            Issued on: {new Date(prescription.created_at).toLocaleDateString()}
          </div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Dr. {prescription.doctor_name}</h2>
          <p className="text-gray-700 mb-1">
            <span className="font-medium">Patient:</span> {prescription.patient_name} ({prescription.patient_age} yrs,{' '}
            {prescription.patient_blood_group})
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-medium">Medicine:</span> {prescription.medicine_name}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-medium">Dosage:</span> {prescription.dosage}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-medium">Duration:</span> {prescription.duration}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-medium">Notes:</span> {prescription.notes}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => handleDownloadPDF(prescription)}
              className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 shadow"
            >
              Download PDF
            </button>
            <button
              onClick={() => {
                setSelectedPrescription(prescription);
                setIsReviewModalOpen(true);
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all duration-300 shadow"
            >
              Leave a Review
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      {isReviewModalOpen && selectedPrescription && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
      <button
        onClick={() => setIsReviewModalOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
      >
        ×
      </button>

      <h3 className="font-semibold text-lg mb-3">Leave a Review for Dr. {selectedPrescription.doctor_name}</h3>

      {/* Star Rating */}
      <div className="flex items-center mb-3">
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() =>
              setNewReview({
                ...newReview,
                doctor: selectedPrescription.doctor_name,
                rating: star,
              })
            }
            className={`cursor-pointer text-2xl ${
              star <= (newReview.doctor === selectedPrescription.doctor_name ? newReview.rating : 0)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Feedback Input */}
      <textarea
        placeholder="Write your feedback..."
        value={newReview.doctor === selectedPrescription.doctor_name ? newReview.comment : ""}
        onChange={(e) =>
          setNewReview({
            ...newReview,
            doctor: selectedPrescription.doctor_name,
            comment: e.target.value,
          })
        }
        className="border p-2 rounded w-full resize-none focus:ring-2 focus:ring-purple-400"
        rows={3}
      />

      <button
        onClick={() => {
          submitReview(selectedPrescription.doctor_name);
          setIsReviewModalOpen(false);
        }}
        className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 w-full"
      >
        Submit Review
      </button>
    </div>
  </div>
)}

    </div>
  );
}
