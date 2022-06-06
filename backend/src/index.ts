import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import cors from 'cors'
import mongoose from 'mongoose'
import routes from './routes'

declare module 'express-session' {
    export interface Session {
        userId?: string
    }
}

//Add Env
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SECRET: string,
            DATABASE_URL: string,
            DEVELOPMENT: string
        }
    }
}

dotenv.config()

const PORT = process.env.PORT || 4000

const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())

app.use(session({
    name: "sid",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.DEVELOPMENT ? false : true, 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
    }
}))

app.use(routes)


//Connect to DB
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

