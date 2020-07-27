const express = require('express');
const cors = require('cors')
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', testimonialsRoutes); // add testimonials routes to server
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
})

// connects backend code with the database

// It doesnt work. Why?
// if(process.env.NODE_ENV === 'production'){
//   mongoose.connect('mongodb+srv://${process.env.login}:${process.env.password}@cluster0.iegdp.gcp.mongodb.net/NewWaveDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log('process production');
// } else {
//   mongoose.connect('mongodb://localhost:27017/NewWaveDB', { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log('process test');
// }
// console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// const dbURI = (process.env.NODE_ENV === 'production' ? 'mongodb+srv://$${process.env.login}:${process.env.password}@cluster0.iegdp.gcp.mongodb.net/NewWaveDB?retryWrites=true&w=majority' : 'mongodb://localhost:27017/NewWaveDB');
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

let NW = new aws.NW({
  accessLogin: process.env.NW_login,
  accessPass: process.env.NW_password
});

mongoose.connect(`mongodb+srv://${process.env.NW_login}:${process.env.NW_password}@cluster0.iegdp.gcp.mongodb.net/NewWaveDB?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));


const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);
io.on('connection', (socket) => {
  console.log('New socket!');
});

module.exports = server;