import { CommentType } from "@/helper/schema/schema";
import api from "@/lib/axios";
import { AxiosResponse } from "axios";

export const getReplies = async (commentId: string): Promise<AxiosResponse<CommentType[]>> => {
    return await api.get<CommentType[]>(`/api/posts/comment/replies?commentId=${commentId}`, { withCredentials: true });
};