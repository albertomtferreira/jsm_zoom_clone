"use client"

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from "@/components/ui/textarea"
import ReactDatePicker from "react-datepicker";
import { Input } from "@/components/ui/input"




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
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

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

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-2'>
              Add a description
            </label>
            <Textarea
              className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
              onChange={(e) => setValues({ ...values, description: e.target.value })}
            />
          </div>
          <div className='flex w-full flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-2'>
              Select a date and time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='dd MMMM, yyyy HH:mm '
              className='w-full rounded bg-dark-3 p-2 focus:outline-none'
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({ title: 'Link Copied' })
          }}
          image="/icons/checked.svg"
          buttonIcon='/icons/copy.svg'
          buttonText='Copy Meeting Link'
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Join meeting with link"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          type=''
          placeholder='Paste the meeting link here'
          className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeBanner