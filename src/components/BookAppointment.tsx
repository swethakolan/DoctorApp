"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { supabase } from "@/lib/supabase";
import Navbar from "./Navbar";

const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
];

interface Doctor {
  id: string;
  name: string;
  photo: string | null;
  specialty: string | null;
  location: string | null;
}

export default function BookAppointment() {
  const params = useSearchParams();
  const doctorId = params.get("doctorId");
  const rescheduleId = params.get("rescheduleId");
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isReschedule = Boolean(rescheduleId);
  const upcomingDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (doctorId) {
          const { data, error } = await supabase
            .from("doctorslist")
            .select("id, name, photo, specialty, location")
            .eq("id", doctorId)
            .single();

          if (error) throw new Error(error.message);
          setDoctor(data);
        }

        if (isReschedule && rescheduleId) {
          const { data: appointment, error: appointmentError } = await supabase
            .from("appointmentlist")
            .select("date, time")
            .eq("id", rescheduleId)
            .single();

          if (appointmentError) throw new Error(appointmentError.message);

          if (appointment) {
            setSelectedDate(new Date(appointment.date));
            setSelectedTime(appointment.time);
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId, isReschedule, rescheduleId]);
  

const handleBooking = async () => {
  if (!selectedTime) {
    setErrorMessage("Please select a time slot.");
    return;
  }

  setSubmitting(true);
  setErrorMessage("");

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("User not logged in.");
      return;
    }

    const patientId = user.id;
    const patientName = "John Sharma"; 

   
    if (isReschedule && rescheduleId) {
      const { error } = await supabase
        .from("appointmentlist")
        .update({
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          status: "Rescheduled",
        })
        .eq("id", rescheduleId);

      if (error) throw new Error(error.message);

      router.push(`/success?rescheduled=true`);
      return;
    }
    if (!doctor) {
      setErrorMessage("Doctor not found.");
      return;
    }
    const { data: existing } = await supabase
      .from("appointmentlist")
      .select("id")
      .eq("doctor_id", doctor.id)
      .eq("date", format(selectedDate, "yyyy-MM-dd"))
      .eq("time", selectedTime);

    if (existing && existing.length > 0) {
      setErrorMessage("This slot is already booked. Please select another time.");
      return;
    }
    const { error } = await supabase.from("appointmentlist").insert([
      {
        doctor_id: doctor.id,
        patient_id: patientId,
        patient_name: patientName,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        status: "Scheduled",
      },
    ]);

    if (error) throw new Error(error.message);

    router.push(
      `/success?name=${encodeURIComponent(doctor.name)}&date=${format(selectedDate, "PPP")}&time=${selectedTime}`
    );
  } catch (err: any) {
    setErrorMessage(err.message || "Failed to process booking");
  } finally {
    setSubmitting(false);
  }
};


  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!doctor && !isReschedule) return <div className="p-4 text-center">Doctor not found.</div>;

  return (
    <div className="min-h-screen text-gray-800">
          <Navbar />
    <div className="min-h-screen bg-gray-100 px-2 py-4 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4 text-black">
        {!isReschedule && doctor && (
          <div className="flex items-center gap-4 mb-4">
            <img
              src={doctor.photo || "/default-doctor.png"}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">{doctor.name}</h2>
              <p className="text-sm text-gray-500">{doctor.specialty || "Specialty not set"}</p>
              <p className="text-xs text-gray-400">{doctor.location || "Location not set"}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Date Selection */}
        <h3 className="font-medium mb-2">Select a Date</h3>
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {upcomingDates.map((date) => (
            <button
              key={date.toDateString()}
              onClick={() => setSelectedDate(date)}
              className={`min-w-[80px] rounded-lg px-3 py-2 text-sm border ${
                date.toDateString() === selectedDate.toDateString()
                  ? "bg-sky-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <div className="font-medium">{format(date, "EEE")}</div>
              <div className="text-xs">{format(date, "MMM d")}</div>
            </button>
          ))}
        </div>

        {/* Time Slot Selection */}
        <h3 className="font-medium mt-5 mb-2">Select a Time</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`border rounded-lg px-3 py-2 text-sm ${
                selectedTime === slot ? "bg-sky-500 text-white" : "bg-white text-gray-800"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Book or Reschedule Button */}
        <button
          onClick={handleBooking}
          disabled={submitting}
          className={`w-full mt-6 py-2 rounded-lg text-center font-semibold transition ${
            submitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-sky-500 text-white hover:bg-sky-600"
          }`}
        >
          {submitting
            ? "Processing..."
            : isReschedule
            ? "Reschedule Appointment"
            : "Book Appointment"}
        </button>
      </div>
    </div>
    </div>
  );
}
