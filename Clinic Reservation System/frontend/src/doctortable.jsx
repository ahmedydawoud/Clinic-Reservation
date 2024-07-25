import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


const Table = () => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [newSlotDate, setNewSlotDate] = useState('');
    const [newSlotTime, setNewSlotTime] = useState('');
    const { state } = useLocation();
    const email = state && state.email;


const fetchDoctorInfo = async () => {
    try {

    const doctorResponse = await fetch(`http://localhost:8080/docInfo?email=${email}`);
    const doctorResult = await doctorResponse.json();

    const slotsResponse = await fetch(`http://localhost:8080/viewDocSlots?email=${email}`);
    const slotsResult = await slotsResponse.json();

    if (doctorResponse.ok && slotsResponse.ok) {
        const mergedResult = { ...doctorResult, slots: slotsResult.slots };
        setDoctorInfo(mergedResult);
    } else {
        console.error('Failed to fetch doctor information');
    }
    } catch (error) {
    console.error('Error during doctor information fetch:', error);
    }
};


const handleInsertSlot = async () => {
    try {

    const response = await fetch('http://localhost:8080/insertSlot', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email,
        date: newSlotDate,
        time: newSlotTime,
    }),
});

    if (response.ok) {
    
    fetchDoctorInfo();
} else {
    console.error('Failed to insert a new slot:', response.statusText);
    }
} catch (error) {
    console.error('Error during slot insertion:', error);
}
};

useEffect(() => {
    fetchDoctorInfo();
}, [email]);

return (
    <div>
        {doctorInfo ? (
        <div>
        <h2 style={styles.heading}>Hello Doctor {doctorInfo.name}</h2>
        <p style={styles.subHeading}>My Slots</p>
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Time</th>
            </tr>
            </thead>
            <tbody>
                {doctorInfo.slots.map((slot) => (
                <tr key={slot.id}>
                    <td style={styles.td}>{slot.date}</td>
                    <td style={styles.td}>{slot.time}</td>
                </tr>
            ))}
            </tbody>
        </table>

        
        <div style={styles.insertSlot}>
            <h3 style={styles.subHeading}>Insert a Slot</h3>
            <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={styles.td}>
                    <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    style={styles.input}
                    />
                </td>
                <td style={styles.td}>
                    <input
                    type="time"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    style={styles.input}
                    />
                </td>
                </tr>
            </tbody>
            </table>
            <button type="button" onClick={handleInsertSlot} style={styles.button}>
            Submit
            </button>
        </div>
        </div>
    ) : (
        <p>Loading doctor information...</p>
    )}
    </div>
);
};

const styles = {
heading: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
},
subHeading: {
    fontSize: '18px',
    color: '#666',
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
insertSlot: {
    marginBottom: '20px',
},
input: {
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
};

export default Table;
