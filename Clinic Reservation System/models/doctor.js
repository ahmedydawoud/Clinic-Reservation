import { Timestamp } from "bson";
import mongoose from "mongoose";
import { Slot } from "./slot.js";

const doctorSchema = mongoose.Schema(
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
        slots: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Slot'
        }],

    },{
        timestamps:false,
}
);
doctorSchema.pre('save', async function (next) {
    if (this.isNew) {
        const highestDoctor = await this.constructor.findOne({}, {}, { sort: { numericId: -1 } });
        this.numericId = highestDoctor ? highestDoctor.numericId + 1 : 1;
    }

    next();
});

export const Doctor = mongoose.model('doctor',doctorSchema);