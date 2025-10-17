import { BackIcon, NextIcon } from '@/components/General/GettingStarted/GettingStartedAssets'
import clsx from 'clsx'
import ReactPaginate from 'react-paginate'
import React from 'react'

export default function TablePagination({onPageChange,pageCount,currentPage}:{ onPageChange: (page: number) => void, pageCount:number,currentPage:number}) {
    return (
        <div>
            <div className="flex justify-between w-full">
           



                    <ReactPaginate
                     forcePage={currentPage - 1} 
                    pageRangeDisplayed={5}
                    pageLinkClassName="flex disabled:cursor-default cursor-pointer items-center justify-center w-8 h-8 rounded-full  text-[#475367]"
                    pageClassName='mx-1 text-[#475367]'
                    activeLinkClassName='rounded-full text-[#018ABB] w-6 h-6  bg-[#E6F7FD]'
                    disabledClassName='text-[#98A2B3]'
                    previousLabel={<button className={clsx('rounded-md  inline-flex items-center  cursor-pointer border-[#D0D5DD] border py-2 px-3 ')}><div className='flex justify-between items-center gap-2'>
                    <span><BackIcon /></span><span>Previous</span></div></button>}
                    nextLabel={<button className={clsx('py-2 px-3 rounded-md inline-flex border-[#D0D5DD] items-center cursor-pointer border')}><div className='flex gap-2 justify-between items-center'>
                    <span>Next</span> <span><NextIcon /></span></div></button> }
                    className='flex justify-between w-full p-3'
                    pageCount={pageCount}
                    breakLabel="..."
                    onPageChange={
                        (e)=>onPageChange(e.selected+1)
                    }
                    />

            </div>
        </div>
    )
}
