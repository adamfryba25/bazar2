"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

import {
  Button, Center, Container, Group,
  Loader, Select, SimpleGrid, Stack, Text, Title
} from "@mantine/core";

import { ListingCard } from "@/components/listings/ListingCard";
import { useListings } from "@/components/listings/useListings";
import { categories } from "@/components/data/listings";
import { useAdmin } from "@/components/auth/useAdmin";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";

export default function Page() {
  const params = useParams<{ locale?: string }>();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale ?? "cs";

  const { listings, ready } = useListings();
  const { isAdmin, logout } = useAdmin();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const filteredListings = selectedCategory
    ? listings.filter((l) => l.category === selectedCategory)
    : listings;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Text c="dimmed">
              Vyber si inzerát, otevři detail nebo přidej nový.
            </Text>
          </div>

          <Group>
            {isAdmin ? (
              <>
                <Button component={Link} href={`/${locale}/listings/new`}>
                  Nový inzerát
                </Button>
                <Button variant="subtle" color="gray" onClick={logout}>
                  Odhlásit
                </Button>
              </>
            ) : (
              <Button variant="subtle" onClick={() => setLoginOpen(true)}>
                Admin
              </Button>
            )}
          </Group>
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
            <Text c="dimmed">Žádné inzeráty v této kategorii.</Text>
          </Center>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={{
                  ...listing,
                  price: listing.price ? Number(listing.price) : null,
                }}
                locale={locale}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>

      <AdminLoginModal
        opened={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </Container>
  );
}
