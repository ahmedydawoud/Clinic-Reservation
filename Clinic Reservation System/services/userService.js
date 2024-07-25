import mongoose from "mongoose";
import { Patient } from "../models/patient.js"
import { Doctor } from "../models/doctor.js";


const UserService = {
    
    async signUpPatient(name, email, password) {
        try {

        const PatientExists = await Patient.findOne({email: email});
        if(PatientExists)
        {
            return 'email already used';
        }
        
        const newPatient = new Patient({
            name:name,
            email: email,
            password: password,
        });

        const patient = await Patient.create(newPatient);
        return patient;

        } catch (error) {
            throw error;
        }
},

async signUpDoctor(name, email, password) {
    try {
        
        const DoctorExists = await Doctor.findOne({email: email});
        if(DoctorExists)
        {
            return 'email already used';
        }
        
        const newDoctor = new Doctor({
            name:name,
            email: email,
            password: password,
    });

    const doctor = await Doctor.create(newDoctor);
    return doctor;

    } catch (error) {
        throw error;
    }
},

async logInPatient(email, password) {
    try {
        const patient = await Patient.findOne({email: email});
        if(!patient)
        {
            return 'user not found';
        }
        const CorrectPassword = patient.password === password;
        if(!CorrectPassword)
        {
            return 'wrong password';
        }

        return 'login successful';
    
    } catch (error) {
        throw error;
    }
},

async logInDoctor(email, password) {
    try {
        const doctor = await Doctor.findOne({email: email});
        if(!doctor)
        {
            return 'user not found';
        }
        const CorrectPassword = doctor.password === password;
        if(!CorrectPassword)
        {
            return 'wrong password';
        }

        return 'login successful';
    
    } catch (error) {
        throw error;
    }
},

async getDocInfo(email)
{
    try {
        const doctorInfo = await Doctor.findOne({email: email});
    if (!doctorInfo) {
        return 'user not found';
    }

    return {
        name: doctorInfo.name,
        statusCode: 200,
    };
        
    } catch (error) {
        throw error;
    }
    
},
async getPatientInfo(email)
{
    try {
        const PatientInfo = await Patient.findOne({email: email});
    if (!PatientInfo) {
        return 'user not found';
    }

    return {
        name: PatientInfo.name,
        statusCode: 200,
    };

    } catch (error) {
        throw error;
    }
}

};
export default UserService;