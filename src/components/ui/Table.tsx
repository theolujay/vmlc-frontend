import { ActivityHistoryUserType } from '@/types/auth'
import { formatDate } from '@/utils/formatFileSize'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import { TableIcon } from '../General/GeneralIcon'

export default function Table({ columns, data, label, desc, footer }: Readonly<{ columns: string[], data: ActivityHistoryUserType[], label?: string, desc?: React.ReactNode, footer?: React.ReactNode }>) {
   console.log(data,'table data')
    return (
        <div className="flex flex-col">
            <div className="w-full overflow-x-auto">
                

            <table className='w-full overflow-x-auto'>
                <thead>
                    <tr className='border-b border-[#E4E7EC]'>
                        {
                            columns.map((val, i) => <th className='bg-[#E4E7EC] py-3' key={i}>{val}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length == 0 ? <tr><td colSpan={columns.length + 1}><EmptyRecords label={label} desc={desc} /></td></tr> :
                            data.map((val, index) => <TableRowData key={index} index={index+1} userRole={val.role} status={val.status} userName={[val.user.first_name, val.user.last_name].join(' ')} email={val.user.email} id={val.user.id} applicationDate={val.user.date_joined} />
                                //    <tr key={index} className='border-b  border-[#E4E7EC] last:border-0'>
                                //         <td className='text-center py-2'>1</td>
                                //         <td className='text-center py-2'><div className="flex justify-center gap-0.5 items-center">
                                //             <div className=" w-12 h-12 rounded-full gap-1">
                                //                 <img loading='lazy' src={undefined} alt="" className='object-contain outline-0 block align-middle rounded-full bg-grey-200 w-full h-full' /></div><span>Simon Kanu</span></div></td>
                                //         <td className='text-center py-2'>90%</td>
                                //     </tr>
                            )
                    }


                </tbody>
            </table>
            </div>
            {footer && <div className='py-3'>{footer}</div>}
        </div>
    )
}


function EmptyRecords({ label = "Result not available yet", desc = <>Arrangement of result based on the highest score gotten by <br /> candidates on the platform would appear here </> }: Readonly<{ label?: string, desc?: React.ReactNode }>) {
    return <div className="w-full grid place-content-center min-h-[80vh]">
        <div className="flex items-center gap-2 flex-col">
            <span><TableIcon /></span>
            <h2 className='text-xl'>{label}</h2>
            <p className='text-balance text-center'>{desc}</p>
        </div>
    </div>
}


function TableRowData({ id, email, userName, userRole, applicationDate, status,index }: Readonly<{ id: string,index:number, email: string, userName: string, userRole: string, applicationDate: Date, status: string }>) {





  const pathName = usePathname();
const searchParams = useSearchParams();


// const href = (() => {
//   const query = new URLSearchParams(searchParams.toString());
//   query.set('view', 'view-details');
//    return `${pathName}/${id}?${query.toString()}`;
// //   return `${pathName}${id}?${query.toString()}`;
// })();

const href = (() => {
  const query = new URLSearchParams(searchParams.toString());
  query.set("view", "view-details");
  query.set("id", id);
  return `${pathName}?${query.toString()}`;
})();




    return <tr className='border-b  border-[#E4E7EC] last:border-0'>
        <td className='text-center py-2 max-w-[6vw] overflow-clip'>{index}</td>
        <td className='text-center py-2'>
            <div className="flex items-center gap-0.5 ">
            {/* <div className=" w-12 h-12 rounded-full gap-1">
                <img loading='lazy' src={undefined} alt="" className='object-contain outline-0 block align-middle rounded-full bg-grey-200 w-full h-full' />
                </div> */}
                <span>{userName}</span>
                </div></td>
        <td className='text-center py-2'>{userRole}</td>
        <td className='text-center py-2'>{email}</td>
        <td className='text-center py-2'>
           
{formatDate(applicationDate)}
</td>
        <td className='text-center py-2'>{status}</td>
        <td className='text-center py-2  '><Link 
        href={href}
        // href={ `/admin/overview/${id}`}
         className='text-[#3E4095] font-semibold '>View details</Link></td>
    </tr>
}