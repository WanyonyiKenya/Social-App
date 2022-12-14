import  express from 'express'
import { get } from 'mongoose'
import {
    getFeedPosts,
    getUserPosts,
    likePost
} from '../controllers/post.js'
import { verifyToken } from '../middleware/auth.js'


const router = express.Router()


//reading data

router.get('/', verifyToken, getFeedPosts) 
router.get('/:userId/posts', verifyToken, getUserPosts)//grabs only one  user post

//updating
router.patch('/:id/like', verifyToken, likePost)//liking and unliking posts

export default router