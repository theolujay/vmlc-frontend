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
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import usePublishLeaderboard from "@/hooks/usePublishLeaderboard";
import UploadConfirmationModal from "@/components/Modals/UploadConfirmationModal";



export default function LeaderBoardSection() {
  const { data, isPending } = useGetLeaderBoard()
const [openPublishModal,setOpenPublishModal]=useState(false)

  // const { onSubmit } = usePublishLeaderboard()

  if (isPending || !data) {
    return <div className="grid w-full place-content-center"><Spinner /></div>
  }

  let leaderBoardItems;
  if ('available_leaderboards' in data) {

    leaderBoardItems = data.available_leaderboards.toReversed();
  }






  function handleModal(){
    setOpenPublishModal(true)
  }
  const leaderBoardTab = leaderBoardItems?.map((val) => ({
    label: <ScreeningLabel label={val.stage} />,
    value: val.stage_display,
    content: <ScoreComponent stage={val.stage} level={val.level} />
  }));

  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader label="Leaderboards" isExport actionButton={<Button onClick={handleModal} className="px-2 bg-[#3e4095] text-white">UPLOAD</Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

        <ResponsiveContainer className="px-0 min-h-[60vh]">
          <ScreeningTabWrapper
            tabs={leaderBoardTab ?? []}
          />

        </ResponsiveContainer>
      </div>
      <UploadConfirmationModal open={openPublishModal} close={setOpenPublishModal} />
      {/* <PublishLeaderboardModal/> */}
    </div>
  )
}


function ScreeningLabel({ label }: { label: string }) {
  return <div className='flex gap-1 items-center'><span>{handleRankingIcon(label)}</span><span className="capitalize">{label}</span></div>
}



function ScoreComponent({ stage, level }: Readonly<{ stage: string; level: number }>) {
  const { page, setPage } = usePagination();
  const [filters] = useState({ stage, level });
  const { data } = useGetLeaderBoard(page, filters);


  const pathName = usePathname()
  const searchParams = useSearchParams()
  


  if (!data) {
    return (
      <EmptySession
        desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here"
        label="Exams has not happened yet"
      />
    );
  }


  if ('top_three' in data && 'remaining_candidates' in data) {
    if (data.remaining_candidates.length === 0) {
      return (
        <EmptySession
          desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here"
          label="Exams has not happened yet"
        />
      );
    }

    console.log(data, 'what is in data hwew')
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
            key: 'School', header: 'School', render: (_, row) => <div className="flex items-center gap-1">{row.candidate.school}</div>
          },
          {
            key: 'Score', header: 'Score', render: (_, row) => <div className="flex  items-center gap-1">
              {row.score}
            </div>
          },
          {
            key: 'action', header: "Action", render: (_, row) => {
              console.log({
                stage: stage,
                level: level,
                candidateid: row.candidate.id

              }, 'is it rubbish here too')
              const query = new URLSearchParams(searchParams.toString());
              query.set("view", "view-candidate");
              query.set('level', level.toString())
              query.set('stage', stage)
              query.set("id", row.candidate.id);
              const href = `${pathName}?${query.toString()}`;


              console.log(row, query.toString(), 'what is in id')



              return (
                <div className="flex justify-between items-center gap-1">
                  <Link href={href} className="cursor-pointer font-semibold text-[#3E4095]">View Details</Link>
                </div>
              )
            },
          }
        ]} data={data.remaining_candidates}
          footer={
            <TablePagination pageCount={data.pagination.total_pages} currentPage={page} onPageChange={setPage} />
          }
        />

      </div>
    );
  }


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



  return (

    <div className="flex flex-col max-w-[96%] mx-auto my-5">
      <div className="flex flex-col md:flex-row justify-between w-full gap-3">
        {
          arranged.map((val, index) => {
            const Shape = shapeByRank[val.rank]
            return <div key={`shape-index-${index + 1}`} className="flex justify-between gap-3 items-center flex-col">
              <div className="flex  flex-col">
                <p className="font-[400] text-2xl">{val.candidate.full_name}</p>

                <span className="">{val.candidate.school}</span>
              </div>
              <div className="relative">
                <span className="w-15 h-6 p-2 inline-flex items-center absolute left-1/2 -top-2 bg-[#3E4095] text-white  -translate-x-1/2  whitespace-nowrap font-bold rounded-full">{val.score}</span>
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






