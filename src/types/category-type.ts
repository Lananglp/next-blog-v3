export type CategoriesType = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export const initialCategory = {
    id: "",
    name: "",
    createdAt: new Date(),
    updatedAt: new Date(),
};