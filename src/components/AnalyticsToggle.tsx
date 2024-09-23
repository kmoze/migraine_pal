import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ToggleGroupButtonsProps {
  allMigraines: () => void;
  currentMonth: () => void;
  last3Months: () => void;
}

export function ToggleGroupButtons({
  allMigraines,
  currentMonth,
  last3Months,
}: ToggleGroupButtonsProps) {
  return (
    <ToggleGroup type="single" defaultValue="bold">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <button onClick={last3Months}>Last 3 months</button>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <button onClick={currentMonth}>Current month</button>
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <button onClick={allMigraines}>All time</button>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
