import mongoose from "mongoose";
import { Slot } from "./slot.js";
import { Patient } from "./patient.js";
import { Doctor } from "./doctor.js";

const { Schema } = mongoose;

const appointmentSchema = new Schema({
    
    numericId: {
        type: Number,
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    slot: {
        type: Schema.Types.ObjectId,
        ref: 'Slot',
        required: true,
    },
});

appointmentSchema.pre('save', async function (next) {
    if (this.isNew) {
        const highestApp = await this.constructor.findOne({}, {}, { sort: { numericId: -1 } });
        this.numericId = highestApp ? highestApp.numericId + 1 : 1;
    }

    next();
});


export const Appointment = mongoose.model('Appointment', appointmentSchema);
