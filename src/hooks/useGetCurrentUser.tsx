import React from 'react'

export default function useGetCurrentUser() {
    const currentUser=localStorage.getItem("session")
  return (
    <div>useGetCurrentUser</div>
  )
}
