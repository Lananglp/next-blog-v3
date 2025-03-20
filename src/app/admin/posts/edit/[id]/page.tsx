import React from 'react'
import { Metadata } from 'next';
import PostEdit from './PostEdit';
import prisma from '@/lib/prisma';
import { initialPost, PostType } from '@/types/post-type';
import { notFound } from 'next/navigation';

const pageTitle = "Edit your post";

export const metadata: Metadata = {
    title: pageTitle,
};

interface PostEditProps {
    params: Promise<{ id: string }>;
}

async function Page({ params }: PostEditProps) {

    const id = (await params).id;

    const post = await prisma.post.findFirst({
        where: {
            id: {
                equals: id,
            },
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    followers: {
                        select: {
                            followerId: true,
                            follower: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    following: {
                        select: {
                            followedId: true,
                            followed: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    }
                },
            },
            categories: {
                select: {
                    category: true,
                },
            },
        },
    });

    const formattedPost: PostType = {
        ...post || initialPost,
        categories: post?.categories.map((cat) => cat.category) || [],
        meta: {
            title: (post?.meta as { title?: string })?.title || "",
            description: (post?.meta as { description?: string })?.description || "",
            keywords: (post?.meta as { keywords?: string[] })?.keywords || [],
            ogImage: (post?.meta as { ogImage?: string })?.ogImage || "",
        },
    };

    if (!post) {
        return notFound();
    }

    return (
        <PostEdit pageTitle={pageTitle} post={formattedPost} />
    )
}

export default Page