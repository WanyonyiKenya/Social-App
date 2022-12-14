import Post from '../models/Post.js'
import User from '../models/User.js'


//create function

export const createPost = async(req, res)=>{
    try{
        const {userId, description,picturePath}=req.body
        const user = await User.findById(userId)
        const newPost = new Post ({
            userId,
            firstName:  user.firstName,
            lastName:  user.lastName,
            location:  user.location,
            description,
            userPicturePath:  user.picturePath,
            picturePath,
            likes:  {},
            comments:  []
        })
        await newPost.save()

        const post = await Post.find()//allows all posts to be updated to the front-end

        res.status(201).json(post)

    } catch(err){
        res.status(409).json({message:err.message})
    }
}


//reading posts

export const getFeedPosts = async (req, res)=>{
    try{
        const post = await Post.find()

        res.status(200).json(post)

    } catch(err){
        res.status(408).json({message:err.message})
    }
}

export const getUserPosts = async (req,res)=>{
    try{
        const {userId} =req.params
        const post = await Post.find({userId})

        res.status(200).json(post)

    } catch(err){
        res.status(408).json({message:err.message})
    }
}

//updating posts

export const likePost = async(req,res)=>{
    try{
       const {id} = req.params
       const {userId} = req.body

       const post = await Post.findById(id)//grab post info
       const isLiked = post.likes.get(userId)//identify if user likes or not

       if(isLiked){
        post.likes.delete(userId)//if liked remove user from 
       } else {
        post.likes.set(userId,true)// if not liked like
       }

       const updatedPost = await Post.findByIdAndUpdate(
        id,
        {likes:post.like},
        {new:true}
       )

        res.status(200).json(updatedPost)

    } catch(err){
        res.status(409).json({message:err.message})
    }
}