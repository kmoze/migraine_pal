import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function ToggleGroupButtons({
  allMigraines,
  currentMonth,
  last3Months,
}) {
  return (
    <ToggleGroup type="single" defaultValue="bold">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <button onClick={last3Months}>Bold</button>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <button onClick={currentMonth}>Italic</button>
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <button onClick={allMigraines}>Strikethrough</button>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
