import { Timestamp } from "bson";
import mongoose from "mongoose";
import { Appointment } from "./appointment.js";
const { Schema } = mongoose;

const patientSchema = mongoose.Schema(
    {

        numericId: {
            type: Number,
            unique: true,
        },
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
        },
        appointments: [{
            type: Schema.Types.ObjectId,
            ref: 'Appointment',
        }],
    },{
        timestamps:false,
}
);

patientSchema.pre('save', async function (next) {
    if (this.isNew) {
        const highestPatient = await this.constructor.findOne({}, {}, { sort: { numericId: -1 } });
        this.numericId = highestPatient ? highestPatient.numericId + 1 : 1;
    }

    next();
});

export const Patient = mongoose.model('patient',patientSchema);