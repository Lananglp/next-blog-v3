import React from 'react'
import Header from './header'
import Footer from './footer'
import BreadcrumbCustom from './breadcrumb-custom'

function Template({ children, container }: { children: React.ReactNode, container?: boolean }) {
  return (
    <div className="flex flex-col min-h-svh h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <svg className="absolute opacity-10 top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 stroke-zinc-500 dark:stroke-zinc-400 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="e813992c-7d03-4cc4-a2bd-151760b470a0" width={200} height={200} x="50%" y={-1} patternUnits="userSpaceOnUse">
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-zinc-200/30">
            <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth={0} />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
        </svg>
      </div>
      <div className="flex-grow">
        <Header />
        <div className='mt-8 px-4 max-w-7xl mx-auto'>
          <BreadcrumbCustom className='mb-4' />
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Template