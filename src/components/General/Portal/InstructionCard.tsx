import ResponsiveContainer from "@/components/ui/ResponsiveContainer";

export default function InstructionCard() {
    return (
        <ResponsiveContainer className='col-span-2 gap-4 '>
        <p className="border-b py-2 border-[#E4E7EC] ">Instructions - Please read the following carefully</p>
        <div className="flex flex-col gap-2">
        <h2 className="font-bold">Exam details</h2>
        <div className="flex justify-between">
            <div>
                <p className="text-sm uppercase">exam name</p>
                <p className=" capitalize">screening exam</p>
            </div>
            <div>
                <p className="text-sm uppercase">number of questions</p>
                <p>30</p>
            </div>
            <div>
                <p className="text-sm uppercase">time allocation</p>
                <p>1 hour</p>
            </div>
            <div>
                <p className="text-sm uppercase">type of questions</p>
                <p className="capitalize">multichoice</p>
            </div>
        </div>
        </div>
        <div className="flex flex-col instructions px-3">
             <h2 className="font-bold">Before beginning the exams</h2>
             <ol className="list-decimal list-inside space-y-1 pl-5">
                <li>Ensure you are in a quiet environment with no distractions.</li>
                <li>Make sure your internet connection is stable.</li>
                <li>Have a valid ID ready for verification purposes.</li>   
                <li>Close all other applications and tabs on your device.</li>
                <li>Ensure your webcam and microphone are functioning properly.</li>
             </ol>
        </div>
         <div className="flex flex-col instructions px-3">
             <h2 className="font-bold">During the exams</h2>
             <ol className="list-decimal list-inside space-y-1 pl-5">
                <li>Ensure you are in a quiet environment with no distractions.</li>
                <li>Make sure your internet connection is stable.</li>
                <li>Have a valid ID ready for verification purposes.</li>   
                <li>Close all other applications and tabs on your device.</li>
                <li>Ensure your webcam and microphone are functioning properly.</li>
             </ol>
        </div>
        </ResponsiveContainer>
    )
}