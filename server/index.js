import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from  'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'


import {register} from './controllers/auth.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import {createPost} from './controllers/post.js'
import postRoutes  from'./routes/post.js'
import { verifyToken } from './middleware/auth.js'
import User from './models/User.js'
import Post from './models/Post.js'

import { users, posts } from './data/index.js'

// CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}))
app.use(cors())
app.use('/assets',express.static(path.join(__dirname,'public/assets')))//sets the directory of where we keep our assets like images.

// FILESTORAGE CONFIG

const storage = multer.diskStorage({
 destination: function(req,file,cb){
        cb(null,'public/assets')//saves files here
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload = multer({storage}) //enables us store file uploads


//File Router
app.post('/auth/register', upload.single('picture'),register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)


//main router
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

//MONGOOSE SETUP

const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT, ()=> console.log(`The Server port is : ${PORT}`))
    

    //adds exported data one time
    //  User.insertMany(users)
    //  Post.insertMany(posts)
})
.catch((error)=> console.log(`${error} the server requested did not connect`))

