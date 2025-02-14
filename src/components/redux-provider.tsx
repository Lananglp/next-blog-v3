'use client'
import { redux } from '@/lib/redux'
import { Provider } from 'react-redux'

interface Props {
    children: React.ReactNode
}

function ReduxProvider({ children }: Props) {
  return (
    <Provider store={redux}>
      {children}
    </Provider>
  )
}

export default ReduxProvider