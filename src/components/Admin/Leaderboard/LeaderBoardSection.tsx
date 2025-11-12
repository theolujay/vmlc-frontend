import Spinner from "@/components/ui/spinner/spinner";
import useGetLeaderBoard from "@/hooks/useGetLeaderboard";
import usePagination from "@/hooks/usePagination";
import { CandidateType } from "@/types/LeaderBoardType";
import { useState } from "react";
import { LeagueIcon, ScreeningIcon } from "../../General/GeneralIcon";
import Button from "../../ui/Button";
import ResponsiveContainer from "../../ui/ResponsiveContainer";
import ScreeningTabWrapper from "../../ui/Tabs/ScreeningTabWrapper";
import AdminHeader from "../AdminHeader";
import EmptySession from "../EmptySession";
import { FirstPosition, SecondPosition, ThirdPosition } from "./LeaderBoardIcon";
import CustomTable from "@/components/ui/CustomTable";
import TablePagination from "@/components/ui/Pagination/TablePagination";



export default function LeaderBoardSection() {
  const { data, isPending } = useGetLeaderBoard()


  if (isPending || !data) {
    return <div className="grid w-full place-content-center"><Spinner /></div>
  }

  let leaderBoardItems;
  if ('available_leaderboards' in data) {

    leaderBoardItems = data.available_leaderboards;
  }




  const leaderBoardTab = leaderBoardItems?.map((val) => {
    return {
      label: <ScreeningLabel label={val.stage} />,
      value: val.stage_display,
      content: <ScoreComponent stage={val.stage} level={val.level} />
    }
  })
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader label="Leaderboards" isExport actionButton={<Button className="px-2 bg-grey-base-400 text-white">UPLOAD</Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

        <ResponsiveContainer className="px-0 min-h-[60vh]">
          <ScreeningTabWrapper
            // tabs={[
            //   { label: <ScreeningLabel />, value: 'overall-leaderboard', content: <ScoreComponent results={data?.list ?? []} /> },
            // ]}
            tabs={leaderBoardTab ?? []}
          />

        </ResponsiveContainer>
      </div>
    </div>
  )
}


function ScreeningLabel({ label }: { label: string }) {
  return <div className='flex gap-1 items-center'><span>{handleRankingIcon(label)}</span><span className="capitalize">{label}</span></div>
}

// function ScoreComponent({ stage, level }: Readonly<{ stage: string, level: number }>) {
//   const { page, setPage } = usePagination()
//   const [filters] = useState({
//     stage,
//     level,

//   })

//   const { data } = useGetLeaderBoard(page, filters)




//   if (!data) {
//     return (
//       <EmptySession
//         desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here"
//         label="Exams hasn’t happened yet"
//       />
//     );
//   }

//   if ('top_three' in data) {
//     // ✅ data is RankedLeaderBoardType here
//     return (
//       <div className="flex gap-2 flex-col">
//         <Podium users={data.top_three} />
//         {/* <CustomTable columns={[
//           { key: 'position', header: 'Position', render: (_, row) => <div className="flex items-center gap-1">{row.rank}</div> },
//           { key: 'Name', header: 'Name', render: (_, row) => <div className="flex  items-center gap-1">{getUserName(row.candidate.user.first_name, row.candidate.user.last_name)}</div> },
//           {
//             key: 'email', header: 'Email Address', render: (_, row) => <div className="flex items-center gap-1">
//               {row.candidate.user.email}
//             </div>
//           },
//           {
//             key: 'Score', header: 'Score', render: (_, row) => <div className="flex  items-center gap-1">
//               {row.total_score}
//             </div>
//           },
//           {
//             key: 'action', header: "Action", render: () => (
//               <div className="flex justify-between items-center gap-1">

//                 <button className="cursor-pointer font-semibold text-[#3E4095]">View Details</button>
//               </div>
//             ),
//           }
//         ]} data={data.remaining_candidates} />  */}
//       </div>
//     );
//   }


// }

function ScoreComponent({ stage, level }: Readonly<{ stage: string; level: number }>) {
  const { page,setPage } = usePagination();
  const [filters] = useState({ stage, level });
  const { data } = useGetLeaderBoard(page, filters);

  // First handle "no data" case
  if (!data) {
    return (
      <EmptySession
        desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here"
        label="Exams hasn’t happened yet"
      />
    );
  }

  // Now narrow type properly
  if ('top_three' in data && 'remaining_candidates' in data) {
    // ✅ TypeScript now knows `data` is RankedLeaderBoardType
    if (data.remaining_candidates.length === 0) {
      return (
        <EmptySession
          desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here"
          label="Exams hasn’t happened yet"
        />
      );
    }

    return (
      <div className="flex gap-2 flex-col">
        <Podium users={data.top_three} />
               <CustomTable columns={[
          { key: 'position', header: 'Position', render: (_, row) => <div className="flex items-center gap-1">{row.rank}</div> },
          { key: 'Name', header: 'Name', render: (_, row) => <div className="flex  items-center gap-1">{row.candidate.full_name}</div> },
          // {
          //   key: 'email', header: 'Email Address', render: (_, row) => <div className="flex items-center gap-1">
          //     {row.candidate.user.email}
          //   </div>
          // },
          {
            key: 'Score', header: 'Score', render: (_, row) => <div className="flex  items-center gap-1">
              {row.score}
            </div>
          },
          {
            key: 'action', header: "Action", render: () => (
              <div className="flex justify-between items-center gap-1">

                <button className="cursor-pointer font-semibold text-[#3E4095]">View Details</button>
              </div>
            ),
          }
        ]} data={data.remaining_candidates}
        footer={
          <TablePagination pageCount={data.pagination.total_pages} currentPage={page} onPageChange={setPage} />
        }
         />  
        {/* <CustomTable data={data.remaining_candidates} ... /> */}
      </div>
    );
  }

  // Fallback for LeaderBoardType
  return (
    <EmptySession
      desc="No ranked leaderboard data available for this stage"
      label="Awaiting results"
    />
  );
}






const shapeByRank: Record<number, React.ComponentType> = {
  1: FirstPosition,
  2: SecondPosition,
  3: ThirdPosition,
};






export function Podium({ users }: Readonly<{ users: CandidateType[] }>) {
  const order = [2, 1, 3];
  const arranged = [...users].sort(
    (a, b) => order.indexOf(a.rank) - order.indexOf(b.rank)
  );

  console.log(users,'waht is users')

  console.log(arranged,'what is in arranged')

  return (

    <div className="flex flex-col max-w-[96%] mx-auto my-5">
      <div className="flex flex-col md:flex-row justify-between w-full gap-3">
        {
          arranged.map((val, index) => {
            const Shape = shapeByRank[val.rank]
            return <div key={`shape-index-${index + 1}`} className="flex justify-between gap-3 items-center flex-col">
              <div className="flex  flex-col">
                  <p className="font-[400] text-2xl">{val.candidate.full_name}</p>
                
                {/* <span className="text-sm">{val.candidate.user.email}</span> */}
              </div>
              <div className="relative">
                <span className="w-15 h-6 p-2 inline-flex items-center absolute left-1/2 -top-2 bg-[#3E4095] text-white  -translate-x-1/2  whitespace-nowrap font-bold rounded-full">{val.percentage}</span>
                <Shape />
              </div>
            </div>
          })
        }
      </div>
    </div>
  );
}









function handleRankingIcon(value: string) {
  switch (value) {
    case 'screening':
      return <ScreeningIcon />;
    case 'league':
      return <LeagueIcon />;
    default:
      return <ScreeningIcon />
  }
}






// type Option = {
//   id: string;
//   label: string;
//   value: string;
// };

// type QuestionProps = {
//   question: string;
//   options: Option[];
//   correctAnswer: string;
// };

// export function QuestionExample({
//   question,
//   options,
//   correctAnswer,
// }: Readonly<QuestionProps>) {
//   const [selected, setSelected] = useState<string>("");

//   return (
//     <div className="max-w-xl mx-auto p-4 border-b border-gray-200">
//       <p className="font-medium text-lg mb-3">{question}</p>

//       <div className="flex flex-col gap-2">
//         {options.map((opt) => {
//           const isSelected = selected === opt.value;
//           const isCorrect = selected && opt.value === correctAnswer;
//           const isWrong = isSelected && opt.value !== correctAnswer;

//           return (
//             <label
//               key={opt.id}
//               className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition
//                 ${
//                   isCorrect
//                     ? "bg-green-50 border border-green-500"
//                     : isWrong
//                     ? "bg-red-50 border border-red-500"
//                     : "border border-gray-300 hover:bg-gray-50"
//                 }`}
//             >
//               <input
//                 type="radio"
//                 name="quiz"
//                 value={opt.value}
//                 checked={isSelected}
//                 onChange={() => setSelected(opt.value)}
//                 className="accent-blue-600"
//               />
//               <span
//                 className={`text-sm ${
//                   isCorrect
//                     ? "text-green-700 font-semibold"
//                     : isWrong
//                     ? "text-red-700 font-semibold"
//                     : "text-gray-800"
//                 }`}
//               >
//                 {opt.label}
//               </span>
//             </label>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
