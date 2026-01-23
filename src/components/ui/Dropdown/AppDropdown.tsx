import { LogOutIcon, ProfileIcon } from "@/components/General/GettingStarted/GettingStartedAssets";
import LogOutModal from "@/components/Modals/LogoutModal";
import ProfileModal from "@/components/Modals/ProfileModal";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from "react";
import { CaretDropdown } from "../SvgAsset/GeneralAsset";




const AppDropdown = () => {
const [open,setOpen]=useState(false)
const [profileOpen, setProfileOpen] = useState(false)
const currentUser = useGetCurrentUser()
	

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					className="inline-flex size-[20px] items-center justify-center    outline-none cursor-pointer "
					aria-label="Customise options"
				>
					<CaretDropdown/>
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="z-50 min-w-[220px] rounded-lg bg-white p-[10px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
					sideOffset={5}
				>
                    <DropdownMenu.Item onClick={() => setProfileOpen(true)} className="group relative flex cursor-pointer  h-[25px]  items-center   leading-none  outline-none  ">
						<div className=" pr-5  ">
							<ProfileIcon/>
						</div>
						View Profile{" "}
					</DropdownMenu.Item>
					{/* <DropdownMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px]  pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
						<div className="mr-auto pr-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							<ProfileIcon/>
						</div>
                        View Profile{" "}
						
					</DropdownMenu.Item> */}
                    <DropdownMenu.Separator className="m-[5px] h-px bg-violet6" />
					<DropdownMenu.Item onClick={()=>{
						
						setOpen(true)}} className="group cursor-pointer relative flex text-[#D42620] h-[25px]  items-center   leading-none  outline-none  ">
						<div className=" pr-5  ">
							<LogOutIcon/>
						</div>
						Log out{" "}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
			<LogOutModal open={open} close={setOpen} />
			{currentUser?.profile?.user?.id && (
				<ProfileModal 
					id={currentUser.profile.user.id} 
					open={profileOpen} 
					close={setProfileOpen} 
					isOwnProfile={true}
				/>
			)}
		</DropdownMenu.Root>
	);
};

export default AppDropdown;
