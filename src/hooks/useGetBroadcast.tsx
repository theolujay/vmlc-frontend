import { BroadcastMgtService } from '@/services/BroadcastMgt.service'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useGetBroadcast() {
 const {isPending,data}=useQuery({
    queryKey:['broadcast-management'],
    queryFn:BroadcastMgtService.getBroadcastList
 })
 return {isPending,data}
}
