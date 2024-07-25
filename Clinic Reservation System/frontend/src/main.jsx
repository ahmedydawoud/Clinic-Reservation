import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import SignUp from './signup.jsx';
import Login from './login.jsx';
import Table from './doctortable.jsx';
import PatientTable from './patienttable.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/table" element={<Table />} />
      <Route path="/patient" element={<PatientTable />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

