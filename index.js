const express = require('express');
const { router } = require('./src/routes');
const app = express();
const multer = require('multer');
const cors = require('cors')

const PORT = 4000;

const allowedOrigins = [
  'https://app.printfuse.in',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://192.168.0.142') || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  optionsSuccessStatus: 200,
};

// Set storage engine for multer
app.use("/uploads", express.static("uploads"));

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port:: ${PORT}`);
})