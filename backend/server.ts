import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
// import morgan from 'morgan';
import sequelize from './config/db';
import Project from './models/Project.model';
// Import models first
import User from './models/User.model';
import OTP from './models/OTP.model';
import Company from './models/Company.model';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';



// Import routes
import authRouter from './routes/auth.routes';
import dashboardRouter from './routes/dashboard.routes';
import companyRouter from './routes/company.routes';
import adminRouter from './routes/admin.routes';
import testerRouter from './routes/tester.routes';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));





// ✅ CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
//   optionsSuccessStatus: 200
// }));

app.use(cors({
  origin: true, // Allow all origins temporarily for testing
  credentials: true,
  optionsSuccessStatus: 200
}));

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
  const proto = req.headers['x-forwarded-proto'];
  const host = req.headers.host;

  if (
    process.env.NODE_ENV === 'production' &&
    proto !== 'https' &&
    host !== 'localhost:5000'
  ) {
    return res.redirect(`https://${host}${req.url}`);
  }
  next();
});

// Security middleware (commented out for development)
// app.use(helmet());
// app.use(morgan('combined'));
app.set('trust proxy', 1); // or true

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'data:', "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:', 'https:', 'fonts.gstatic.com', 'fonts.googleapis.com'],
      connectSrc: ["'self'", 'https:', 'wss:'],
    },
  })
);

// Custom Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-UA-Compatible', 'IE=edge');
  res.setHeader('Connection', 'keep-alive');
  next();
});


// ✅ Define Model Associations
const defineAssociations = () => {
  try {
    User.hasOne(Company, {
      foreignKey: 'userId',
      as: 'company',
      onDelete: 'CASCADE'
    });
    Company.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // User-Project (Client)
    Project.belongsTo(User, {
      foreignKey: 'clientId',
      as: 'client'
    });
    User.hasMany(Project, {
      foreignKey: 'clientId',
      as: 'clientProjects'
    });

    // User-Project (Tester)
    Project.belongsTo(User, {
      foreignKey: 'testerId',
      as: 'tester'
    });
    User.hasMany(Project, {
      foreignKey: 'testerId',
      as: 'testerProjects'
    });

    // User-OTP
    User.hasMany(OTP, {
      foreignKey: 'userId',
      as: 'otps',
      onDelete: 'CASCADE'
    });
    OTP.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });

    console.log('✅ Model associations defined successfully');
  } catch (error) {
    console.error('❌ Error defining model associations:', error);
    throw error;
  }
};

// ✅ Health check endpoint
if (process.env.NODE_ENV === 'development') {
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    });
  });
} else {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' }); // minimal info in production
  });
}


// 🔐 Rate limiter to prevent OTP brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many OTP attempts. Please try again after 15 minutes.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false   // Disable the `X-RateLimit-*` headers
});

// ✅ API Routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/company', companyRouter);
app.use('/api/companies', adminRouter);
app.use('/api/tester', testerRouter);


// 🔒 Development-only root route
if (process.env.NODE_ENV === 'development') {
  app.get('/', (req, res) => {
    res.json({
      message: 'BCBUZZ API Server',
      version: '1.0.0',
      endpoints: ['/health', '/api/auth', '/api/dashboard', '/api/company']
    });
  });
}

// ✅ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    error: 'NOT_FOUND'
  });
});


// ✅ Database connection and server startup
const startServer = async () => {
  try {
    console.log('🔄 Starting server...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Define model associations
    defineAssociations();

    // Sync database models
    await sequelize.sync({
      alter: process.env.NODE_ENV === 'development',
      force: false
    });
    console.log('✅ Database synced successfully');



    // Start server
    const PORT = Number(process.env.PORT) || 5000;

    const server = app.listen(PORT, '0.0.0.0', () => {
      const BASE_URL = process.env.NODE_ENV === 'production'
        ? `https://cyber.bcbuzz.io`
        : `http://localhost:${PORT}`;

      console.log(`🚀 Server running on ${BASE_URL}`);
      console.log(`📊 Health check: ${BASE_URL}/health`);
      console.log(`🔗 API Base URL: ${BASE_URL}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

// ✅ Graceful shutdown handlers
const gracefulShutdown = async (signal: string) => {
  console.log(`📛 ${signal} received, shutting down gracefully...`);
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();