import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type ActionItem={
    label:React.ReactNode;
    onClick?:()=>void
}
type Props = Readonly<{triggerButton:React.ReactNode,actionItems:ActionItem[],children?:React.ReactNode }>

export default function AppDropdownDialog({triggerButton,actionItems,children}: Props) {
  return (
    <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              {triggerButton}
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[220px] flex flex-col gap-3 rounded-lg bg-white p-[10px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
                    sideOffset={5}
                >
                    {
                        actionItems.map((item,index)=>(
                            <DropdownMenu.Item onClick={e=>{
                                item.onClick?.()
                            }} key={`dropdown-${index}`}  className="group cursor-pointer relative flex w-full  h-[25px]  items-center   leading-none  outline-none  ">

                       {item.label}
                    </DropdownMenu.Item>
                        ))
                    }
                    
                
                    <DropdownMenu.Separator className="m-[5px] h-px bg-violet6" />
                   
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
            {children}
        </DropdownMenu.Root>
  )
}
