"use client";

import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light");

  return (
    <ActionIcon
      variant="subtle"
      onClick={() => setColorScheme(computed === "light" ? "dark" : "light")}
      aria-label="Přepnout na Dark Mode"
    >
      {computed === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
    </ActionIcon>
  );
}
