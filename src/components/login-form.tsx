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
import { loginSchema } from "@/helper/schema/loginSchema"
import { useToast } from "@/hooks/use-toast"
import { authCheckRole, login } from "@/app/api/function/auth"
import { AxiosError } from "axios"
import Link from "next/link"
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { LoaderCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { UserType } from "@/types/userType"
import { setSession } from "@/context/sessionSlice"
import { Separator } from "./ui/separator"

type LoginFormType = {
  credential: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  
  const handleSetSession = (data: UserType) => {
    dispatch(setSession(data));
  };

  const onSubmit: SubmitHandler<LoginFormType> = async (data, event) => {
    event?.preventDefault();
    setLoading(true);
    setError(null);

    const formdata = new FormData();
    formdata.append("credential", data.credential);
    formdata.append("password", data.password);

    try {
      const res: any = await login(formdata);
      if (res.data.user) {
        handleSetSession(res.data.user);
        toast({
          title: "Welcome!",
          description: res.data.message,
        });
        if (res.data.user.role === "ADMIN") {
          setTimeout(() => {
            setLoading(false);
            window.location.href = "/admin";
          }, 1000)
          // navigate.push("/admin");
        } else if (pathname === "/login") {
          setLoading(false);
          navigate.push("/");
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // console.log(error.response);
        setError(error.response?.data?.message || "Terjadi kesalahan");
        toast({
          title: "Ops...",
          description: `${error.response?.data?.message}. (${error.response?.status.toString()})` || "Terjadi kesalahan",
        })
      } else {
        console.log("Unknown error:", error);
      }
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold text-black dark:text-white">Login</h1>
        <p>Enter your email below to login to your account</p>
      </div>
      <Separator />
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="credential">Username / Email</Label>
              <Input {...register("credential")} variant={errors.credential ? 'danger' : 'primary'} id="credential" type="text" placeholder="your username or email" />
              {errors.credential && <span className='text-red-500 text-xs mb-2'>{errors.credential.message}</span>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input autoComplete="off" {...register("password")} variant={errors.password ? 'danger' : 'primary'} id="password" type={showPassword ? "text" : "password"} placeholder="Password" />
                <button onClick={() => setShowPassword(!showPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showPassword ? <PiEyeBold className='w-5 h-5' /> : <PiEyeClosedBold className='w-5 h-5' />}</button>
              </div>
              {errors.password && <span className='text-red-500 text-xs mb-2'>{errors.password.message}</span>}
            </div>
            <Button disabled={loading} type="submit" className="w-full">
              {loading && <LoaderCircle className="animate-spin" />}Login
            </Button>
            {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
