const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);    
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

   
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/appointments', async (req, res) => {
  const { doctor, date, time, patient } = req.body;

  try {
    const newAppointment = new Appointment({ doctor, date, time, patient });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }); 
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/doctorappointments/:doctorId', async (req, res) => {
  const { doctorId } = req.params;

  try {
    
    const appointments = await Appointment.find({ doctor: doctorId }).populate('patient', 'name email'); // Populate patient details
    console.log(appointments);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this doctor' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
