"use client"

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'


const MeetingTypeBanner = () => {
  const router = useRouter()
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })
  const [callDetails, setCallDetails] = useState<Call>()
  const { toast } = useToast()
  const { user } = useUser()
  const client = useStreamVideoClient()
  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time!" })
        return
      }
      const callId = crypto.randomUUID();
      const callType = 'default';
      const call = client.call(callType, callId);
      if (!call) throw new Error("Call not created");
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const description = values.description || 'Instant meeting'
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          }
        }
      })
      setCallDetails(call)
      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({ title: "Meeting Created" })
    } catch (error) {
      console.log(error)
      toast({ title: "Failed to create meeting" })
    }
  }


  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        source="icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
        color="bg-orange-1"
      />
      <HomeCard
        source="icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        color="bg-blue-1"
      />
      <HomeCard
        source="icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push('/recordings')}
        color="bg-purple-1"
      />
      <HomeCard
        source="icons/join-meeting.svg"
        title="Join Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState('isJoiningMeeting')}
        color="bg-yellow-1"
      />
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeBanner