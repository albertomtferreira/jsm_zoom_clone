import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';

interface HomeCardProps {
  color: string;
  source: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

/**
 * HomeCard component
 * @param color - Additional class names for the component
 * @param source - Image source for the card
 * @param title - Title of the card
 * @param description - Description of the card
 * @param handleClick - Function to handle click event
 */

const HomeCard = ({ color, source, title, description, handleClick }: HomeCardProps) => {
  return (
    <div className={cn('px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer', color)}
      onClick={handleClick}
    >
      <div className='flex-center glassmorphism size-12 rounded-[10px]'>
        <Image
          src={source}
          alt="meeting icon"
          width={24}
          height={24}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-lg font-normal'>{description}</p>
      </div>
    </div>
  )
}

export default HomeCard