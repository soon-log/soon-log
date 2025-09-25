import { Calendar } from 'lucide-react';

import { formatDateToKorean } from '@/utils/date';

export default function DateViewer({ date }: { date: string }) {
  const formattedDate = formatDateToKorean(date);
  return (
    <time
      className="text-muted-foreground/80 inline-flex items-center gap-1.5 text-xs font-medium"
      dateTime={date}
      aria-label={`게시일: ${formattedDate}`}
    >
      <Calendar className="h-3.5 w-3.5" />
      <span className="tracking-wide">{formattedDate}</span>
    </time>
  );
}
