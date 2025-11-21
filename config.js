    module.exports = {
        port: process.env.PORT || 5000,
        db: process.env.MONGODB_URI || "mongodb+srv://fdgo9910_db_user:Fabi.123@fabian.pmm8y8v.mongodb.net/?appName=Fabian",
        JWT_SECRET: process.env.JWT_SECRET || 'tu_super_secreto_jwt',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
        NODE_ENV: process.env.NODE_ENV || 'development'
    }