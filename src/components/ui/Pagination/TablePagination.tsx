import { BackIcon, NextIcon } from '@/components/General/GettingStarted/GettingStartedAssets'
import clsx from 'clsx'
import ReactPaginate from 'react-paginate'
import React from 'react'

export default function TablePagination({
    onPageChange,
    pageCount,
    currentPage,
    hasNext,
    hasPrevious
}:{
    onPageChange: (page: number) => void,
    pageCount:number,
    currentPage:number,
    hasNext?: boolean,
    hasPrevious?: boolean
}) {
    const isFirstPage = hasPrevious !== undefined ? !hasPrevious : currentPage === 1;
    const isLastPage = hasNext !== undefined ? !hasNext : (currentPage === pageCount || pageCount === 0);

    return (
        <div className="w-full">
            <ReactPaginate
                key={currentPage}
                forcePage={currentPage - 1}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageLinkClassName="flex items-center justify-center w-8 h-8 rounded-full text-[#475367] text-xs font-bold transition-all hover:bg-gray-100"
                pageClassName='mx-0.5'
                activeLinkClassName='!bg-[#E6F7FD] !text-[#018ABB] border border-[#018ABB]/20'
                breakLabel="..."
                breakClassName="text-gray-400"
                onPageChange={(e) => {
                    console.log('ReactPaginate onPageChange called with selected:', e.selected);
                    onPageChange(e.selected + 1);
                }}
                containerClassName='flex items-center justify-between w-full'
                previousClassName='mr-2'
                nextClassName='ml-2'
                previousLinkClassName={clsx(
                    'rounded-xl inline-flex items-center border-[#D0D5DD] border py-2 px-4 bg-white transition-all shadow-sm',
                    isFirstPage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95 cursor-pointer'
                )}
                nextLinkClassName={clsx(
                    'py-2 px-4 rounded-xl inline-flex border-[#D0D5DD] items-center border bg-white transition-all shadow-sm',
                    isLastPage ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95 cursor-pointer'
                )}
                disabledLinkClassName='cursor-not-allowed'

                previousLabel={
                    <div className='flex items-center gap-2'>
                        <BackIcon />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#344054]">Previous</span>
                    </div>
                }
                nextLabel={
                    <div className='flex gap-2 items-center'>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#344054]">Next</span>
                        <NextIcon />
                    </div>
                }
                pageCount={pageCount}
            />
        </div>
    )
}