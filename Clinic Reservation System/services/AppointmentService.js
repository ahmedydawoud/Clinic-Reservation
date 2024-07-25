import mongoose from "mongoose";
import { Patient } from "../models/patient.js"
import { Doctor } from "../models/doctor.js";
import { Slot } from "../models/slot.js";
import { Appointment } from "../models/appointment.js";

mongoose.model('Patient', Patient.schema);
mongoose.model('Doctor', Doctor.schema);
mongoose.model('Slot', Slot.schema);
mongoose.model('Appointment', Appointment.schema);

const AppointmentService = {
    async viewDocSlots(email) {
        try {
            const doctor = await Doctor.findOne({ email: email}).populate('slots');

            if (!doctor) {
                return 'Doctor doesn\'t exist';
            }

            const filteredSlots = doctor.slots.filter(slot => !slot.taken);
            
            return { slots: filteredSlots };

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createAppointment(email, doctorNumericId, slotNumericId) {
        try {

            const patient = await Patient.findOne({ email: email });
            const doctor = await Doctor.findOne({ numericId: doctorNumericId });
            const slot = await Slot.findOne({ numericId: slotNumericId });
            
            if (!patient || !doctor || !slot) {
                return { message: 'Patient, Doctor, or Slot not found' };
            }

            if (slot.taken) {
                return { message: 'Slot is already taken' };
            }
            slot.taken = true;
            await slot.save();

            const appointment = new Appointment({
                patient: patient._id,
                doctor: doctor._id,
                slot: slot._id,
            });
            
            await appointment.save();
            
            const populatedAppointment = await Appointment
            .findById(appointment._id)
            .populate({
                path: 'patient',
                select: 'name -_id',
            })
            .populate({
                path: 'doctor',
                select: 'name -_id',
            })
            .populate({
                path: 'slot',
                select: 'numericId startTime endTime -_id',
            });

            patient.appointments.push(appointment._id);
            await patient.save();
            
            return { message: 'Appointment created successfully', populatedAppointment };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async viewPatientApps(email) {
        try {
            
            const patient = await Patient.findOne({ email: email }).populate('appointments');
            
            if (!patient) {
            return { message: 'Patient not found' };
        }
        
        const appointments = patient.appointments;
        return { appointments };
    
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
,


    async cancelApp(email, appointmentId) {
        try {
            const patient = await Patient.findOne({ email: email });
    
            if (!patient) {
                return { message: 'Patient not found' };
            }

            const appointment = await Appointment.findOne({ numericId: appointmentId }).populate('slot');

            if (!appointment) {
                return { message: 'Appointment not found' };
            }
    
            appointment.slot.taken = false;
            await appointment.slot.save();

            await Appointment.findOneAndDelete({ numericId: appointmentId });
    
            patient.appointments = patient.appointments.filter(app => app.toString() !== appointmentId);
            await patient.save();
    
            
    
            return { message: 'Appointment canceled successfully' };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateAppDoctor(doctorNumericId, appointmentId) {
        try {
            const appointment = await Appointment.findOne({ numericId: appointmentId });
    
            if (!appointment) {
                return { message: 'Appointment not found' };
            }
    
            const newDoctor = await Doctor.findOne({ numericId: doctorNumericId });
    
            if (!newDoctor) {
                return { message: 'doctor not found' };
            }
    
            appointment.doctor = newDoctor._id;
    
            await appointment.save();

            return { message: 'Appointment doctor updated successfully', updatedAppointment: appointment};
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateAppSlot(slotId, appointmentId) {
        try {
            const appointment = await Appointment.findOne({ numericId: appointmentId });
    
            if (!appointment) {
                return { message: 'Appointment not found' };
            }
    
            const newSlot = await Slot.findOne({ numericId: slotId });
    
            if (!newSlot) {
                return { message: 'Slot not found' };
            }
            
            appointment.slot = newSlot._id;
    
            await appointment.save();

            return { message: 'Appointment slot updated successfully', updatedAppointment: appointment};
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    
};

export default AppointmentService;