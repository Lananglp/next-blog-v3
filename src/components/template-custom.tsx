import React from 'react'
import Header from './header'
import Footer from './footer'

function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-svh h-screen">
        <div>
            <Header />
        </div>
        <div className="flex-grow">
          {children}
        </div>
        <div>
            <Footer />
        </div>
    </div>
  )
}

export default Template