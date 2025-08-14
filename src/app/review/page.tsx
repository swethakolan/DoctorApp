'use client';

import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Review {
  rating: number;
  comment: string;
}

export default function ReviewPage() {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // These should come from query params or your auth/session
  const doctorName = searchParams.get('doctor_name') || 'Dr. Raj Singh';
  const patientId = 'f61089dc-8bec-4858-99ba-09fddd9cd4fa';
  const patientName = searchParams.get('name') || 'John sharma';

  // Load existing review from Supabase when page loads
  useEffect(() => {
    const fetchReview = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating, comment')
        .eq('patient_id', patientId)
        .eq('doctor_name', doctorName)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching review:', error);
      } else if (data) {
        setExistingReview(data);
      }
      setLoading(false);
    };

    if (doctorName) {
      fetchReview();
    }
  }, [doctorName]);

  const handleSubmit = async () => {
    const { error } = await supabase.from('reviews').insert([
      {
        doctor_name: doctorName,
        patient_id: patientId,
        patient_name: patientName,
        rating,
        comment
      }
    ]);

    if (error) {
      console.error('Error saving review:', error);
      return;
    }

    setShowModal(true);
  };

  const handleEdit = async () => {
    const { error } = await supabase
      .from('reviews')
      .update({ rating, comment })
      .eq('patient_id', patientId)
      .eq('doctor_name', doctorName);

    if (error) {
      console.error('Error updating review:', error);
      return;
    }

    setShowModal(true);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('patient_id', patientId)
      .eq('doctor_name', doctorName);

    if (error) {
      console.error('Error deleting review:', error);
      return;
    }

    setExistingReview(null);
  };

  const closeModalAndRedirect = () => {
    setShowModal(false);
    router.push('/prescriptions');
  };

 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {existingReview ? 'Edit Your Review' : 'Leave a Review'}
        </h2>

        {/* Star Rating */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={index}
                className={`cursor-pointer transition-colors duration-200 ${
                  starValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                size={24}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>

        {/* Comment Box */}
        <textarea
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          rows={4}
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {existingReview ? (
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              disabled={rating === 0 || comment.trim() === ''}
            >
              Update Review
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition"
            disabled={rating === 0 || comment.trim() === ''}
          >
            Submit Review
          </button>
        )}
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-3">✅ Review Saved</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your feedback! Your review has been recorded successfully.
            </p>
            <button
              onClick={closeModalAndRedirect}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Go to Prescriptions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
