'use client'
import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function PasswordIndicator({ password }: { password: string }) {

    const [strength, setStrength] = useState<number>(0);

    const calculateStrength = (password: string) => {
        let score = 0;
        if (password.length >= 8) score += 25;
        if (/[a-z]/.test(password)) score += 15;
        if (/[A-Z]/.test(password)) score += 20;
        if (/[0-9]/.test(password)) score += 20;
        if (/[\W_]/.test(password)) score += 20;
        return score;
    };

    useEffect(() => {
        setStrength(calculateStrength(password));
    }, [password]);

    return (
        <div>
            <div className='mb-8 w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-xl'>
                <div
                    className='h-full rounded-xl transition-all duration-500 ease-in-out'
                    style={{
                        width: `${strength}%`,
                        background:
                            strength < 40 ? "red" : strength < 70 ? "orange" : "green",
                    }}
                />
                <div className='flex justify-between items-center mt-1'>
                    <span className={`${strength === 0 ? "text-zinc-500" : strength > 0 ? "text-zinc-800 dark:text-zinc-300" : "text-zinc-800 dark:text-zinc-300"} text-xs`}>Low</span>
                    <span className={`${strength >= 40 ? "text-zinc-800 dark:text-zinc-300" : "text-zinc-500"} text-xs`}>Medium</span>
                    <span className={`${strength >= 70 ? "text-zinc-800 dark:text-zinc-300" : "text-zinc-500"} text-xs`}>High</span>
                </div>
            </div>

            <ul className='flex flex-col gap-1 text-sm'>
                <li className={`${password.length >= 8 ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-300"}`}>
                    {password.length >= 8 ? <Check className='text-green-400 inline h-4 w-4 mb-0.5 me-1' /> : <Check className='text-zinc-400 inline h-4 w-4 mb-0.5 me-1' />} Minimum 8 characters
                </li>
                <li className={`${/[a-z]/.test(password) ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-300"}`}>
                    {/[a-z]/.test(password) ? <Check className='text-green-400 inline h-4 w-4 mb-0.5 me-1' /> : <Check className='text-zinc-400 inline h-4 w-4 mb-0.5 me-1' />} Contains lowercase letters
                </li>
                <li className={`${/[A-Z]/.test(password) ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-300"}`}>
                    {/[A-Z]/.test(password) ? <Check className='text-green-400 inline h-4 w-4 mb-0.5 me-1' /> : <Check className='text-zinc-400 inline h-4 w-4 mb-0.5 me-1' />} Contains uppercase letters
                </li>
                <li className={`${/[0-9]/.test(password) ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-300"}`}>
                    {/[0-9]/.test(password) ? <Check className='text-green-400 inline h-4 w-4 mb-0.5 me-1' /> : <Check className='text-zinc-400 inline h-4 w-4 mb-0.5 me-1' />} Contains numbers
                </li>
                <li className={`${/[\W_]/.test(password) ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-300"}`}>
                    {/[\W_]/.test(password) ? <Check className='text-green-400 inline h-4 w-4 mb-0.5 me-1' /> : <Check className='text-zinc-400 inline h-4 w-4 mb-0.5 me-1' />} Contains special characters
                </li>
            </ul>
        </div>
    )
}

export default PasswordIndicator