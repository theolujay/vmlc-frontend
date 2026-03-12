import { useEffect, useState } from 'react'

export default function useEmailCountdown() {
  const [timer, setTimer] = useState(120)
   useEffect(() => {
          let interval: NodeJS.Timeout
          if (timer > 0) {
              interval = setInterval(() => setTimer((t) => t - 1), 1000)
          }
          return () => clearInterval(interval)
      }, [timer])
      return {timer,setTimer}
}
