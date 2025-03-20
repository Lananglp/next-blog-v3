import React from 'react'

function Footer() {

    const year = new Date().getFullYear();

    return (
        <footer className='py-8'>
            <div className='text-sm text-center text-zinc-500'>Copyright &copy; {year} My Blog. All Rights Reserved.</div>
        </footer>
    )
}

export default Footer