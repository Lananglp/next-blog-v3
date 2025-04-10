import React from 'react'
import PostsClient from './PostsClient'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Blog",
    description: "Explore our blog for the latest updates and insights.",
};

function Page() {
    return (
        <PostsClient />
    )
}

export default Page