'use client';

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  
  // Get booking details from query params
  const doctorName = params.get("name");
  const date = params.get("date");
  const time = params.get("time");
  const isRescheduled = params.get("rescheduled") === "true";

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <div className="text-green-600 text-4xl mb-2">🎉</div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {isRescheduled ? "Appointment Rescheduled!" : "Appointment Booked!"}
        </h2>

        {/* Show doctor and slot details if available */}
        {doctorName && date && time && (
          <p className="text-sm text-gray-600 mt-2">
            with <span className="font-semibold">{doctorName}</span> <br />
            on <span className="font-medium">{date}</span> at <span className="font-medium">{time}</span>
          </p>
        )}

        <a
          href="/home"
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
