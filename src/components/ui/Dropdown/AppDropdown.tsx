import { LogOutIcon, ProfileIcon } from "@/components/General/GettingStarted/GettingStartedAssets";
import LogOutModal from "@/components/Modals/LogoutModal";
import ProfileModal from "@/components/Modals/ProfileModal";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from "react";
import { CaretDropdown } from "../SvgAsset/GeneralAsset";

const AppDropdown = () => {
	const [open, setOpen] = useState(false)
	const [profileOpen, setProfileOpen] = useState(false)
	const currentUser = useGetCurrentUser()

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					className="inline-flex items-center justify-center outline-none cursor-pointer transition-transform active:scale-95"
					aria-label="Customise options"
				>
					<CaretDropdown />
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="z-50 min-w-[200px] rounded-[1.5rem] bg-white p-2 shadow-2xl border border-gray-100 will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade font-sans"
					sideOffset={8}
					align="end"
				>
					<DropdownMenu.Item 
						onClick={() => setProfileOpen(true)} 
						className="group relative flex cursor-pointer items-center px-4 py-3 rounded-xl outline-none hover:bg-gray-50 transition-colors"
					>
						<div className="mr-3 text-gray-400 group-hover:text-[#3E4095] transition-colors">
							<ProfileIcon className="w-4 h-4" />
						</div>
						<span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">View Profile</span>
					</DropdownMenu.Item>

					<DropdownMenu.Separator className="h-px bg-gray-50 my-1 mx-2" />

					<DropdownMenu.Item 
						onClick={() => setOpen(true)} 
						className="group relative flex cursor-pointer items-center px-4 py-3 rounded-xl outline-none hover:bg-red-50 transition-colors"
					>
						<div className="mr-3 text-red-400 group-hover:text-red-600 transition-colors">
							<LogOutIcon className="w-4 h-4" />
						</div>
						<span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Log out</span>
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
