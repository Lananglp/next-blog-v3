'use client'
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium } from 'lucide-react'
import React from 'react'
import { useBatteryStatus } from 'react-haiku';

function BatteryStatus() {

    const {level, isCharging} = useBatteryStatus();

  return (
    <p className='hidden md:inline-block text-sm'>
        {!isCharging ? level >= 90 ? (
            <BatteryFull className="inline h-5 w-5 mb-0.5 me-1" />
        ) : level >= 60 ? (
            <BatteryMedium className="inline h-5 w-5 mb-0.5 me-1" />
        ) : level >= 20 ? (
            <BatteryMedium className="inline h-5 w-5 mb-0.5 me-1" />
        ) : level >= 0 && (
            <BatteryLow className="inline h-5 w-5 mb-0.5 me-1" />
        ) : (
            <BatteryCharging className="inline h-5 w-5 mb-0.5 me-1" />
        )}
        {level}%
    </p>
  )
}

export default BatteryStatus