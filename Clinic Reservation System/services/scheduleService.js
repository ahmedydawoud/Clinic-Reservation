import mongoose from "mongoose";
import { Patient } from "../models/patient.js"
import { Doctor } from "../models/doctor.js";
import { Slot } from "../models/slot.js";

const scheduleService = {
    async insertSlot(email,date,time) {
        try {
            const doctor = await Doctor.findOne({ email: email}).populate('slots');
            if (!doctor) {
                return 'Doctor doesn\'t exist';
            }

            const newSlot = new Slot({
                date:date,
                time:time,
                taken: false,
            });

            await newSlot.save();

            if (!doctor.slots) {
                doctor.slots = [];
            }

            doctor.slots.push(newSlot._id);
            await doctor.save();

            return doctor.slots;

        } catch (error) {
            throw error;
        }
    },

};

export default scheduleService;