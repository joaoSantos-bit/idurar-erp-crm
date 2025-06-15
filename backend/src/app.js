const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');

// Opcional: caso use upload de arquivos
// const fileUpload = require('express-fileupload');

// create our Express app
const app = express();

const allowedOrigins = [
  'http://163.5.124.55',
  'http://163.5.124.55:80',
  'http://localhost:3000',
  'http://localhost:8888',
  'http://mhgestao.com.br',
  'http://www.mhgestao.com.br',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // permitir requisições sem origin (ex: mobile)
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// // default options
// app.use(fileUpload());

// Here our API Routes

app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// === SERVE FRONTEND IN PRODUCTION ===
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// SPA fallback (React Router)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });

// === ERROR HANDLERS ===
app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

module.exports = app;
