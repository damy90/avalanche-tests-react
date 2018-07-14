import { Moment } from 'moment';

export interface IAvalancheTest {
  id?: number;
  lon?: number;
  lat?: number;
  place?: string;
  dangerLevel?: number;
  content?: string;
  user?: string;
  dateCreated?: Moment;
}

export const defaultValue: Readonly<IAvalancheTest> = {};
