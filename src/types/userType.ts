export interface UserType {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const initialUser: UserType = {
  id: "",
  email: "",
  name: "",
  image: "",
  role: "",
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