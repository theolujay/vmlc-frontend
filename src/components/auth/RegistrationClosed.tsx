import ResponsiveContainer from "../ui/ResponsiveContainer";

export default function RegistrationClosed({ 
  mail, 
  profile_type 
}: Readonly<{ 
  mail?: string; 
  profile_type?: string; 
}>)  {
  
  
  // Capitalize first letter of profile_type
  const profileTitle = profile_type 
    ? profile_type.charAt(0).toUpperCase() + profile_type.slice(1) 
    : '';

  return (
    <div className='flex flex-col items-center m-auto py-10'>
      <ResponsiveContainer className='max-w-[70vw] items-center'>
        <div className='flex gap-3 p-3 flex-col'>
          <h2 className='font-bold text-xl'>
            {profileTitle} Registration is Currently Closed
          </h2>
          <p>
            Our applications process for the next edition of the Verboheit Mathematics League Competition is closed. 
            Please send any enquiries you may have to{' '}
            <a className='text-[#3e4095]' href={`mailto:${mail}`}>
              {mail}
            </a>.
          </p>
        </div>
      </ResponsiveContainer>
    </div>
  );
}