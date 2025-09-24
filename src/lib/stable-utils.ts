import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and normalizes class names, ensuring consistent ordering between server and client
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a stable className string by sorting class names alphabetically within semantic groups
 * This helps prevent hydration mismatches due to className ordering differences
 */
export function stableClassName(...classes: (string | undefined | null | boolean)[]): string {
  const validClasses = classes
    .filter((cls): cls is string => Boolean(cls) && typeof cls === "string")
    .join(" ")
    .split(/\s+/)
    .filter(Boolean);

  // Group classes by type for consistent ordering
  const groups = {
    display: [] as string[],
    position: [] as string[],
    layout: [] as string[],
    sizing: [] as string[],
    spacing: [] as string[],
    typography: [] as string[],
    colors: [] as string[],
    borders: [] as string[],
    effects: [] as string[],
    filters: [] as string[],
    transitions: [] as string[],
    transforms: [] as string[],
    interactivity: [] as string[],
    other: [] as string[],
  };

  validClasses.forEach((cls) => {
    // Display
    if (/^(block|inline|flex|grid|hidden|table)/.test(cls)) {
      groups.display.push(cls);
    }
    // Position
    else if (
      /^(static|fixed|absolute|relative|sticky)/.test(cls) ||
      /^(top|right|bottom|left|inset)-/.test(cls)
    ) {
      groups.position.push(cls);
    }
    // Layout
    else if (
      /^(container|box-|float-|clear-|overflow-|z-)/.test(cls) ||
      /^(justify|items|content|self|place)-/.test(cls)
    ) {
      groups.layout.push(cls);
    }
    // Sizing
    else if (/^(w-|h-|min-|max-|size-)/.test(cls)) {
      groups.sizing.push(cls);
    }
    // Spacing
    else if (/^(m-|p-|space-|gap-)/.test(cls) || /^(m|p|space|gap)(t|r|b|l|x|y)-/.test(cls)) {
      groups.spacing.push(cls);
    }
    // Typography
    else if (/^(text-|font-|leading-|tracking-|whitespace-|break-|hyphens-)/.test(cls)) {
      groups.typography.push(cls);
    }
    // Colors
    else if (
      /-(?:red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-|^(bg-|text-|border-|ring-|fill-|stroke-)/.test(
        cls
      )
    ) {
      groups.colors.push(cls);
    }
    // Borders
    else if (/^(border|ring-|divide-)/.test(cls) && !/-(?:red|blue|green)/.test(cls)) {
      groups.borders.push(cls);
    }
    // Effects
    else if (/^(shadow|opacity-|backdrop-)/.test(cls)) {
      groups.effects.push(cls);
    }
    // Filters
    else if (
      /^(filter|blur-|brightness-|contrast-|grayscale|hue-rotate-|invert|saturate-|sepia)/.test(cls)
    ) {
      groups.filters.push(cls);
    }
    // Transitions
    else if (
      /^(transition|duration-|delay-|ease-)/.test(cls) ||
      cls === "animate-spin" ||
      cls === "animate-pulse"
    ) {
      groups.transitions.push(cls);
    }
    // Transforms
    else if (/^(transform|scale-|rotate-|translate-|skew-|origin-)/.test(cls)) {
      groups.transforms.push(cls);
    }
    // Interactivity
    else if (
      /^(cursor-|select-|resize|snap-|touch-|scroll-|appearance-|outline|focus|hover|active|disabled|group-)/.test(
        cls
      )
    ) {
      groups.interactivity.push(cls);
    }
    // Other
    else {
      groups.other.push(cls);
    }
  });

  // Sort within each group and combine
  return Object.values(groups)
    .filter((group) => group.length > 0)
    .map((group) => group.sort().join(" "))
    .join(" ");
}
