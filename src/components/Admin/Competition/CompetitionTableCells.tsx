import React from "react";
import Image from "next/image";
import RankMedal from "./RankMedal";
import clsx from "clsx";

export const SNCell = (index: number) => (
  <div className="flex items-center justify-center">
    <span className="text-xs font-bold text-gray-400">{index + 1}</span>
  </div>
);

export const RankCell = (rank: number) => (
  <div className="flex items-center justify-center">
    <span className="text-sm font-black text-[#3E4095] bg-gray-100/50 px-3 py-1 rounded-lg">
      # {rank}
    </span>
  </div>
);

interface CandidateCellProps {
  info: {
    full_name: string;
    email?: string;
  };
  profile_picture?: string | null;
  rank: number;
  isPublicView?: boolean;
  isCurrentUser?: boolean;
}

export const CandidateCell: React.FC<CandidateCellProps> = ({
  info,
  profile_picture,
  rank,
  isPublicView = false,
  isCurrentUser = false,
}) => (
  <div className="flex items-center gap-3">
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3E4095] flex items-center justify-center text-xs font-black border border-blue-100/50 overflow-hidden relative">
        {profile_picture ? (
          <Image src={profile_picture} alt="" fill className="object-cover" />
        ) : (
          info?.full_name?.charAt(0).toUpperCase()
        )}
      </div>
      <RankMedal rank={rank} className="absolute -bottom-1 -right-1 drop-shadow-md" />
    </div>
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-800 text-sm">{info?.full_name}</span>
        {isCurrentUser && (
          <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">
            You
          </span>
        )}
      </div>
      {!isPublicView && (
        <span className="text-[10px] font-bold text-gray-400 lowercase tracking-tight">
          {info?.email}
        </span>
      )}
    </div>
  </div>
);


export const SchoolCell = (info: { school_name: string; school_type?: string }, isPublicView = false) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-700 font-bold">{info?.school_name}</span>
    {!isPublicView && info?.school_type && (
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
        {info?.school_type}
      </span>
    )}
  </div>
);

export const BadgeCell = ({
  label,
  variant = 'default',
  className
}: {
  label: string | number;
  variant?: 'default' | 'absent' | 'disqualified';
  className?: string;
}) => (
  <div className="flex justify-center">
    <span
      className={clsx(
        "text-[11px] font-black px-2 py-1.5 rounded-full border uppercase transition-all tracking-widest",
        variant === 'absent' && "text-gray-400 bg-gray-50 border-gray-200 tracking-tight",
        variant === 'disqualified' && "text-red-500 bg-red-50 border-red-200 tracking-tight",
        variant === 'default' && "text-[#3E4095] bg-[#FFFFFF] border-[#3E4095]/40 shadow-sm shadow-emerald-500/5",
        className
      )}
    >
      {label}
    </span>
  </div>
);

export const ViewDetailsButton = ({
  onClick,
  label = "View"
}: {
  onClick: () => void;
  label?: string;
}) => (
  <div className="flex justify-center">
    <button
      onClick={onClick}
      className="bg-[#3E4095] text-white font-black px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#2d2f6e] transition-all shadow-md shadow-[#3E4095]/10 active:scale-95"
    >
      {label}
    </button>
  </div>
);

