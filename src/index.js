import React from 'react';
import ReactDOM from 'react-dom/client';
import { sampleAppointments, sampleAvailableTimeSlots } from './sampleData';
import { AppointmentForm } from './AppointmentForm';

ReactDOM
    .createRoot(document.getElementById("root"))
    .render(
        <AppointmentForm
        original={{}}
        availableTimeSlots={sampleAvailableTimeSlots}
        appointments={sampleAppointments}
        onSubmit={() => {}}
      />
    );