"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

import {
  Button, Card, Container, Group, Select,
  SimpleGrid, Skeleton, Stack, Text, TextInput
} from "@mantine/core";

import { ListingCard } from "@/components/listings/ListingCard";
import { useListings } from "@/components/listings/useListings";
import { categories } from "@/components/data/listings";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";

function ListingCardSkeleton() {
  return (
    <Card withBorder radius="lg" p="lg">
      <Card.Section>
        <Skeleton height={200} />
      </Card.Section>
      <Stack gap="sm" mt="md">
        <Skeleton height={20} width="70%" />
        <Skeleton height={16} width="40%" />
        <Skeleton height={24} width="30%" />
        <Skeleton height={14} />
        <Skeleton height={14} />
        <Group justify="space-between" mt="sm">
          <Skeleton height={14} width="40%" />
          <Skeleton height={36} width={80} />
        </Group>
      </Stack>
    </Card>
  );
}

export default function Page() {
  const params = useParams<{ locale?: string }>();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale ?? "cs";

  const { listings, ready } = useListings();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

  const filteredListings = listings
    .filter((l) => !selectedCategory || l.category === selectedCategory)
    .filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Text c="dimmed">
            Vyber si inzerát, otevři detail nebo přidej nový
          </Text>

          <Group>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="subtle">Přihlásit se</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Registrovat se</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button component={Link} href={`/${locale}/listings/new`}>
                Nový inzerát
              </Button>
              <UserButton />
            </SignedIn>
          </Group>
        </Group>

        <Group align="flex-end">
          <TextInput
            placeholder="Hledat inzeráty"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            w={300}
          />
          <Select
            placeholder="Všechny kategorie"
            data={[{ value: "", label: "Všechny kategorie" }, ...categories]}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val || null)}
            w={260}
          />
        </Group>

        {!ready ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </SimpleGrid>
        ) : filteredListings.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {search
              ? `Žádné inzeráty odpovídající "${search}".`
              : "Žádné inzeráty v této kategorii."}
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
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
