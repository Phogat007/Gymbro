
import { Challenge } from '../types';

export const defaultChallenges: Challenge[] = [
  {
    id: 'ch1',
    name: '30-Day Push-Up Challenge',
    description: 'Increase your push-up count each day for 30 days.',
    duration: 30,
    completed: false,
    progress: 0,
  },
  {
    id: 'ch2',
    name: '7-Day Plank Challenge',
    description: 'Increase your plank time each day for a week.',
    duration: 7,
    completed: false,
    progress: 0,
  },
  {
    id: 'ch3',
    name: '21-Day Squat Challenge',
    description: 'Do more squats each day for 3 weeks.',
    duration: 21,
    completed: false,
    progress: 0,
  }
];
