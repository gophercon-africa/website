export interface ScheduleActivity {
  activity: string;
  startTime: string;
  endTime: string;
  duration: string;
  speaker?: string;
  talk?: string;
  notes?: string;
  requirements?: string;
}

export interface DaySchedule {
  day: number;
  date?: string;
  activities: ScheduleActivity[];
}
