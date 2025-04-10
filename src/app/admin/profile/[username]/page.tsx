import React from 'react'
import ProfileShow from './profile-show'
import prisma from '@/lib/prisma'
import { initialUser, initialUserProfile, UserProfileType, UserType } from '@/types/userType'
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const username = (await params).username;

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return {
            title: "User Not Found",
            description: "The requested user does not exist.",
        };
    }

    return {
        title: `Profile ${user.username}`,
    };
}

export default async function Page({ params }: PageProps) {
    const username = (await params).username;

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            _count: {
                select: {
                    posts: true,
                    followers: true,
                    following: true,
                },
            },
            profile: {
                omit: {
                    id: true,
                    userId: true,
                }
            }
        }
    });

    const formattedUser: UserType<UserProfileType> = {
        ...user || initialUser,
        image: user?.image || "",
        imageId: user?.imageId || "",
        totalPosts: user?._count.posts || 0,
        totalFollowers: user?._count.followers || 0,
        totalFollowing: user?._count.following || 0,
        profile: user?.profile || initialUserProfile,
    }

    if (!user) {
        return <div>User not found</div>
    }

    return <ProfileShow user={formattedUser} />
}
