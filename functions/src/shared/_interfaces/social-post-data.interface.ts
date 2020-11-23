export interface SocialPostData {
  userAccessToken: string;
  mode: 'photo' | 'link';
  type: 'facebook' | 'twitter';
  message: string;
  link?: string;
  imageURL?: any;
  startDate: number;
};
