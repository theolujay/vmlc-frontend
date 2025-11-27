import { StepType } from "@/types/step";
import clsx from "clsx";


function StepsTab({ steps }: Readonly<{ steps: StepType[] }>) {
    return (
        <div className="w-[16vw] md:w-full rounded-[24px] bg-white shadow-sm  border border-[#E4E7EC] flex flex-col p-3">
            {steps.map((val, index) => <div key={`steps-${index}`} className={clsx('flex items-start relative pb-10 gap-2', val.activeTab ? 'text-[#018abb]' : 'text-black')} >
                {index !== steps.length - 1 && (
                    <div className="absolute left-4.5 top-10 w-px  h-[55%] border-l border-dashed border-gray-300" />
                )}
                <span className={clsx('border  rounded-lg inline-flex items-center w-[40px] h-[40px] px-2', val.activeTab ? 'border-[#018abb]' : 'border-black')}>{val.icon}</span>
                <div className=" hidden md:flex gap-0.5 flex-col">
                    <span>Step {index + 1}</span>
                    <span className='font-bold '>{val.label}</span>
                </div>
            </div>)}
        </div>



    )
}


export default function Steps({ steps }: { steps: StepType[] }) {
    // const [currentTab] = steps.filter((val: StepType) => val.activeTab)
const currentTab=steps.find(step=>step.activeTab)
    return <div className="flex md:grid  md:grid-cols-3 items-start gap-3">
        <StepsTab steps={steps} />
        {currentTab?.component}
        {/* {currentStep?.component??steps[0].component} */}
    </div>
}