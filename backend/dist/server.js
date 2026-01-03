"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// import morgan from 'morgan';
const db_1 = __importDefault(require("./config/db"));
const Project_model_1 = __importDefault(require("./models/Project.model"));
// Import models first
const User_model_1 = __importDefault(require("./models/User.model"));
const OTP_model_1 = __importDefault(require("./models/OTP.model"));
const Company_model_1 = __importDefault(require("./models/Company.model"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const tester_routes_1 = __importDefault(require("./routes/tester.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ✅ Middlewares
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ✅ CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
//   optionsSuccessStatus: 200
// }));
app.use((0, cors_1.default)({
    origin: 'https://cyber.bcbuzz.io',
    credentials: true,
    optionsSuccessStatus: 200
}));
// ✅ Parse cookies
app.use((0, cookie_parser_1.default)());
// ✅ Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
    const proto = req.headers['x-forwarded-proto'];
    const host = req.headers.host;
    if (process.env.NODE_ENV === 'production' &&
        proto !== 'https' &&
        host !== 'localhost:5000') {
        return res.redirect(`https://${host}${req.url}`);
    }
    next();
});
// Security middleware (commented out for development)
// app.use(helmet());
// app.use(morgan('combined'));
app.set('trust proxy', 1); // or true
app.use((0, helmet_1.default)());
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", 'https:', 'data:', "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'data:', 'https:', 'fonts.gstatic.com', 'fonts.googleapis.com'],
        connectSrc: ["'self'", 'https:', 'wss:'],
    },
}));
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
        User_model_1.default.hasOne(Company_model_1.default, {
            foreignKey: 'userId',
            as: 'company',
            onDelete: 'CASCADE'
        });
        Company_model_1.default.belongsTo(User_model_1.default, {
            foreignKey: 'userId',
            as: 'user'
        });
        // User-Project (Client)
        Project_model_1.default.belongsTo(User_model_1.default, {
            foreignKey: 'clientId',
            as: 'client'
        });
        User_model_1.default.hasMany(Project_model_1.default, {
            foreignKey: 'clientId',
            as: 'clientProjects'
        });
        // User-Project (Tester)
        Project_model_1.default.belongsTo(User_model_1.default, {
            foreignKey: 'testerId',
            as: 'tester'
        });
        User_model_1.default.hasMany(Project_model_1.default, {
            foreignKey: 'testerId',
            as: 'testerProjects'
        });
        // User-OTP
        User_model_1.default.hasMany(OTP_model_1.default, {
            foreignKey: 'userId',
            as: 'otps',
            onDelete: 'CASCADE'
        });
        OTP_model_1.default.belongsTo(User_model_1.default, {
            foreignKey: 'userId',
            as: 'user'
        });
        console.log('✅ Model associations defined successfully');
    }
    catch (error) {
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
}
else {
    app.get('/api/health', (req, res) => {
        res.json({ status: 'OK' }); // minimal info in production
    });
}
// 🔐 Rate limiter to prevent OTP brute-force attacks
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many OTP attempts. Please try again after 15 minutes.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});
// ✅ API Routes
app.use('/api/auth/verify-otp', authLimiter);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/company', company_routes_1.default);
app.use('/api/companies', admin_routes_1.default);
app.use('/api/tester', tester_routes_1.default);
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
        await db_1.default.authenticate();
        console.log('✅ Database connection established successfully');
        // Define model associations
        defineAssociations();
        // Sync database models
        await db_1.default.sync({
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
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
            }
            else {
                console.error('❌ Server error:', error);
            }
            process.exit(1);
        });
    }
    catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};
// ✅ Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
    console.log(`📛 ${signal} received, shutting down gracefully...`);
    try {
        await db_1.default.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    }
    catch (error) {
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
