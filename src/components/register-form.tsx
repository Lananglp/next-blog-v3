'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { register as signUp } from "@/app/api/function/auth"
import { AxiosError } from "axios"
import Link from "next/link"
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { registerSchema } from "@/helper/schema/registerSchema"
import PasswordIndicator from "./password-indicator"

type RegisterFormType = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export function RegisterForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const { register, handleSubmit, watch, formState: { errors }, setError } = useForm<RegisterFormType>({
        resolver: zodResolver(registerSchema),
    });
    const [loading, setLoading] = useState(false);
    const [errorForm, setErrorForm] = useState<string | null>(null);
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useRouter();

    const onSubmit: SubmitHandler<RegisterFormType> = async (data, event) => {
        event?.preventDefault();
        setLoading(true);
        setErrorForm(null);

        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", { message: "Password tidak sama" });
            setLoading(false);
            return;
        }

        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("email", data.email);
        formdata.append("password", data.password);
        formdata.append("confirmPassword", data.confirmPassword);

        try {
            const res: any = await signUp(formdata);
            if (res.data) {
                toast({
                    title: "Success",
                    description: res.data.message,
                });
                navigate.push("/login");
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                // console.log(error.response);
                setErrorForm(error.response?.data?.message || "Terjadi kesalahan");
                toast({
                    title: "Ops...",
                    description: `${error.response?.data?.message}. (${error.response?.status.toString()})` || "Terjadi kesalahan",
                })
            } else {
                console.log("Unknown error:", error);
            }
        } finally {
            setLoading(false);
        }
    }

    const password = watch("password", "");

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Create your account to log in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input {...register("name")} className={`${errors.name ? "ring-1 ring-red-500" : ""}`} id="name" type="text" placeholder="Name" />
                                {errors.name && <span className='text-red-500 text-xs mb-2'>{errors.name.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input {...register("email")} className={`${errors.email ? "ring-1 ring-red-500" : ""}`} id="email" type="email" placeholder="Email" />
                                {errors.email && <span className='text-red-500 text-xs mb-2'>{errors.email.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input autoComplete="off" {...register("password")} className={`${errors.password ? "ring-1 ring-red-500" : ""}`} id="password" type={showPassword ? "text" : "password"} placeholder="Password" />
                                    <button onClick={() => setShowPassword(!showPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showPassword ? <PiEyeBold className='w-5 h-5' /> : <PiEyeClosedBold className='w-5 h-5' />}</button>
                                </div>
                                {errors.password && <span className='text-red-500 text-xs mb-2'>{errors.password.message}</span>}
                                <PasswordIndicator password={password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input autoComplete="off" {...register("confirmPassword")} className={`${errors.confirmPassword ? "ring-1 ring-red-500" : ""}`} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" />
                                    <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showConfirmPassword ? <PiEyeBold className='w-5 h-5' /> : <PiEyeClosedBold className='w-5 h-5' />}</button>
                                </div>
                                {errors.confirmPassword && <span className='text-red-500 text-xs mb-2'>{errors.confirmPassword.message}</span>}
                            </div>
                            <Button disabled={loading} type="submit" className="w-full">
                                {loading && <LoaderCircle className="animate-spin" />}Register
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Login now
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
