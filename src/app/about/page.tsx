import Template from '@/components/template-custom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'
import React from 'react'

function page() {
  return (
    <Template>
        <h6>About</h6>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You&apos;re on the about page but this page is still in maintenance.
        </AlertDescription>
      </Alert>
    </Template>
  )
}

export default page