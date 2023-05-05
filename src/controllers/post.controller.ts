import { NextFunction, Request, RequestHandler, Response } from 'express'
import postService from '@src/services/post.service'

export const getPosts: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})
        const posts = await postService.getPosts(userId)
        if (!posts) return res.status(400).json({message: 'Error getting posts'})
        return res.json(posts)
    } catch (err) {
        return next(err)
    }
}

export const addPost: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})

        const { description, linkedRoutine } = req.body
        if (!description) return res.status(400).json({message: 'Missing "description"'})

        const posts = await postService.addPost(userId, description, linkedRoutine)
        if (!posts) return res.status(400).json({message: 'Error adding post'})
        return res.json(posts)
    } catch (err) {
        return next(err)
    }
}

export const deletePost: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})

        const { id } = req.params

        const posts = await postService.deletePost(userId, parseInt(id, 10))
        if (!posts) return res.status(400).json({message: 'Error adding post'})
        return res.json(posts)
    } catch (err) {
        return next(err)
    }
}

export const likePost: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})

        const { id } = req.params

        const posts = await postService.likePost(userId, parseInt(id, 10))
        if (!posts) return res.status(400).json({message: 'Error liking post'})
        return res.json(posts)
    } catch (err) {
        return next(err)
    }
}