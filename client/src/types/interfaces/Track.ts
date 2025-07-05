import { Genre } from './Genre';
import { Release } from './Release';    

export interface Track {

  id: number;
  title: string;
  audioUrl: string;
  duration?: string;
}
