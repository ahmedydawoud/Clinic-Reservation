import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Doctor } from "./models/doctor.js";
import  UserService  from './services/userService.js';
import scheduleService from "./services/scheduleService.js";
import AppointmentService from "./services/AppointmentService.js";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


app.get('/',(req,res)=>{
    console.log(req);
    return res.status(234).send("welcome");
});

mongoose
.connect('mongodb://localhost:27017/clinic-db')
.then(() => {
    console.log("Connected to the database");

    app.listen(8080, () => {
        console.log("Server is listening on port 8080");
    });
})
.catch((error) => {
    console.error(error);
});


    app.post('/signUpPatient', async (req, res) => {
    try {

        const {name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Invalid Data'});
        }

        const patient = await UserService.signUpPatient(name,email,password);
        return res.status(201).json(patient);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'couldnt sign up patient'});
    }
    });

    app.post('/signUpDoctor', async (req, res) => {
        try {
    
            const {name, email, password } = req.body;
    
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Invalid Data'});
            }
    
            const doctor = await UserService.signUpDoctor(name,email,password);
            return res.status(201).json(doctor);
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'couldnt sign up doctor'});
        }
        });

    app.post('/logInPatient',async(req,res)=>{
        try{
            const {email,password} = req.body;

            if(!email || !password)
            {
                return res.status(400).json({ error: 'Invalid Data'});
            }

            const result = await UserService.logInPatient(email,password);
            return res.status(201).json(result);
        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "couldnt log in patient"});
        }
    }
    );
    
    app.post('/logInDoctor',async(req,res)=>{
        try{
            const {email,password} = req.body;

            if(!email || !password)
            {
                return res.status(400).json({ error: 'Invalid Data'});
            }
            
            const result = await UserService.logInDoctor(email,password);
            return res.status(201).json(result);
        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "couldnt log in doctor"});
        }
    }
    );

    app.post('/insertSlot',async(req,res)=>{
        try{
            const {email,date,time} = req.body;
            if(!email || !date ||!time)
            {
                return res.status(400).json({ error: 'Invalid Data'});
            }

            const result = await scheduleService.insertSlot(email,date,time);
            return res.status(201).json(result);

        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "couldnt insert slot"});
        }
    })


    app.get('/viewDocSlots',async(req,res)=>{
        try{
            const { email } = req.query;
            if(!email)
            {
                return res.status(400).json({ error: 'Invalid Data'});
            }

            const result = await AppointmentService.viewDocSlots(email);
            return res.status(201).json(result);

        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "couldnt view available slots"});
        }
    })

    app.get('/viewPatientApps',async(req,res)=>{
        try{
            const {email} = req.query;
            if(!email)
            {
                return res.status(400).json({ error: 'Invalid Data'});
            }

            const result = await AppointmentService.viewPatientApps(email);
            return res.status(201).json(result);

        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "couldnt view available slots"});
        }
    })

    app.get('/viewDoctors',async(req,res)=>{
        try{
            const doctors = await Doctor.find({}).populate('slots');
            return res.status(201).json(doctors);
        }
        catch(error)
        {
            throw error;
        }
    })

    app.post('/makeApp',async(req,res)=>{
        try {

            const{email,doctorId,slotId}=req.query;
            if(!email || !doctorId || !slotId){

                return res.status(400).json({ error: 'Invalid Data'});
            }
            
            const result = await AppointmentService.createAppointment(email, doctorId, slotId);
            return res.status(201).json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json({error: "couldnt reserve Appointment"});
        }
    })

    app.put('/cancelAppointment',async(req,res)=>{
        try{
            const {email,appointmentId} = req.query;
            if(!email || !appointmentId)
            {
                return res.status(400).json({ error: 'Invalid Data'});
            }

            const result = await AppointmentService.cancelApp(email,appointmentId);
            return res.status(201).json(result);

        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "couldnt cancel appointment"});
        }
    })

    app.put('/updateAppDoctor',async(req,res)=>{
        try{
            const {doctorId,appointmentId} = req.query;
            if(!doctorId || !appointmentId)
            {
                return res.status(400).json({ error: 'Invalid Data'});
            }

            const result = await AppointmentService.updateAppDoctor(doctorId,appointmentId);
            return res.status(201).json(result);

        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "couldnt update doctor"});
        }
    })


    app.put('/updateAppSlot',async(req,res)=>{
        try{
            const {slotId,appointmentId} = req.query;
            if(!slotId || !appointmentId)
            {
                return res.status(400).json({ error: 'Invalid Data'});
            }

            const result = await AppointmentService.updateAppSlot(slotId,appointmentId);
            return res.status(201).json(result);

        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "couldnt update slot"});
        }
    })

    app.get('/docInfo',async(req,res)=>{
        try {
            const {email} = req.query;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            const result = await UserService.getDocInfo(email);
            return res.status(201).json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json({error: "couldnt update slot"});
        }
    })

    app.get('/PatientInfo',async(req,res)=>{
        try {
            const {email} = req.query;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            const result = await UserService.getPatientInfo(email);
            return res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "couldnt update slot"});
        }
    })
