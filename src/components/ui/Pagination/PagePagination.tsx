import { BackIcon, NextIcon } from '@/components/General/GettingStarted/GettingStartedAssets'
import clsx from 'clsx'
import React, { Dispatch, SetStateAction } from 'react'
import ReactPaginate from 'react-paginate'

export default function PagePagination({onPageChange,pageCount,currentPage}:{ onPageChange: Dispatch<SetStateAction<number>>, pageCount:number,currentPage:number}) {
  return (
     <div>
            <div className="flex items-end justify-end ">
                    <ReactPaginate
                     forcePage={currentPage - 1} 
                    pageRangeDisplayed={0}
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={0}
                    pageLinkClassName="hidden"
                    pageClassName='hidden'
                    // activeLinkClassName='rounded-full text-[#018ABB] w-6 h-6  bg-[#E6F7FD]'
                    disabledClassName='text-[#98A2B3]'
                    previousLabel={<button className={clsx('rounded-md  inline-flex items-center  cursor-pointer border-[#D0D5DD] border py-2 px-3 ')}><div className='flex justify-between items-center gap-2'>
                    <span><BackIcon /></span><span>Previous</span></div></button>}
                    nextLabel={<button className={clsx('py-2 px-3 rounded-md inline-flex border-[#D0D5DD] items-center cursor-pointer border')}><div className='flex gap-2 justify-between items-center'>
                    <span>Next</span> <span><NextIcon /></span></div></button> }
                    className='flex gap-3 p-3'
                    pageCount={pageCount}
                    breakLabel={null}
                    onPageChange={
                        (e)=>onPageChange(e.selected+1)
                    }
                    />

            </div>
        </div>
  )
}
