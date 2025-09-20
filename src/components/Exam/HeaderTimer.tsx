"use client"

import { useExamContext } from "@/contexts/ExamNavigationProvider"

export default function HeaderTimer() {
    // const [open, setOpen] = useState(false);

    const {showNav,setShowNav}=useExamContext()
    return <div className='flex bg-white justify-between px-6 items-center'>
        <h2 className="text-[1.75rem] font-normal">Screening Exam</h2>
        <div className="flex flex-col">
            <span className='text-sm text-[#667185]'>Time Remaining</span>
            <span className='font-bold text-lg'>01:30:00</span>
        </div>

        <div className="flex gap-2 items-center">
            <span>QUIZ NAVIGATION</span>
          
             <button
      onClick={() => setShowNav(!showNav)}
      aria-label="Toggle menu"
      className="flex flex-col gap-1 w-6 cursor-pointer focus:outline-none"
    //   className="flex flex-col gap-1 w-6 cursor-pointer"
    >
      <span
        className={`h-0.5 w-full bg-black rounded-md transform transition duration-300 ${
          showNav ? "rotate-45 translate-y-1.5" : ""
        }`}
      />
      <span
        className={`h-0.5 w-full bg-black rounded-md transition duration-300 ${
          showNav ? "opacity-0" : ""
        }`}
      />
      <span
        className={`h-0.5 w-full bg-black rounded-md transform transition duration-300 ${
          showNav ? "-rotate-45 -translate-y-1.5" : ""
        }`}
      />
    </button>
            </div>
    </div>
}