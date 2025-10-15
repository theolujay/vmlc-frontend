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



export default function LeaderBoardSection() {
  const {data}=useGetLeaderBoard()
  console.log('leaderboard data',data)
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader label="Leaderboards" isExport actionButton={<Button className="px-2 bg-grey-base-400 text-white">UPLOAD</Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

        <ResponsiveContainer className="px-0">
          <ScreeningTabWrapper tabs={[
            { label: <ScreeningLabel />, value: 'overall-leaderboard', content: <ScoreComponent results={[]} /> },
          ]} />
        </ResponsiveContainer>
      </div>
    </div>
  )
}


function ScreeningLabel() {
  return <div className='flex gap-1 items-center'><span><ScreeningIcon /></span><span>Screening</span></div>
}

function ScoreComponent({ results }: Readonly<{ results: User[] }>) {
  return <div className="flex flex-col">
    {results.length > 0 ?
      <div className="flex gap-2 flex-col">
        <Podium users={results} />
        <Table data={[]} columns={['Position', 'Name', 'Email Address', 'Score', 'Action']} />
      </div> : <EmptySession desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here " label='Exams hasn’t happened yet' />}
  </div>
}








export function Podium({ users }: Readonly<{ users: User[] }>) {
  // Sort by rank so it displays in correct order (2 - 1 - 3)
  const sorted = [...users].sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex justify-center gap-8 mt-10">
      {sorted.map((user) => (
        <div
          key={user.rank}
          className="flex flex-col items-center relative"
        >
          {/* Avatar */}
          <div className="relative w-16 h-16">
            <Image
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              className="rounded-full border-2 border-white"
            />
            <span
              className={`absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full ${user.rank === 1
                  ? "bg-yellow-500"
                  : user.rank === 2
                    ? "bg-gray-400"
                    : "bg-orange-500"
                }`}
            >
              {user.rank}
            </span>
          </div>

          {/* Name & Email */}
          <h3 className="font-semibold mt-2">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>

          {/* Score */}
          <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold mt-2">
            {user.score}%
          </div>

          {/* Podium block */}
          <div
            className={`w-32 flex items-center justify-center mt-4 text-5xl font-bold text-purple-400 rounded-t-lg`}
            style={{
              height:
                user.rank === 1
                  ? "160px"
                  : user.rank === 2
                    ? "130px"
                    : "110px",
              background:
                "linear-gradient(to top, rgba(156,163,175,0.2), rgba(255,255,255,0))",
            }}
          >
            {user.rank}
          </div>
        </div>
      ))}
    </div>
  );
}
