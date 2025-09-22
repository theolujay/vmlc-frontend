import React from 'react'
import { TableIcon } from '../General/GeneralIcon'

export default function Table({ columns, data }: Readonly<{ columns: string[], data:any[] }>) {
    return (
        <div className="flex flex-col">
            <table className='overflow-x-auto'>
                <thead>
                    <tr className='border-b border-[#E4E7EC]'>
                        {
                            columns.map((val, i) => <th className='bg-[#E4E7EC] py-3' key={i}>{val}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length == 0 ? <tr><td colSpan={columns.length+1}><EmptyRecords/></td></tr> :
                           data.map((_, index) => <tr key={index} className='border-b  border-[#E4E7EC] last:border-0'>
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


function EmptyRecords() {
    return <div className="w-full grid place-content-center min-h-[80vh]">
        <div className="flex items-center gap-2 flex-col">
            <span><TableIcon /></span>
            <h2 className='text-xl'>Result not available yet</h2>
            <p className='text-balance text-center'>Arrangement of result based on the highest score gotten by <br /> candidates on the platform would appear here </p>
        </div>
    </div>
}