export interface Config {
  algolia: {
    id: string;
    key: string;
    disabled: boolean;
  };
  communities: string[];
  dfbnet: {
    password: string;
    username: string;
  };
  socialProviders: {
    type: string;
    clientId: string;
  }[];
  fussball: {
    clubId: string;
    endDateOffset: number;
    startDate: number;
  };
  googleCalendarKey: string;
  googleDriveMemberSheet: string;
  googleSpreadSheetKey: string;
  googleMapsKey: string;
  mailjet: {
    key: string;
    secret: string;
  };
  slackWebHookUrl: string;
  twilioNumber: string;
  uppy?: {
    companionUrl: string;
    instagram?: boolean;
    facebook?: boolean;
    dropbox?: boolean;
    googleDrive?: boolean;
    url?: boolean;
    unsplash?: boolean;
  };
}
