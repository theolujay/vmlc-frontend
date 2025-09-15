"use client"
import clsx from 'clsx'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import React, { useState } from 'react'
// import PhoneInputWithCountrySelect from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/core'; 
import { EyeClosedIcon, EyeOpenIcon } from './SvgAsset/GeneralAsset'

export default function Input({ icon, placeholder, className,label }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string ,label:string}>) {
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
        <div className={clsx('flex border-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]',className)}>
            <span>{icon}</span>
            <input type="text" placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
        </div>
        </div>
    )
}





export function PhoneNumberInput({  placeholder, className,label }: Readonly<{  placeholder?: string, className?: string ,label:string}>) {
    const [value,setValue]=useState<E164Number|undefined>(undefined)
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
        <div className={clsx('flex border-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]',className)}>
            {/* <span>{icon}</span> */}
            <PhoneInput defaultCountry='NG' className={clsx('flex p-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center  rounded-[8px]',className)} placeholder={placeholder} value={value} onChange={val=>setValue(val)}/>
            {/* <input type="text" placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} /> */}
        </div>
        </div>
    )
}







export function PasswordInput({ icon, placeholder, className,label }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string ,label:string}>) {
    const [showPassword,setShowPassword]=useState(false)

    function handleToggle(){
        setShowPassword((val)=>!val)
    }
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
        <div className={clsx('flex border-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]',className)}>
            <span>{icon}</span>
            <input type={showPassword?'text':'password'} placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
             <button className='cursor-pointer outline-0' onClick={handleToggle}>{showPassword?<EyeOpenIcon/>:<EyeClosedIcon/>}</button>
        </div>
        </div>
    )
}