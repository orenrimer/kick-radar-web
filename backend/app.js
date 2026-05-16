const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('ws');

const eventsRoutes = require('./routes/events-routes');
const usersRoutes = require('./routes/users-routes');
const fixturesRoutes = require('./routes/fixtures-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(express.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });
const connectedClients = [];

const broadcastNotification = (notification) => {
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
};

const requestsRoutes = require('./routes/requests-routes')(broadcastNotification);

app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/fixtures', fixturesRoutes);

app.use((req, res, next) => {
  next(new HttpError('Could not find this route.', 404));
});

app.use((error, req, res, next) => {
  if (req.file?.path) {
    fs.unlink(req.file.path, () => {});
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fubu1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => {
    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        connectedClients.push(ws);

        ws.on('close', () => {
          const index = connectedClients.indexOf(ws);
          if (index !== -1) {
            connectedClients.splice(index, 1);
          }
        });
      });
    });

    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
