
export interface MatchEventCategory {

  id: string;
  title: string;

  parentCategory: string;
  showTextInput?: boolean;
  playerOneTitle: string;
  playerTwoTitle: string;
  inputTitle?: string;
  showPlayerOneInput?: boolean;
  showPlayerTwoInput?: boolean;

  color?: 'info' | 'primary' | 'brand' | 'secondary' | 'warning' | 'danger' | 'success';
}
