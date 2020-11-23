
export interface TimeLineEvent {

  id?: string;
  title: string;

  subTitle?: string;

  icon?: string;
  colour?: string;

  assignedArticleId?: string;
  assignedArticleTitle?: string;

  startDate: number | Date;
  endDate?: number | Date;

  assignedType?: string;
  assignedObjectId?: string;
}
