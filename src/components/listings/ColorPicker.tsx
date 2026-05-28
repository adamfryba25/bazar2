"use client";

import { Group, Text, Tooltip } from "@mantine/core";

const PRESET_COLORS = [
  { label: "Bílá", value: "#ffffff" },
  { label: "Modrá", value: "#dbeafe" },
  { label: "Zelená", value: "#dcfce7" },
  { label: "Žlutá", value: "#fef9c3" },
  { label: "Oranžová", value: "#ffedd5" },
  { label: "Červená", value: "#fee2e2" },
  { label: "Fialová", value: "#ede9fe" },
  { label: "Růžová", value: "#fce7f3" },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ListingColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div>
      <Text size="sm" fw={500} mb={6}>Barva inzerátu</Text>
      <Group gap="xs">
        {PRESET_COLORS.map((color) => (
          <Tooltip key={color.value} label={color.label} withArrow>
            <button
              type="button"
              onClick={() => onChange(color.value)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: color.value,
                border: value === color.value
                  ? "3px solid #228be6"
                  : "2px solid #555",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.15)",
                cursor: "pointer",
                transform: value === color.value ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.15s, border 0.15s",
                padding: 0,
              }}
              aria-label={color.label}
            />
          </Tooltip>
        ))}
      </Group>
    </div>
  );
}
