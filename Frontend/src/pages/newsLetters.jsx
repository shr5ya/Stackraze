import {useEffect} from 'react'
import Sidebar from '@/components/Sidebar'
import ComingSoon from '@/components/ComingSoon'
import Sample from "@/components/newsletters/sample"

function NewsLetters() {
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // window.scrollTo(0, 0); //hard scroll
    }, []);
  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-black'>
      <Sidebar />
      <main className="min-h-screen pt-14 lg:pt-15 pb-20 px- sm:px-0">
        <div className="w-full max-w-xl mx-auto flex flex-col lg:gap-6">
          <Sample />
        </div>
      </main>
      {/* <ComingSoon /> */}
    </div>
    // <div className='min-h-screen flex justify-center items-center dark:bg-black'>
    //     <Sidebar/>
    //     <ComingSoon message="Get Latest News insights"/>
    // </div>
  )
}

export default NewsLetters