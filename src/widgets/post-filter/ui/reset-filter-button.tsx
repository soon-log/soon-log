import { Button } from '@/shared/ui/button';

type ResetFilterButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export function ResetFilterButton({ onClick, disabled }: ResetFilterButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      필터 초기화
    </Button>
  );
}
