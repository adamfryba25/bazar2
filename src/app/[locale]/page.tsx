"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ListingCard } from "@/components/listings/ListingCard";
import { useListings } from "@/components/listings/useListings";

export default function Page() {
  const params = useParams<{locale?: string}>();

  const locale =
    Array.isArray(params.locale) ? params.locale[0] : params.locale ?? "cs";

  const { listings, ready } = useListings();

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1}>Přehled inzerátů</Title>
            <Text c="dimmed">
              Vyber si inzerát, otevři detail nebo přidej nový.
            </Text>
          </div>

          <Button component={Link} href={`/${locale}/listing/new`}>
            Nový inzerát
          </Button>

        </Group>

        {!ready ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3}} spacing="lg">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
