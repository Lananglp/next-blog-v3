import React from 'react'
import Users from './Users'
import { Metadata } from 'next';

const pageTitle = "Manage Users";

export const metadata: Metadata = {
    title: pageTitle,
};

function Page() {
    return (
        <div><Users pageTitle={pageTitle} /></div>
    )
}

export default Page