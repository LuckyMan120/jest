export interface Contact {
  email?: string;
  fax?: string;
  phoneHome?: string;
  phoneWork?: string;
  phoneMobile?: string;
  name?: string;
}

export interface ExternalContact extends Contact {
  name?: string;
  imageUrl?: string;
}
