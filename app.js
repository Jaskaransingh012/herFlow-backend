const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const stepRoutes = require('./routes/step.routes');
const cycleRoutes = require('./routes/cycle.routes');
const errorHandler = require('./utils/errorHandler');
const chatRoutes = require('./routes/chat.routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/steps', stepRoutes);
app.use('/api/v1', cycleRoutes);
app.use('/api/chat', chatRoutes);
app.use(errorHandler);
module.exports = app;