'use client';

import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Review {
  patient_name: string;
  doctor_name: string;
  rating: number;
  comment: string;
}

export default function DoctorFeedbackDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('reviews')
        .select('patient_name, doctor_name, rating, comment')
        .order('rating', { ascending: false }); // Highest rating first

      if (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) =>
    review.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  // Insights
  const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
    rating: `${star}★`,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const topDoctor =
    reviews.length > 0
      ? reviews.reduce((prev, current) =>
          current.rating > prev.rating ? current : prev
        )
      : null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Patient Feedback Dashboard</h1>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Highest Rated Doctor Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Highest Rated Feedback</h2>
          {topDoctor ? (
            <>
              <p className="text-2xl font-bold">{topDoctor.doctor_name}</p>
              <p className="text-sm opacity-90">{topDoctor.patient_name}'s review</p>
              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={20}
                    className={i < topDoctor.rating ? 'text-yellow-300' : 'text-white/30'}
                  />
                ))}
              </div>
              <p className="mt-3 text-white/90">{topDoctor.comment}</p>
            </>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        {/* Ratings Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Ratings Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingCounts}>
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500 text-center">Loading reviews...</p>}

      {/* Reviews List */}
      {!loading && filteredReviews.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredReviews.map((review, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {review.patient_name}
                  </h3>
                  <p className="text-sm text-gray-500">{review.doctor_name}</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={18}
                      className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-gray-500 text-center">No reviews found.</p>
      )}
    </div>
  );
}
