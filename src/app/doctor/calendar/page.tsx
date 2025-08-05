'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './calendarStyles.css';

interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  status: string;
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All'); // Dropdown filter

  useEffect(() => {
    fetchAppointments();

    // Real-time Sync
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointmentlist' },
        () => fetchAppointments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAppointments = async () => {
    const { data: doctorProfile } = await supabase
      .from('doctorslist')
      .select('id')
      .eq('name', 'Dr. Raj Singh')
      .single();

    if (!doctorProfile) return;

    const { data } = await supabase
      .from('appointmentlist')
      .select('id, patient_name, date, status')
      .eq('doctor_id', doctorProfile.id);

    setAppointments(data || []);
  };

  const handleEventDrop = async (info: any) => {
    const { error } = await supabase
      .from('appointmentlist')
      .update({ date: info.event.startStr, status: 'Rescheduled' })
      .eq('id', info.event.id);

    if (error) {
      alert('Error updating appointment date');
      info.revert();
    } else {
      fetchAppointments();
    }
  };

  const handleCancel = async (id: string) => {
    await supabase
      .from('appointmentlist')
      .update({ status: 'Cancelled' })
      .eq('id', id);
    fetchAppointments();
  };

  const handleDelete = async (id: string) => {
    await supabase
      .from('appointmentlist')
      .delete()
      .eq('id', id);
    fetchAppointments();
  };

  // Filtered Appointments
  const filteredAppointments =
    statusFilter === 'All'
      ? appointments
      : appointments.filter((app) => app.status === statusFilter);

  return (
    <div>

      {/* Dropdown Filter */}
      <div className="mb-6">
        <label className="mr-3 font-semibold">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="All">All</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Rescheduled">Rescheduled</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
     <div className="mx-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden"
           style={{ width: '700px', height: '700px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridDay,dayGridWeek,dayGridMonth',
        }}
        events={filteredAppointments.map((app) => ({
          id: app.id,
          title: app.patient_name,
          date: app.date,
          backgroundColor:
            app.status === 'Rescheduled'
              ? '#facc15'
              : app.status === 'Cancelled'
              ? '#ef4444'
              : app.status === 'Completed'
              ? '#10b981'
              : '#3b82f6',
          borderColor:
            app.status === 'Rescheduled'
              ? '#facc15'
              : app.status === 'Cancelled'
              ? '#ef4444'
              : app.status === 'Completed'
              ? '#10b981'
              : '#3b82f6',
          textColor: 'white',
          extendedProps: { status: app.status },
        }))}
        eventDrop={handleEventDrop}
        eventDidMount={(info) => {
          const { title, id } = info.event;
          const status = info.event.extendedProps.status;

          // Tooltip with Cancel & Delete for Cancelled
          tippy(info.el, {
            content: `
              <div style="text-align:left;">
                <strong>${title}</strong><br/>
                Status: ${status}<br/>
                Date: ${info.event.startStr}<br/>
                ${
                  status === 'Cancelled'
                    ? `<button id="delete-${id}" 
                        style="margin-top:5px;background:black;color:white;padding:2px 6px;border:none;border-radius:3px;cursor:pointer;">
                        ❌ Delete
                      </button>`
                    : `<button id="cancel-${id}" 
                        style="margin-top:5px;background:red;color:white;padding:2px 6px;border:none;border-radius:3px;cursor:pointer;">
                        Cancel
                      </button>`
                }
              </div>
            `,
            allowHTML: true,
            interactive: true,
            onShown(instance) {
              if (status === 'Cancelled') {
                const deleteBtn = document.getElementById(`delete-${id}`);
                if (deleteBtn) {
                  deleteBtn.addEventListener('click', () => {
                    handleDelete(id);
                    instance.hide();
                  });
                }
              } else {
                const cancelBtn = document.getElementById(`cancel-${id}`);
                if (cancelBtn) {
                  cancelBtn.addEventListener('click', () => {
                    handleCancel(id);
                    instance.hide();
                  });
                }
              }
            },
          });
        }}
      />
    </div>
    </div>
  );
}
