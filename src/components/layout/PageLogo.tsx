"use client";

import Image from "next/image";
import { useComputedColorScheme } from "@mantine/core";
import { useTranslations } from "next-intl";

export function PageLogo() {
  const t = useTranslations();
  const colorScheme = useComputedColorScheme("light");

  return (
    <Image
      src="/blogic-logo.png"
      alt={t("common.pageLogo.ariaLabel")}
      width={115}
      height={46}
      style={{
        filter: colorScheme === "dark" ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}
