export type RepliesType = {
    id: string,
    postId: string,
    parentId: string,
    content: string,
    author: {
        id: string,
        name: string,
        image: string,
    },
    likes: {
        commentId: string,
        userId: string,
    }[],
    replies: [],
    replyToUser: {
        id: string,
        name: string,
        image: string,
    },
    replyToUserId: string,
    createdAt: Date,
    updatedAt: Date,
}