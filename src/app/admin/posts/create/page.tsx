import React from 'react'
import PostCreate from './PostCreate'
import { Metadata } from 'next';

const pageTitle = "Create new post";

export const metadata: Metadata = {
    title: pageTitle,
};

function Page() {
  return (
    <PostCreate pageTitle={pageTitle} />
  )
}

export default Page