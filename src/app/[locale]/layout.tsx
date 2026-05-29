import { ClerkProvider } from "@clerk/nextjs";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/infrastructure/Providers";
import { PageLayout } from "@/components/layout/PageLayout";
import { routing } from "@/i18n/routing";
import "@mantine/notifications/styles.css";

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <ClerkProvider afterSignOutUrl="/cs">
          <NextIntlClientProvider>
            <MantineProvider
              defaultColorScheme="auto"
              theme={{
                components: {
                  Input: {
                    styles: {
                      input: {
                        backgroundColor: "light-dark(var(--mantine-color-white), #2e2e2e)",
                        borderColor: "light-dark(var(--mantine-color-gray-4), #555555)",
                        color: "light-dark(var(--mantine-color-black), #ffffff)",
                      },
                    },
                  },
                },
              }}
            >
              <Notifications position="top-right" />
              <ModalsProvider>
                <Providers>
                  <PageLayout>{children}</PageLayout>
                </Providers>
              </ModalsProvider>
            </MantineProvider>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
