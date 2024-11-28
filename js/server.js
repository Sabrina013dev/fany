require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Appointment = require('./models/Appointment');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/appointments', { useNewUrlParser: true, useUnifiedTopology: true });

// Rotas
app.get('/available-times', async (req, res) => {
  const { date } = req.query;
  const bookedTimes = await Appointment.find({ date }).select('time');
  const allTimes = ['09:00', '10:00', '11:00','12:00','13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const availableTimes = allTimes.filter(time => !bookedTimes.some(booking => booking.time === time));
  res.json(availableTimes);
});

app.post('/appointments', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).send('Agendamento criado.');
  } catch (error) {
    res.status(500).send('Erro ao criar agendamento.');
  }
});

// Email Report 
cron.schedule('0 20 * * *', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await Appointment.find({ date: tomorrow.toISOString().split('T')[0] });
  const services = {
    Manicure: appointments.filter(a => a.services.includes('Manicure')),
    Cabeleireira: appointments.filter(a => a.services.includes('Cabeleireira')),
  };

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: 'sabrinaoliveira.programadora@gmail.com', pass: 'ulsm svrg xlpt yaxc' },
  });

  //Conexão com o Mongo
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Conectado ao MongoDB');
  }).catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
  
  for (const [service, appointments] of Object.entries(services)) {
    const html = `<h1>Relatório de Agendamentos</h1>
      <p>Serviço: ${service}</p>
      <ul>${appointments.map(a => `<li>${a.name} - ${a.time} - WhatsApp: ${a.whatsapp}</li>`).join('')}</ul>`;
    await transporter.sendMail({
      to: 'adriannali@bol.com.br',
      subject: `Agendamentos para ${service} - ${tomorrow.toDateString()}`,
      html,
    });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
