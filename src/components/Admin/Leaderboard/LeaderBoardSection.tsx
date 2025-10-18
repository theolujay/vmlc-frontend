import Image from "next/image";
import { ScreeningIcon } from "../../General/GeneralIcon";
import Button from "../../ui/Button";
import ResponsiveContainer from "../../ui/ResponsiveContainer";
import ScreeningTabWrapper from "../../ui/Tabs/ScreeningTabWrapper";
import AdminHeader from "../AdminHeader";
import { User } from "@/types/Index";
import Table from "../../ui/Table";
import EmptySession from "../EmptySession";
import useGetLeaderBoard from "@/hooks/useGetLeaderboard";
import { LeaderBoardType } from "@/types/LeaderBoardType";
import CustomTable from "@/components/ui/CustomTable";
import { getUserName } from "@/utils/generalUtils";
import { FirstPosition, SecondPosition, ThirdPosition } from "./LeaderBoardIcon";



export default function LeaderBoardSection() {
  const { data } = useGetLeaderBoard()
  console.log('leaderboard data', data)
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader label="Leaderboards" isExport actionButton={<Button className="px-2 bg-grey-base-400 text-white">UPLOAD</Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

        <ResponsiveContainer className="px-0">
          <ScreeningTabWrapper tabs={[
            { label: <ScreeningLabel />, value: 'overall-leaderboard', content: <ScoreComponent results={data ?? []} /> },
          ]} />
        </ResponsiveContainer>
      </div>
    </div>
  )
}


function ScreeningLabel() {
  return <div className='flex gap-1 items-center'><span><ScreeningIcon /></span><span>Screening</span></div>
}

function ScoreComponent({ results }: Readonly<{ results: LeaderBoardType }>) {
  console.log(results, 'which results do we have here')
  return <div className="flex flex-col">
    {results.length == 0 ? <EmptySession desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here " label='Exams hasn’t happened yet' /> :

      <div className="flex gap-2 flex-col">
        <Podium users={results.slice(0, 3)} />
        <CustomTable columns={[
          { key: 'position', header: 'Position', render: (_, row) => <div className="flex items-center gap-1">{row.rank}</div> },
          { key: 'Name', header: 'Name', render: (_, row) => <div className="flex  items-center gap-1">{getUserName(row.candidate.user.first_name, row.candidate.user.last_name)}</div> },
          {
            key: 'email', header: 'Email Address', render: (_, row) => <div className="flex items-center gap-1">
              {row.candidate.user.email}
            </div>
          },
          {
            key: 'Score', header: 'Score', render: (_, row) => <div className="flex  items-center gap-1">
              {row.total_score}
            </div>
          },
          {
            key: 'action', header: "Action", render: () => (
              <div className="flex justify-between items-center gap-1">

                <button className="cursor-pointer font-semibold text-[#3E4095]">View Details</button>
              </div>
            ),
          }
        ]} data={results} />
      </div>
      // <EmptySession desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here " label='Exams hasn’t happened yet' />
    }
  </div>
}





const shapeByRank: Record<number, React.ComponentType> = {
  1: FirstPosition,
  2: SecondPosition,
  3: ThirdPosition,
};






export function Podium({ users }: Readonly<{ users: LeaderBoardType }>) {
  const order = [2, 1, 3];
  const arranged = [...users].sort(
    (a, b) => order.indexOf(a.rank) - order.indexOf(b.rank)
  );



  return (

    <div className="flex flex-col max-w-[96%] mx-auto my-5">
      <div className="flex flex-col md:flex-row justify-between w-full gap-3">
        {
          arranged.map((val, index) => {
            const Shape = shapeByRank[val.rank]
            return <div key={`shape-index-${index + 1}`} className="flex justify-between gap-3 items-center flex-col">
              <div className="flex  flex-col">
                <p className="font-[400] text-2xl">{getUserName(val.candidate.user.first_name, val.candidate.user.last_name)}</p>
                <span className="text-sm">{val.candidate.user.email}</span>
              </div>
              <div className="relative">
                <span className="w-15 h-6 p-2 inline-flex items-center absolute left-1/2 -top-2 bg-[#3E4095] text-white  -translate-x-1/2  whitespace-nowrap font-bold rounded-full">{val.total_score}</span>
                <Shape />
              </div>
            </div>
          })
        }
      </div>
    </div>
  );
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
