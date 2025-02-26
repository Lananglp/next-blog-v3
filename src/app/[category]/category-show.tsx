import React from 'react'

type Props = {
    category: any;
};

function CategoryShow({ category }: Props) {
  return (
    <div className='max-w-3xl mx-auto my-8'>
        <div className='border-b border-template mb-4 pb-4'>
            <span className='inline-block mb-3'>Category :</span>
            <h1 className='mb-3 text-3xl font-bold text-black dark:text-white'>{category.name}</h1>
            <p className='leading-7'>Discover a variety of engaging and relevant content in this category, from informative articles and helpful guides to the latest insights that can broaden your knowledge.</p>
        </div>
        <div>
            <p>Posts related to this category :</p>
        </div>
    </div>
  )
}

export default CategoryShow