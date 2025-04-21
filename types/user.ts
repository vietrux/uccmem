export interface User {
  uid: string;
  displayName: string;
  job_title: string;
  email: string;
  aboutMe: string;
}

export interface GravatarEntry {
  hash: string;
  requestHash: string;
  profileUrl: string;
  preferredUsername: string;
  thumbnailUrl: string;
  photos: {
    value: string;
    type: string;
  }[];
  displayName: string;
  aboutMe?: string;
  job_title?: string;
  company?: string;
  profileBackground?: {
    color: string;
  };
}

export interface GravatarProfile {
  entry: GravatarEntry[];
}