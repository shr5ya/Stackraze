import React from 'react'
import Sidebar from '@/components/Sidebar'
import ComingSoon from '@/components/ComingSoon'

function newsLetters() {
  return (
    <div className='min-h-screen flex justify-center items-center dark:bg-black'>
        <Sidebar/>
        <ComingSoon message="Get global tech insights"/>
    </div>
  )
}

export default newsLetters