"use client";

import { authCheck } from "@/app/api/function/auth";
import { setSession } from "@/context/sessionSlice";
import { responseStatus } from "@/helper/system-config";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const res = await authCheck();
                if (res.data.user) {
                    dispatch(setSession(res.data.user));
                }
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.status === responseStatus.unauthorized) {
                        console.log(error.response?.data?.status);
                    } else {
                        console.error(error.response?.data);
                    }
                } else {
                    console.log("Unknown error:", error);
                }
            }
        };

        fetchUser();
    }, [dispatch]);

    return children;
}

export default AuthProvider;