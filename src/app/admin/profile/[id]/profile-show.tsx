import React from 'react'

function ProfileShow() {

    return (
        <div className='max-w-3xl mx-auto'>
            <div className='w-full border border-template rounded-lg p-6'>
                <div className='flex gap-6'>
                    <div>
                        <div className='bg-zinc-900 w-48 h-48 rounded-full' />
                    </div>
                    <div className='space-y-4'>
                        <div className='border-b border-template pb-4 grid grid-cols-3 gap-2'>
                            <div className='text-center px-2'>
                                <p className='text-black dark:text-white'>24</p>
                                <p>Posts</p>
                            </div>
                            <div className='text-center px-2'>
                                <p className='text-black dark:text-white'>1.568</p>
                                <p>Followers</p>
                            </div>
                            <div className='text-center px-2'>
                                <p className='text-black dark:text-white'>296</p>
                                <p>Following</p>
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h1 className='text-xl font-semibold text-black dark:text-white'>Lanang Lanusa Putera</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati, unde! Labore deserunt porro natus harum assumenda sequi modi, odit deleniti alias temporibus, nisi iste incidunt, laborum excepturi? Eaque, ipsa adipisci?</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileShow