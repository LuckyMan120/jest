import { BaseInterface } from '@shared/_interfaces/base.interface';

export interface PlayerGR extends BaseInterface {
  'Passnr.'?: number;
  Name?: string;
  Vorname?: string;
  Altersklasse?: string;
  Geburtsdatum?: number;
  'Spielrecht Pflicht / Verband'?: number | null;
  'Spielrecht Freundschaft / Privat'?: number | null;
  Abmeldung?: number;
  Spielerstatus?: string;
  'Gast/Zweitspielrecht'?: string;
  Spielzeit?: string;
  Spielart?: string;
  Passdruck?: number;
  Einsetzbar?: string;
  Stammverein?: string;
}
