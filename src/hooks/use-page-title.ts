'use client'
import { setTitle } from "@/context/titleSlice";
import { useDispatch } from "react-redux";
import { useEffectOnce } from "react-use";

export const usePageTitle = (pageTitle: string) => {
    const dispatch = useDispatch();

    const setPageTitle = (title: string) => {
        dispatch(setTitle(title));
    }

    useEffectOnce(() => {
        setPageTitle(pageTitle);
    });
}