/**
 * Ruler of a state
 */

export interface IRuler {
  state: string;
  title: string;
  givenName: string;
  reignStart: number;
  reignEnd: number;
}
