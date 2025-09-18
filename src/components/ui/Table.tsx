import React from 'react'

export default function Table({ tablehead }: { tablehead: string[] }) {
    return (
        <div className="flex flex-col">
            <table className='overflow-auto'>
                <thead>
                    <tr className='border-b border-[#E4E7EC]'>
                        {
                            tablehead.map((val, i) => <th className='bg-[#E4E7EC] py-3' key={i}>{val}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from({ length: 16 }).map((_, index) => <tr key={index} className='border-b  border-[#E4E7EC] last:border-0'>
                            <td className='text-center py-2'>1</td>
                            <td className='text-center py-2'><div className="flex justify-center gap-0.5 items-center">
                                <div className=" w-12 h-12 rounded-full gap-1">
                                    <img loading='lazy' src={undefined} alt="" className='object-contain outline-0 block align-middle rounded-full bg-grey-200 w-full h-full' /></div><span>Simon Kanu</span></div></td>
                            <td className='text-center py-2'>90%</td>
                        </tr>)
                    }


                </tbody>
            </table>
        </div>
    )
}
