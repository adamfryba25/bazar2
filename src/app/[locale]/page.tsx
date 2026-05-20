"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

import {
  Button, Center, Container, Group,
  Loader, Select, SimpleGrid, Stack, Text, Title,
} from "@mantine/core";

import { ListingCard } from "@/components/listings/ListingCard";
import { useListings } from "@/components/listings/useListings";
import { categories } from "@/components/data/listings";

export default function Page() {
  const params = useParams<{ locale?: string }>();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale ?? "cs";

  const { listings, ready } = useListings();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredListings = selectedCategory
    ? listings.filter((l) => l.category === selectedCategory)
    : listings;

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
          <Button component={Link} href={`/${locale}/listings/new`}>
            Nový inzerát
          </Button>
        </Group>

        <Select
          placeholder="Filtrovat podle kategorie"
          data={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          clearable
          w={260}
        />

        {!ready ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : filteredListings.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed">Žádné inzeráty v téhle kategorii</Text>
          </Center>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
