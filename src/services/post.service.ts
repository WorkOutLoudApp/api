import { PrismaClient } from '@prisma/client'

const getPosts = async (userId: number) => {
    const prisma = new PrismaClient()
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: true,
                PostLike: true,
            },
            orderBy: {
                timestamp: 'desc',
            },
        })
        const formattedPosts = posts.map((post: any) => ({
            ...post,
            likes: post.PostLike?.length || 0,
            isLikedByUser: post.PostLike?.some((like : any) => like.userId === userId)
        }));
        return formattedPosts
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const addPost = async (userId: number, description: string, linkedRoutineId?: number) => {
    const prisma = new PrismaClient()
    try {
        const post = await prisma.post.create({
            data: {
                description,
                userId,
                ...(linkedRoutineId && { linkedRoutineId })
            },
            include: {
                user: true
            }
        })
        return post
    } catch (error) {
        console.log(error)
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const deletePost = async (userId: number, postId: number) => {
    const prisma = new PrismaClient();
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { userId: true },
        });

        if (!post) {
            throw new Error('Post not found');
        }

        if (post.userId !== userId) {
            throw new Error('You are not authorized to delete this post');
        }

        await prisma.postLike.deleteMany({
            where: { postId }
        })

        const deletedPost = await prisma.post.delete({
            where: { id: postId },
        });

        return deletedPost;
    } finally {
        await prisma.$disconnect();
    }
};

const likePost = async (userId: number, postId: number): Promise<any> => {
    const prisma = new PrismaClient()
    try {
        const existingLike = await prisma.postLike.findFirst({
            where: {
                userId,
                postId,
            },
        })

        if (existingLike) {
            await prisma.postLike.delete({
                where: {
                    id: existingLike.id,
                },
            })
            return {
                success: true,
                message: 'Post unliked successfully',
            }
        } else {
            const newLike = await prisma.postLike.create({
                data: {
                    postId,
                    userId,
                },
            })
            return {
                success: true,
                message: 'Post liked successfully',
            }
        }
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while liking/unliking the post',
        }
    } finally {
        await prisma.$disconnect()
    }
}


export default {
    getPosts,
    addPost,
    deletePost,
    likePost
}