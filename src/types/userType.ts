export interface UserType<T = undefined> {
  id: string;
  username: string;
  email: string;
  name: string;
  image?: string;
  imageId?: string;
  imageProvider: "DEFAULT" | "OTHER";
  role: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
  profile?: T;
  usernameChangedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const initialUser: UserType = {
  id: "",
  username: "",
  email: "",
  name: "",
  image: "",
  imageId: "",
  imageProvider: "DEFAULT",
  role: "",
  totalPosts: 0,
  totalFollowers: 0,
  totalFollowing: 0,
  usernameChangedAt: null,
  createdAt: null,
  updatedAt: null,
}

export interface UserProfileType {
  bio: string | null;
  phone_1: string | null;
  phone_2: string | null;
  url_1: string | null;
  url_2: string | null;
}

export const initialUserProfile: UserProfileType = {
  bio: "",
  phone_1: "",
  phone_2: "",
  url_1: "",
  url_2: "",
}