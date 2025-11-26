import ResponsiveContainer from "../ui/ResponsiveContainer";

export default function RegistrationClosed({ mail }: Readonly<{ mail?: string }>) {
  const year = new Date().getFullYear();

  return <div className='flex flex-col items-center m-auto py-10'>

    <ResponsiveContainer className='max-w-[70vw] items-center '>

      <div className='flex gap-3 p-3  flex-col'>
        <h2 className='font-bold text-xl'>Registration Closed</h2>
        <p>Our applications process for the Class of {year} is now closed. Please get in touch to find out when our 2026 applications open by registering your interest at <a className='text-[#3e4095]' href={`mailto:${mail}`}>{mail}</a> .</p>
      </div>
    </ResponsiveContainer>
  </div>
}