
"use client"

type UploadCardType = {
  label: string;
  file?: File | null;
  onFileChange: (file: File | null) => void;
}


import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import React from 'react'
import { DeleteIcon, TrustIcon, UploadDocumentIcon, UploadIcon } from '../GeneralIcon'
import { formatStorageSize } from '@/utils/formatFileSize';
import { useAuth } from '@/contexts/AuthProvider';
import { toast } from 'react-toastify';

export default function UploadCard({
  label,
  file,
  onFileChange,
}:

  UploadCardType
) {

  function handleDelete() {
    onFileChange(null);
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      toast.error("File too large! Must be less than 2MB.");
      event.target.value = "";
      return;
    }
    if (selectedFile) {
      onFileChange(selectedFile);

    }
    event.target.value = "";
  }


  const { authState } = useAuth()
  
  return (
    <ResponsiveContainer className='md:col-span-2 gap-4 '>
      <div className="flex border-b border-[#E4E7EC]">
        <p className='text-xl '>Upload {label}</p>
      </div>

      <div className='flex flex-col items-center gap-2 justify-center'>
        <UploadIsland onUpload={handleFile} />
        {file && <UploadZone onDelete={handleDelete} fileName={file.name} size={file.size} />}
      </div>

      <div className="flex gap-1 flex-col">
        <p className='font-bold'>Verification Requirement</p>
        <p>
          To continue with the verification process, please upload one of the following documents:
          {authState?.userType === 'candidate' ? ' recent school result' : ' recent utility bill or National Identification Number (NIN).'}
          {/* your passport,  */}
        </p>
      </div>

      <div className="flex bg-[#E6F4ED] p-3 gap-3 items-center rounded-lg ">
        <span><TrustIcon /></span>
        <p>
          To ensure your identity and protect your account, we require ID verification.
          The ID we capture is solely for the purpose of verification.
        </p>
      </div>
    </ResponsiveContainer>
  );
}

function UploadIsland({ onUpload }: { onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className='bg-[#F5FCFE] gap-3 p-2 md:p-0 md:w-[60%] flex-col items-center flex rounded-xl '>
      <span><UploadIcon /></span>
      <div className="flex">
        <input onChange={onUpload} type="file" id="upload" className='hidden' />
        <label htmlFor="upload" className='text-balance'>
          <span className='font-bold text-[#018ABB] cursor-pointer mr-3'>Click to upload</span>
          <span>or drag and drop <br /> SVG, PNG, JPG or PDF (max. 2MB)</span>
        </label>
      </div>
    </div>
  );
}

function UploadZone({
  fileName,
  size,
  onDelete,
}: {
  fileName: string;
  size: number;
  onDelete: () => void;
}) {
  return (
    <div className='border-[#018ABB] border gap-3 p-2 w-full md:w-[60%] flex-col items-center flex rounded-xl '>
      <div className="flex justify-between w-full">
        <div className="flex gap-2">
          <span><UploadDocumentIcon /></span>
          <div className="flex flex-col">
            <span className='font-normal'>{fileName}</span>
            <span className='text-sm'>{formatStorageSize(size)}</span>
          </div>
        </div>
        <button className='cursor-pointer' onClick={onDelete}><DeleteIcon /></button>
      </div>

      <div className="progress flex w-full items-center justify-center gap-2">
        <div className='w-3/4 h-2 rounded-md bg-[#018ABB]'></div>
        <span>100%</span>
      </div>
    </div>
  );
}
