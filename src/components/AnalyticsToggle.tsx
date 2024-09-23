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
    <ToggleGroup type="single" defaultValue="bold" className="ml-5">
      <ToggleGroupItem
        value="bold"
        aria-label="Toggle bold"
        className="bg-card-coolorsPrimary text-card-darkModeTextPrimary hover:bg-card-darkModePrimary hover:text-card-darkModeTextPrimary"
      >
        <button onClick={last3Months}>Last 3 months</button>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="italic"
        aria-label="Toggle italic"
        className="bg-card-coolorsPrimary text-card-darkModeTextPrimary hover:bg-card-darkModePrimary hover:text-card-darkModeTextPrimary "
      >
        <button onClick={currentMonth}>Current month</button>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="strikethrough"
        aria-label="Toggle strikethrough"
        className="bg-card-coolorsPrimary text-card-darkModeTextPrimary hover:bg-card-darkModePrimary hover:text-card-darkModeTextPrimary "
      >
        <button onClick={allMigraines}>All time</button>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
