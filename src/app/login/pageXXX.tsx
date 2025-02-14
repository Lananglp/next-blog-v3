'use client'
import PasswordIndicator from '@/components/password-indicator'
import { loginSchema } from '@/helper/schema/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { login } from '../api/function/auth'
import { AxiosError } from 'axios'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type LoginFormType = {
    email: string
    password: string
}

function LoginPage() {

    const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginFormType>({
        resolver: zodResolver(loginSchema),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
        console.log(data);
        setLoading(true);
        setError(null);

        const formdata = new FormData();
        formdata.append("email", data.email);
        formdata.append("password", data.password);

        try {
            const res = await login(formdata);
            console.log(res.data);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response);
                setError(error.response?.data?.message || "Terjadi kesalahan");
                toast({
                    title: error.response?.status.toString() || "Terjadi kesalahan",
                    description: error.response?.data?.message || "Terjadi kesalahan",
                })
            } else {
                console.log("Unknown error:", error);
            }
        }
    }
    
    const password = watch("password", "");
    

    return (
        <div className='lg:flex justify-center items-center h-screen'>
            <div className="mx-auto min-w-96 max-w-sm py-12">
                <div className='text-center mb-6'>
                    <h1 className="text-white text-3xl mb-3">Login</h1>
                    <p>Masuk ke akun anda</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
                    <Input {...register("email")} placeholder='Email' className='bg-transparent border border-zinc-700' />
                    {errors.email && <span className='text-red-300 text-sm mb-2'>{errors.email.message}</span>}
                    <Input {...register("password")} placeholder='Password' className='bg-transparent border border-zinc-700' />
                    <PasswordIndicator password={password} />
                    {errors.password && <span className='text-red-300 text-sm mb-2'>{errors.password.message}</span>}
                    <Button type="submit" className='p-2 block w-full bg-zinc-700'>Submit</Button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage