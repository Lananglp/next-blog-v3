import React from 'react'
import { Metadata } from 'next';
import Profile from './Profile';

const pageTitle = "Manage your Profile";

export const metadata: Metadata = {
    title: pageTitle,
};

function Page() {
    return (
        <div><Profile /></div>
    )
}

export default Page