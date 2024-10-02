import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ToggleGroupButtonsProps {
  allMigraines: () => void;
  currentMonth: () => void;
  last3Months: () => void;
}

export function DateRangeToggle({
  allMigraines,
  currentMonth,
  last3Months,
}: ToggleGroupButtonsProps) {
  return (
    <ToggleGroup type="single" defaultValue="3-months">
      <ToggleGroupItem
        value="3-months"
        aria-label="Toggle bold"
        className="bg-card-coolorsPrimary text-card-darkModeTextPrimary hover:bg-card-darkModePrimary hover:text-card-darkModeTextPrimary mr-3"
      >
        <button onClick={last3Months}>Last 3 months</button>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="current-month"
        aria-label="Toggle italic"
        className="bg-card-coolorsPrimary text-card-darkModeTextPrimary hover:bg-card-darkModePrimary hover:text-card-darkModeTextPrimary mr-3"
      >
        <button onClick={currentMonth}>Current month</button>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="all-time"
        aria-label="Toggle strikethrough"
        className="bg-card-coolorsPrimary text-card-darkModeTextPrimary hover:bg-card-darkModePrimary hover:text-card-darkModeTextPrimary mr-3"
      >
        <button onClick={allMigraines}>All time</button>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
