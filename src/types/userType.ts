export interface UserType {
  id: string;
  email: string;
  name: string;
  image?: string;
  imageId?: string;
  imageProvider: "DEFAULT" | "OTHER";
  role: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
  createdAt: string;
  updatedAt: string;
}

export const initialUser: UserType = {
  id: "",
  email: "",
  name: "",
  image: "",
  imageId: "",
  imageProvider: "DEFAULT",
  role: "",
  totalPosts: 0,
  totalFollowers: 0,
  totalFollowing: 0,
  createdAt: "",
  updatedAt: "",
}

// export interface UserType {
//   id: string;
//   email: string;
//   name: string;
//   image?: string;
//   role: string;
//   posts?: {
//     id: string;
//   }[];
//   profile?: {
//     id: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// export type FormUserType = {
//     userId: string;
//     name: string;
//     email: string;
//     phone: string;
//     address: string;
//     placeOfBirth: string;
//     dateOfBirth: string;
//     picture?: File | null;
//     password: string;
//     confirmPassword: string;
// }