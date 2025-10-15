// import React from 'react'
// import { TableIcon } from '../General/GeneralIcon'
// import { ActivityHistoryUserType } from '@/types/auth'
// import Link from 'next/link'
// import { useParams, usePathname, useSearchParams } from 'next/navigation'
// import { formatDate } from '@/utils/formatFileSize'

// export default function CustomTable({ columns, data, label, desc, footer }: Readonly<{ columns: string[], data: ActivityHistoryUserType[], label?: string, desc?: React.ReactNode, footer?: React.ReactNode }>) {
//     return (
//         <div className="flex flex-col">
//             <table className='overflow-x-auto'>
//                 <thead>
//                     <tr className='border-b border-[#E4E7EC]'>
//                         {
//                             columns.map((val, i) => <th className='bg-[#E4E7EC] py-3' key={i}>{val}</th>)
//                         }
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         data.length == 0 ? <tr><td colSpan={columns.length + 1}><EmptyRecords label={label} desc={desc} /></td></tr> :
//                             data.map((val, index) => <TableRowData key={index} userRole={val.role} status='' userName={[val.user.first_name, val.user.last_name].join(' ')} email={val.user.email} id={val.user.id} applicationDate={val.user.date_joined} />
//                                 //    <tr key={index} className='border-b  border-[#E4E7EC] last:border-0'>
//                                 //         <td className='text-center py-2'>1</td>
//                                 //         <td className='text-center py-2'><div className="flex justify-center gap-0.5 items-center">
//                                 //             <div className=" w-12 h-12 rounded-full gap-1">
//                                 //                 <img loading='lazy' src={undefined} alt="" className='object-contain outline-0 block align-middle rounded-full bg-grey-200 w-full h-full' /></div><span>Simon Kanu</span></div></td>
//                                 //         <td className='text-center py-2'>90%</td>
//                                 //     </tr>
//                             )
//                     }


//                 </tbody>
//             </table>
//             {footer && <div className='py-3'>{footer}</div>}
//         </div>
//     )
// }


// function EmptyRecords({ label = "Result not available yet", desc = <>Arrangement of result based on the highest score gotten by <br /> candidates on the platform would appear here </> }: Readonly<{ label?: string, desc?: React.ReactNode }>) {
//     return <div className="w-full grid place-content-center min-h-[80vh]">
//         <div className="flex items-center gap-2 flex-col">
//             <span><TableIcon /></span>
//             <h2 className='text-xl'>{label}</h2>
//             <p className='text-balance text-center'>{desc}</p>
//         </div>
//     </div>
// }


// function TableRowData({ id, email, userName, userRole, applicationDate, status }: Readonly<{ id: string, email: string, userName: string, userRole: string, applicationDate: Date, status: string }>) {





//   const pathName = usePathname();
// const searchParams = useSearchParams();




// const href = (() => {
//   const query = new URLSearchParams(searchParams.toString());
//   query.set("view", "view-details");
//   query.set("id", id);
//   return `${pathName}?${query.toString()}`;
// })();




//     return <tr className='border-b  border-[#E4E7EC] last:border-0'>
//         <td className='text-center py-2 max-w-[6vw] overflow-clip'>{id}</td>
//         <td className='text-center py-2'>
//             <div className="flex justify-center gap-0.5 items-center">
//             {/* <div className=" w-12 h-12 rounded-full gap-1">
//                 <img loading='lazy' src={undefined} alt="" className='object-contain outline-0 block align-middle rounded-full bg-grey-200 w-full h-full' />
//                 </div> */}
//                 <span>{userName}</span>
//                 </div></td>
//         <td className='text-center py-2'>{userRole}</td>
//         <td className='text-center py-2'>{email}</td>
//         <td className='text-center py-2'>
           
// {formatDate(applicationDate)}
// </td>
//         <td className='text-center py-2'>{status}</td>
//         <td className='text-center py-2  '><Link 
//         href={href}
//         // href={ `/admin/overview/${id}`}
//          className='text-[#3E4095] font-semibold '>View details</Link></td>
//     </tr>
// }


import React from "react";


type ColumnType<T> = {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
};

type CustomTableProps<T> = {
  columns: ColumnType<T>[];
  data: T[];
  emptyLabel?: string;
  emptyDesc?: React.ReactNode;
  footer?: React.ReactNode;
};


export default function CustomTable<T>({
  columns,
  data,
  emptyLabel = "No records found",
  emptyDesc = "There are currently no entries to display.",
  footer,
}: Readonly<CustomTableProps<T>>) {
  return (
    <div className="flex flex-col">
      <table className="overflow-x-auto w-full border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#E4E7EC]">
            {columns.map((col, i) => (
              <th key={i} className="py-3 text-left px-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-6 text-center">
                <EmptyRecords label={emptyLabel} desc={emptyDesc} />
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[#E4E7EC] last:border-0 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, ci) => {
                  const value =
                    typeof col.key === "string" && col.key.includes(".")
                      ? col.key
                          .split(".")
                          .reduce(
                            (acc, k) => (acc && acc[k as keyof typeof acc]) || "",
                            row as any
                          )
                      : (row as any)[col.key as keyof T];

                  return (
                    <td key={ci} className="py-2 px-3 text-center">
                      {col.render ? col.render(value, row, index) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {footer && <div className="py-3">{footer}</div>}
    </div>
  );
}

function EmptyRecords({
  label,
  desc,
}: Readonly<{ label: string; desc: React.ReactNode }>) {
  return (
    <div className="w-full grid place-content-center py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold">{label}</h2>
        <p className="text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
