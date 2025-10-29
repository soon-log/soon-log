import { DayOfWeekType } from '../_types/webtoon';

export const DAY_OF_WEEK: Record<DayOfWeekType, { label: string; value: DayOfWeekType }> = {
  monday: {
    label: '월요일',
    value: 'monday'
  },
  tuesday: {
    label: '화요일',
    value: 'tuesday'
  },
  wednesday: {
    label: '수요일',
    value: 'wednesday'
  },
  thursday: {
    label: '목요일',
    value: 'thursday'
  },
  friday: {
    label: '금요일',
    value: 'friday'
  },
  saturday: {
    label: '토요일',
    value: 'saturday'
  },
  sunday: {
    label: '일요일',
    value: 'sunday'
  }
};
