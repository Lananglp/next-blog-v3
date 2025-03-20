import { getUsers } from "@/app/api/function/users";
import { GetResponseType } from "@/types/fetch-type";
import { UserType } from "@/types/userType";
import { useCallback, useEffect, useState } from "react";

export const useFetchUsers = (id?: string, page?: number, limit?: number, search?: string) => {
    const [users, setUsers] = useState<GetResponseType<UserType[]> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getUsers(id, page, limit, search);
            setUsers(res.data);
        } catch (err) {
            setError("Error fetching users");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { users, loading, error, reload: fetchUsers };
};