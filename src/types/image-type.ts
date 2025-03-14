export type ImageType = {
    id: string;
    url: string;
    isError?: boolean,
    createdAt: Date | null;
};

export const initialImage = {
    id: "",
    url: "",
    isError: false,
    createdAt: null
};