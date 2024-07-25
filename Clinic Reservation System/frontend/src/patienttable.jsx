import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';



const PatientTable = () => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [updateDoctorId, setUpdateDoctorId] = useState(null);
  const [updateSlotId, setUpdateSlotId] = useState(null);
  const { state } = useLocation();
  const email = state && state.email;

  const fetchPatientInfo = async () => {
    try {
      const patientResponse = await fetch(`http://localhost:8080/PatientInfo?email=${email}`);
      const patientResult = await patientResponse.json();

      const appointmentsResponse = await fetch(`http://localhost:8080/viewPatientApps?email=${email}`);
      const appointmentsResult = await appointmentsResponse.json();

      const doctorsResponse = await fetch('http://localhost:8080/viewDoctors');
      const doctorsResult = await doctorsResponse.json();

      if (patientResponse.ok && appointmentsResponse.ok && doctorsResponse.ok) {
        setPatientInfo({ ...patientResult, appointments: appointmentsResult.appointments });
        setDoctors(doctorsResult);
      } else {
        console.error('Failed to fetch patient information');
      }
    } catch (error) {
      console.error('Error during patient information fetch:', error);
    }
  };

  const handleMakeAppointment = async () => {
    try {
      const url = `http://localhost:8080/makeApp?email=${email}&doctorId=${selectedDoctorId}&slotId=${selectedSlotId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchPatientInfo();
      } else {
        console.error('Failed to make an appointment:', response.statusText);
      }
    } catch (error) {
      console.error('Error during appointment creation:', error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8080/cancelAppointment?email=${email}&appointmentId=${appointmentId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchPatientInfo();
      } else {
        console.error('Failed to cancel the appointment:', response.statusText);
      }
    } catch (error) {
      console.error('Error during appointment cancellation:', error);
    }
  };

  const handleUpdateDoctor = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8080/updateAppDoctor?doctorId=${updateDoctorId}&appointmentId=${appointmentId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchPatientInfo();
      } else {
        console.error('Failed to update the appointment doctor:', response.statusText);
      }
    } catch (error) {
      console.error('Error during updating appointment doctor:', error);
    }
  };

  const handleUpdateSlot = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8080/updateAppSlot?slotId=${updateSlotId}&appointmentId=${appointmentId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchPatientInfo();
      } else {
        console.error('Failed to update the appointment slot:', response.statusText);
      }
    } catch (error) {
      console.error('Error during updating appointment slot:', error);
    }
  };

  useEffect(() => {
    fetchPatientInfo();
  }, [email]);

  return (
    <div style={styles.container}>
      {patientInfo ? (
        <div>
          <h2 style={styles.heading}>Hello Patient {patientInfo.name}</h2>

          <div style={styles.section}>
            <h3>My Appointments</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Doctor</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patientInfo.appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td style={styles.td}>{appointment.slot.date}</td>
                    <td style={styles.td}>{appointment.slot.time}</td>
                    <td style={styles.td}>{appointment.doctor.name}</td>
                    <td style={styles.td}>
                      <button type="button" onClick={() => handleCancelAppointment(appointment.numericId)}>
                        Cancel
                      </button>
                      <label style={styles.label}>
                        Select a Doctor:
                        <select onChange={(e) => setUpdateDoctorId(e.target.value)} value={updateDoctorId || ''}>
                          <option value="" disabled>Select a Doctor</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.numericId} value={doctor.numericId}>
                              {doctor.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button onClick={() => handleUpdateDoctor(appointment.numericId)} style={styles.button}>
                        Update Doctor
                      </button>
                      <label style={styles.label}>
                        Select a Slot:
                        <select onChange={(e) => setUpdateSlotId(e.target.value)} value={updateSlotId || ''}>
                          <option value="" disabled>Select a Slot</option>
                          
                          {doctors
                            .find((doctor) => doctor.numericId === Number(selectedDoctorId))
                            ?.slots.map((slot) => (
                              <option key={slot.numericId} value={slot.numericId}>
                                {`${slot.date} - ${slot.time}`}
                              </option>
                            ))}
                        </select>
                      </label>
                      <button onClick={() => handleUpdateSlot(appointment.numericId)} style={styles.button}>
                        Update Slot
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.section}>
            <h3 style={styles.subHeading}>Make an Appointment</h3>
            <label style={styles.label}>
              Select a Doctor:
              <select onChange={(e) => setSelectedDoctorId(e.target.value)} value={selectedDoctorId || ''}>
                <option value="" disabled>Select a Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.numericId} value={doctor.numericId}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label style={styles.label}>
              Select a Slot:
              <select onChange={(e) => setSelectedSlotId(e.target.value)} value={selectedSlotId || ''}>
                <option value="" disabled>Select a Slot</option>
                {doctors
                  .find((doctor) => doctor.numericId === Number(selectedDoctorId))
                  ?.slots.map((slot) => (
                    <option key={slot.numericId} value={slot.numericId}>
                      {`${slot.date} - ${slot.time}`}
                    </option>
                  ))}
              </select>
            </label>
            <br />
            <button type="button" onClick={handleMakeAppointment} style={styles.button}>
              Make Appointment
            </button>
          </div>
        </div>
      ) : (
        <p>Loading patient information...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
  },
  section: {
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    background: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  select: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
  },
  button: {
    background: '#4CAF50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  subHeading: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '10px',
  },
};

export default PatientTable;
