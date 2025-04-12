import React from 'react'
import { Metadata } from 'next';
import ErrorPageTemplate from '@/components/page/error-page-template';

const pageTitle = "The URL accessed is invalid";

export const metadata: Metadata = {
    title: pageTitle,
};

function Page() {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000";

    return (
        <ErrorPageTemplate
            templateFor='admin'
            statusCode={400}
            title="The URL accessed is invalid"
            description="To get profile information, the correct url format is :"
        >
            <code>{baseUrl}/profile/<span className='bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white px-2'>username</span></code>
        </ErrorPageTemplate>
    )
}

export default Page