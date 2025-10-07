import { useState, useEffect } from 'react';

export default function useGetCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem('session');
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error('Failed to parse session:', error);
    }
  }, []);

  return { user, setUser };
}
