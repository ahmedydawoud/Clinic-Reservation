import mongoose from "mongoose";

const slotSchema = mongoose.Schema(
{
    numericId: {
        type: Number,
    },
    date:{
        type:String,
        required:true,
    },
    time:{
        type:String,
        required:true,
    }
    ,
    taken:{
        type:Boolean,
        required:true,
    },
},
{
    timestamps: false,
}
);

slotSchema.pre('save', async function (next) {
    if (this.isNew) {
        const highestSlot = await this.constructor.findOne({}, {}, { sort: { numericId: -1 } });
        this.numericId = highestSlot ? highestSlot.numericId + 1 : 1;
    }

    next();
});


export const Slot = mongoose.model('Slot', slotSchema);
