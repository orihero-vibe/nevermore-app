import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
}

export interface DayData {
  day: number;
  completionPercentage: number;
  tasks: Task[];
}

interface FortyDayState {
  currentDay: number;
  days: DayData[];
  setCurrentDay: (day: number) => void;
  toggleTask: (day: number, taskId: string) => void;
  resetProgress: () => void;
}

// Generate mock data for 40 days
const generateMockDays = (): DayData[] => {
  const days: DayData[] = [];
  
  for (let i = 1; i <= 40; i++) {
    const tasks: Task[] = [
      { id: 'read-book', title: 'Read a book', subtitle: 'Information', completed: i <= 2 },
      { id: 'check-in', title: 'Day 12 Check-in', subtitle: 'Log your day', completed: i <= 1 },
      { id: 'listen', title: 'You should listen to this', subtitle: 'Information', completed: false },
      { id: 'exercise', title: 'Exercise', subtitle: 'Go for a walk', completed: i <= 3 },
      { id: 'meditate', title: 'Mediate', subtitle: 'Inner peace', completed: i <= 1 },
    ];
    
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionPercentage = Math.round((completedTasks / tasks.length) * 100);
    
    days.push({
      day: i,
      completionPercentage,
      tasks,
    });
  }
  
  return days;
};

export const useFortyDayStore = create<FortyDayState>()(
  persist(
    (set, get) => ({
      currentDay: 2, // Start at day 2 as shown in screenshot
      days: generateMockDays(),
      
      setCurrentDay: (day: number) => {
        if (day >= 1 && day <= 40) {
          set({ currentDay: day });
        }
      },
      
      toggleTask: (day: number, taskId: string) => {
        set((state) => ({
          days: state.days.map((d) => {
            if (d.day === day) {
              const updatedTasks = d.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              );
              const completedTasks = updatedTasks.filter(task => task.completed).length;
              const completionPercentage = Math.round((completedTasks / updatedTasks.length) * 100);
              
              return {
                ...d,
                tasks: updatedTasks,
                completionPercentage,
              };
            }
            return d;
          }),
        }));
      },
      
      resetProgress: () => {
        set({
          currentDay: 1,
          days: generateMockDays(),
        });
      },
    }),
    {
      name: 'forty-day-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
