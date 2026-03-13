"use client"
import clsx from 'clsx'
import { E164Number } from 'libphonenumber-js/core'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { EyeClosedIcon, EyeOpenIcon } from './SvgAsset/GeneralAsset'








function InputBase({ name, icon, placeholder, className, label, required }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string, label: string, name: string, required?: boolean }>) {
    const { register, formState: { errors } } = useFormContext()
    return (
        <div className="flex flex-col gap-1">
            <div className="flex gap-1">

                <span className='text-[14px] ml-1'>{label}</span> {required && <span className="text-red-500">*</span>}
            </div>
            <div className={clsx('flex border border-[#d0d5dd]  bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
                <span>{icon}</span>
                <input type="text" {...register(name)} placeholder={placeholder} className={clsx('border-0  flex-1 accent-amber-400 p-2 bg-white outline-0')} />
            </div>
            {errors[name] && (
                <span className="text-red-500 text-xs">{errors[name].message as string}</span>
            )}
        </div>
    )
}

const RegisterInput = memo(InputBase, (prev, next) => prev.name === next.name);



export default RegisterInput;











function NeutralInputBase({ name, icon, placeholder, className, label }: Readonly<{ icon?: React.ReactNode, placeholder?: string, className?: string, label: string, name: string }>) {
    const { register, formState: { errors } } = useFormContext()
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
            <div className={clsx('flex border border-[#d0d5dd] bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
                <span>{icon}</span>
                <input type="text" {...register(name)} placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
            </div>
            {errors[name] && (
                <span className="text-red-500 text-xs">{errors[name].message as string}</span>
            )}

        </div>
    )
}

export const NeutralInput = memo(NeutralInputBase, (prev, next) => prev.name === next.name);







export function PhoneNumberInput({ name, placeholder, className, label, required }: Readonly<{ placeholder?: string, required?: boolean, className?: string, label: string, name: string }>) {
    const [value, setValue] = useState<E164Number | undefined>(undefined)
    const { control, formState: { errors } } = useFormContext()
    return (
        <div className="flex flex-col gap-1">
            <div className="flex gap-1">
                <span className='text-[14px] ml-1'>{label}</span> {required && <span className="text-red-500">*</span>}
            </div>
            <div className={clsx('flex border border-[#d0d5dd] bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
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
            {errors[name] && (
                <span className="text-red-500 text-xs">{errors[name].message as string}</span>
            )}
        </div>
    )
}




export function OrdinaryPasswordInput({ name, icon, placeholder, className, label }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string, label: string, name: string }>) {
    const [showPassword, setShowPassword] = useState(false)
    const { register, formState: { errors } } = useFormContext()




    function handleToggle() {
        setShowPassword((val) => !val)
    }
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
            <div className={clsx('flex border border-[#d0d5dd] bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
                <span>{icon}</span>
                <input {...register(name, {
                    required: "Password is required",

                })} type={showPassword ? 'text' : 'password'} placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
                <button type='button' className='cursor-pointer outline-0' onClick={handleToggle}>{showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}</button>
            </div>

            {errors[name] && (
                <span className="text-red-500 text-xs">{errors[name].message as string}</span>
            )}


            {/* Checklist feedback */}



        </div>
    )
}




export function PasswordInput({ name, icon, placeholder, className, label }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string, label: string, name: string }>) {
    const [showPassword, setShowPassword] = useState(false)
    const { register, watch, formState: { errors, isDirty } } = useFormContext()


    const passwordValue = watch(name)

    function handleToggle() {
        setShowPassword((val) => !val)
    }
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
            <div className={clsx('flex border border-[#d0d5dd] bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
                <span>{icon}</span>
                <input {...register(name, {
                    required: "Password is required",
                    validate: {
                        minLength: (v) => v.length >= 8 || "Must be at least 8 characters long",
                        maxLength: (v) => v.length <= 32 || "Must be at most 32 characters long",
                        hasLower: (v) => /[a-z]/.test(v) || "Must contain at least 1 lowercase letter",
                        hasUpper: (v) => /[A-Z]/.test(v) || "Must contain at least 1 uppercase letter",
                        hasNumber: (v) =>
                            /\d/.test(v) || "Must contain at least 1 number",
                        hasSpecial: (v) =>
                            /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                            "Must contain at least 1 special character",

                    }
                })} type={showPassword ? 'text' : 'password'} placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
                <button type='button' className='cursor-pointer outline-0' onClick={handleToggle}>{showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}</button>
            </div>


            {/* Checklist feedback */}
            {
                isDirty &&
                <div className="text-sm mt-2">
                    <p className={passwordValue?.length >= 8 ? "text-[#0F973D]" : "text-[#344054]"}>
                        • 8 - 32 characters long
                    </p>
                    <p className={/[a-z]/.test(passwordValue) ? "text-[#0F973D]" : "text-[#344054]"}>
                        • 1 lowercase character (a-z)
                    </p>
                    <p className={/[A-Z]/.test(passwordValue) ? "text-[#0F973D]" : "text-[#344054]"}>
                        • 1 uppercase character (A-Z)
                    </p>
                    <p className={/\d/.test(passwordValue) ? "text-[#0F973D]" : "text-[#344054]"}>
                        • 1 number (0-9)
                    </p>
                    <p className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue) ? "text-[#0F973D]" : "text-[#344054]"}>
                        • 1 special character (e.g., ! @ # $ %)
                    </p>
                </div>

            }

            {errors[name] && (
                <span className="text-red-500 text-xs">{errors[name].message as string}</span>
            )}
        </div>
    )
}







export function ConfirmPasswordInput({ name, icon, placeholder, className, label }: Readonly<{ icon: React.ReactNode, placeholder?: string, className?: string, label: string, name: string }>) {
    const [showPassword, setShowPassword] = useState(false)
    const { register, watch, formState: { errors } } = useFormContext()


    // const passwordValue = watch(name)

    function handleToggle() {
        setShowPassword((val) => !val)
    }
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[14px] ml-1'>{label}</span>
            <div className={clsx('flex border border-[#d0d5dd] bg-white focus:outline-1 outline-amber-300 gap-1 items-center px-2 rounded-[8px]', className)}>
                <span>{icon}</span>
                <input {...register(name, {
                    required: "Confirm password is required",
                    validate: (val) => {
                        if (watch("password") !== val) {
                            return "Passwords do not match"
                        }
                    },
                })} type={showPassword ? 'text' : 'password'} placeholder={placeholder} className={clsx('border-0 flex-1 accent-amber-400 p-2 bg-white outline-0')} />
                <button type='button' className='cursor-pointer outline-0' onClick={handleToggle}>{showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}</button>
            </div>




            {errors[name] && (
                <span className="text-red-500 text-sm">{errors[name].message as string}</span>
            )}
        </div>
    )
}





// export function OTP({ className, label }:Readonly< { className?: string; label: string }>) {
//     const inputs = useRef<(HTMLInputElement | null)[]>([]);
//     const { register, setValue, watch, formState: { errors } } = useFormContext();

//     const otp = watch('otp') || '';

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//         const value = e.target.value.replace(/\D/, ''); // only digits
//         const otpArray = otp.split('');
//         otpArray[index] = value;
//         const newOtp = otpArray.join('');
//         setValue('otp', newOtp);

//         if (value && index < inputs.current.length - 1) {
//             inputs.current[index + 1]?.focus();
//         }
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//         if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
//             inputs.current[index - 1]?.focus();
//         }
//     };

//     useEffect(() => {
//         inputs.current[0]?.focus();
//     }, []);

//     return (
//         <div className="flex flex-col gap-1 w-full">
//             <span className="text-[14px] ml-1">{label}</span>
//             <div className="flex gap-3 w-full">
//                 {Array.from({ length: 6 }).map((_, index) => (
//                     <div
//                         key={`otpfield-${index}`}
//                         className={clsx(
//                             'flex border-2 w-1/6 bg-white focus-within:border-[#01ACEA] gap-1 items-center px-2 rounded-[8px]',
//                             className
//                         )}
//                     >
//                         <input
//                             type="text"
//                             maxLength={1}
//                             value={otp[index] || ''}
//                             {...register('otp')}
//                             onChange={(e) => handleChange(e, index)}
//                             onKeyDown={(e) => handleKeyDown(e, index)}
//                             ref={(el) => { inputs.current[index] = el }}
//                             className="border-0 w-full p-2 bg-white outline-0 text-center"
//                         />
//                     </div>
//                 ))}
//             </div>
//               {errors['otp'] && (
//                 <span className="text-red-500 text-sm">{errors['otp'].message as string}</span>
//             )}
//         </div>
//     );
// }



export function OTP({ className, label }: { className?: string; label: string }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  // register the field manually
  useEffect(() => {
    register("otp", {
      required: "OTP is required",
      minLength: { value: 6, message: "OTP must be 6 digits" },
      maxLength: { value: 6, message: "OTP must be 6 digits" }
    });
  }, [register]);

  const otp = watch("otp") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/, ""); 
    const otpArray = otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");

    setValue("otp", newOtp, { shouldValidate: true });

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const numericData = pastedData.filter(char => /^\d$/.test(char));
    
    if (numericData.length > 0) {
      const newOtp = numericData.join("").slice(0, 6);
      setValue("otp", newOtp, { shouldValidate: true });
      
      // Focus the appropriate input after paste
      const nextIndex = Math.min(newOtp.length, 5);
      inputs.current[nextIndex]?.focus();
    }
  };

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-[14px] ml-1">{label}</span>
      <div className="flex gap-3 w-full">

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              "flex border-2 w-1/6 bg-white focus-within:border-[#01ACEA] items-center px-2 rounded-[8px]",
              className
            )}
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => { inputs.current[index] = el }}
              className="border-0 w-full p-2 bg-white outline-0 text-center"
            />
          </div>
        ))}

      </div>

      {errors.otp && (
        <span className="text-red-500 text-sm">{errors.otp.message as string}</span>
      )}
    </div>
  );
}

