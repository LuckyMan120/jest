export interface Link {
  title: string;
  link: string;

  target?: string;
  icon?: string;

  isMailLink?: boolean;
  isActive?: boolean;
  displayInFooter?: boolean;
  displayInHeader?: boolean;

  assignedCategoryId: string;
  assignedCategoryTitle?: string;
}
