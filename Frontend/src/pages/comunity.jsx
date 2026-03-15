import React from 'react'
import Sidebar from '@/components/Sidebar'
import ComingSoon from '@/components/ComingSoon'

function comunity() {
  return (
    <div className='min-h-screen flex justify-center items-center dark:bg-black'>
        <Sidebar/>
        <ComingSoon message="Connect with different communities"/>
    </div>
  )
}

export default comunity