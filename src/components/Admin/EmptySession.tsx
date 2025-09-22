import React from 'react'
import { TableIcon } from '../General/GeneralIcon'

export default function EmptySession() {
  return (
    <div className='w-full grid place-content-center min-h-[50vh]'>
            <div className="flex items-center gap-2 flex-col">
              <span><TableIcon /></span>
              <h2 className='text-xl'>No question session has been created yet</h2>
              <p className='text-balance text-center text-sm text-[#667185]'>Question session set on the platform would appear here </p>
            </div>
          </div>
  )
}
