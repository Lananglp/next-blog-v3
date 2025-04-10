'use client'
import { usePageTitle } from '@/hooks/use-page-title';
import { UserProfileType, UserType } from '@/types/userType'
import React from 'react'

interface ProfileShowProps {
    user: UserType<UserProfileType>;
};

function ProfileShow({ user }: ProfileShowProps) {

    usePageTitle(`Profile ${user.username}`);

    return (
        <div>
            <div className='max-w-3xl p-6'>
                <div className='flex gap-6'>
                    <div>
                        <div className='bg-zinc-900 w-48 h-48 rounded-full' />
                    </div>
                    <div className='w-full space-y-4'>
                        <div className='border-b border-template pb-4 grid grid-cols-3 gap-2'>
                            <div className='text-center px-2'>
                                <p className='text-black dark:text-white'>{user.totalPosts}</p>
                                <p>Posts</p>
                            </div>
                            <div className='text-center px-2'>
                                <p className='text-black dark:text-white'>{user.totalFollowers}</p>
                                <p>Followers</p>
                            </div>
                            <div className='text-center px-2'>
                                <p className='text-black dark:text-white'>{user.totalFollowing}</p>
                                <p>Following</p>
                            </div>
                        </div>
                        <div className='space-y-3'>
                            <div>
                                <h1 className='text-xl font-semibold text-black dark:text-white'>{user.name}</h1>
                                <p>@{user.username}</p>
                            </div>
                            <p>{user.profile?.bio}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileShow