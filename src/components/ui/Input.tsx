"use client"
import clsx from 'clsx'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import React, { memo, useEffect, useRef, useState } from 'react'
import { E164Number } from 'libphonenumber-js/core';
import { EyeClosedIcon, EyeOpenIcon } from './SvgAsset/GeneralAsset'
import { Controller, useFormContext } from 'react-hook-form'

// export default function Input({ icon, placeholder, className, label }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string, label: string }>) {
//     return (
//         <div className="flex flex-col gap-1">
//             <span className='text-[14px] ml-1'>{label}</span>
//             <div className={clsx('flex border-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
//                 <span>{icon}</span>
//                 <input type="text" placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
//             </div>
//         </div>
//     )
// }






function InputBase({ name, icon, placeholder, className, label }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string, label: string, name: string }>) {
    const { register, formState: { isDirty } } = useFormContext()
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
            <div className={clsx('flex border-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
                <span>{icon}</span>
                <input type="text" {...register(name)} placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
            </div>
        </div>
    )
}

const Input = memo(InputBase, (prev, next) => prev.name === next.name);



export default Input;



export function PhoneNumberInput({ name, placeholder, className, label }: Readonly<{ placeholder?: string, className?: string, label: string, name: string }>) {
    const [value, setValue] = useState<E164Number | undefined>(undefined)
    const { control, register, formState: { isDirty } } = useFormContext()
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
            <div className={clsx('flex border-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
                {/* <span>{icon}</span> */}
                <Controller
                    name={name}
                    control={control}
                    render={
                        ({ field }) =>
                            <PhoneInput {...field} value={field.value ?? value} defaultCountry='NG' className={clsx('flex p-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center  rounded-[8px]', className)} placeholder={placeholder} onChange={val => {
                                field.onChange(val)
                                setValue(val ?? undefined);
                            }} />
                    }
                />
                {/* <input type="text" placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} /> */}
            </div>
        </div>
    )
}







export function PasswordInput({ name, icon, placeholder, className, label }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string, label: string, name: string }>) {
    const [showPassword, setShowPassword] = useState(false)
    const { register, formState: { isDirty } } = useFormContext()

    function handleToggle() {
        setShowPassword((val) => !val)
    }
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
            <div className={clsx('flex border-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
                <span>{icon}</span>
                <input {...register(name)} type={showPassword ? 'text' : 'password'} placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
                <button type='button' className='cursor-pointer outline-0' onClick={handleToggle}>{showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}</button>
            </div>
        </div>
    )
}




export function OTP({ className, label }: Readonly<{ className?: string, label: string }>) {
    const inputs = useRef<(HTMLInputElement | null)[]>([])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (value && index < inputs.current.length - 1) {
            inputs.current[index + 1]?.focus();
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }


    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);
    return (
        <div className="flex flex-col gap-1 w-full">
            <span className='text-[14px] ml-1'>{label}</span>
            <div className="flex gap-3 w-full">

                {Array.from({ length: 6 }).map((_, index) => <div key={`otpfield-${index}`} className={clsx('flex border-2 w-1/6  bg-white focus-within:outline-1 focus-within:border-[#01ACEA] focus:outline-[#01ACEA] gap-1 items-center px-2 rounded-[8px]', className)}>

                    <input type="text" maxLength={1} onChange={e => handleChange(e, index)} onKeyDown={e => handleKeyDown(e, index)} ref={el => {
                        inputs.current[index] = el;
                    }} className={clsx('border-0 w-full accent-amber-400 p-2 bg-white outline-0 ')} />
                </div>)}
            </div>
            {/* <div className={clsx('flex border-2 bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]',className)}>
           
            <input type="text" placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
        </div> */}
        </div>
    )
}