'use client';

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  photo: string;
  location: string;
  date: string;
  time: string;
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedTab, setSelectedTab] = useState<"Scheduled" | "Rescheduled" | "Cancelled">("Scheduled");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("appointmentlist")
        .select(`
          id,
          date,
          time,
          status,
          doctor:doctor_id ( name, specialty, location, photo )
        `);

      if (error) {
        console.error("Error fetching appointments:", error.message);
      } else {
        const formatted = (data || []).map((a: any) => ({
          id: a.id,
          doctorName: a.doctor?.name || "Unknown Doctor",
          specialty: a.doctor?.specialty || "Not specified",
          photo: a.doctor?.photo || "/default-doctor.png",
          location: a.doctor?.location || "Not specified",
          date: a.date,
          time: a.time,
          status: a.status,
        }));
        setAppointments(formatted);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  // Cancel appointment
  const confirmCancel = async () => {
    if (!selectedId) return;

    const { error } = await supabase
      .from("appointmentlist")
      .update({ status: "Cancelled" })
      .eq("id", selectedId);

    if (error) {
      alert("Failed to cancel appointment: " + error.message);
      return;
    }

    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedId ? { ...app, status: "Cancelled" } : app
      )
    );

    setShowCancelModal(false);
    setSelectedId(null);
  };

  // Open cancel modal
  const handleCancel = (id: string) => {
    setSelectedId(id);
    setShowCancelModal(true);
  };

  // Reschedule appointment
  const handleReschedule = (id: string) => {
    router.push(`/book-appointment?rescheduleId=${id}`);
  };

  // Delete cancelled appointment
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("appointmentlist").delete().eq("id", id);

    if (error) {
      alert("Failed to delete appointment: " + error.message);
      return;
    }

    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  // Filter based on tab
  const filteredAppointments = appointments.filter(
    (app) => app.status === selectedTab
  );

  return (
    <div className="bg-gray-100 relative">
      <Navbar />
      <div className="min-h-screen px-4 py-6 flex flex-col items-center mt-0">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {["Scheduled", "Rescheduled", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-4 py-2 rounded-full border font-medium ${
                selectedTab === tab
                  ? "bg-sky-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Appointments */}
        {loading ? (
          <p className="text-center text-gray-600">Loading appointments...</p>
        ) : filteredAppointments.length === 0 ? (
          <p className="text-center text-gray-600">
            No {selectedTab.toLowerCase()} appointments.
          </p>
        ) : (
          <div className="w-full max-w-md space-y-4">
            {filteredAppointments.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={app.photo}
                    alt={app.doctorName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-base sm:text-lg font-semibold">
                      {app.doctorName}
                    </h2>
                    <p className="text-sm text-gray-500">{app.specialty}</p>
                    <p className="text-sm">
                      {app.date} at {app.time}
                    </p>
                    <p className="text-xs text-gray-400">{app.location}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-2">
                  {app.status === "Cancelled" ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleDelete(app.id)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => handleReschedule(app.id)}
                      >
                        Reschedule
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-sm text-red-500 hover:underline"
                        onClick={() => handleCancel(app.id)}
                      >
                        Cancel
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">Cancel Appointment</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedId(null);
                }}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
