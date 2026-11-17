import { MOBILITY } from './schema';

export function formatMobilityLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const mobilitySelectData = MOBILITY.map((value) => ({
  value,
  label: formatMobilityLabel(value),
}));
