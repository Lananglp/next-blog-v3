'use client'
import { RootState } from '@/lib/redux';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { handleLogout, setSession } from '@/context/sessionSlice';
import { logout } from '@/app/api/function/auth';
import { initialUser } from '@/types/userType';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

function Header() {

  const { user, isLogin } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedUser: any = jwt.decode(token);
        if (decodedUser) {
          dispatch(setSession(decodedUser));
        } else {
          Cookies.remove("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("token");
      }
    }

  }, [dispatch]);

  const handleSignOut = async () => {
    try {
      const res = await logout();
      if (res.data) {
        dispatch(handleLogout());
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Ops...",
          description: `${error.response?.data?.message}. (${error.response?.status.toString()})` || "Terjadi kesalahan",
        })
      } else {
        console.log("Unknown error:", error);
      }
    }
  }

  return (
    <header>
      <nav className="bg-white border-zinc-200 px-4 lg:px-6 py-2.5 dark:bg-zinc-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="https://flowbite.com" className="flex items-center">
            <Image unoptimized width={64} height={64} src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
          </a>
          <div className="flex items-center lg:order-2">
            {isLogin ? (
              <div className="flex items-center">
                <div className="flex items-center mr-3">
                  <span className="mr-2 text-sm font-medium text-zinc-800 dark:text-white">{user.email ? user.email : 'unkown'}</span>
                  <Image unoptimized width={64} height={64} className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="user photo" />
                </div>
                <button onClick={handleSignOut} type="button">logout</button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-zinc-800 dark:text-white hover:bg-zinc-50 focus:ring-4 focus:ring-zinc-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 dark:hover:bg-zinc-700 focus:outline-none dark:focus:ring-zinc-800">Sign In</Link>
                <Link href="/register" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign Up</Link>
              </>
            )}
            <button onClick={() => setShowMenu(!showMenu)} type="button" className="inline-flex items-center p-2 ml-1 text-sm text-zinc-500 rounded-lg lg:hidden hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600">
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
              <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
          <div className={`${showMenu ? 'block' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}>
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link href="/" className="block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white" aria-current="page">Home</Link>
              </li>
              <li>
                <Link href="/about" className="block py-2 pr-4 pl-3 text-zinc-700 border-b border-zinc-100 hover:bg-zinc-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-zinc-400 lg:dark:hover:text-white dark:hover:bg-zinc-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-zinc-700">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

  )
}

export default Header