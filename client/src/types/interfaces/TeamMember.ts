import { Role } from "./Role";

export interface TeamMember {
    id: number;
    member_name: string;
    image: string;
    username: string;
    password: string;
    email: string;
    bio: string;
    Roles: Role[];
    position: string;
    twitter_link: string;
    instagram_link: string;
    facebook_link: string;
    linkedin_link: string;
  }
  
  export interface TeamMemberValues {
    member_name: string;
    roleIds: number[];
  }