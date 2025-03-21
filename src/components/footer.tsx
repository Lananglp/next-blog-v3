import React from 'react'

function Footer() {

    const year = new Date().getFullYear();
    const appName = process.env.NEXT_PUBLIC_APP_NAME

    return (
        <footer className='py-8'>
            <div className='text-xs text-center text-zinc-500'>Copyright &copy; {year} {appName}. All Rights Reserved.</div>
        </footer>
    )
}

export default Footer