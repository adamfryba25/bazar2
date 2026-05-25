"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

import {
  Button, Card, Container, Group, NumberInput, Select,
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
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const filteredListings = listings
    .filter((l) => !selectedCategory || l.category === selectedCategory)
    .filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))
    .filter((l) => {
      if (l.isFree) return true;
      const price = Number(l.price)
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        if (a.isFree) return -1;
        if (b.isFree) return 1;
        return Number(a.price) - Number(b.price);
      }
      if (sortOrder === "desc") {
        if (a.isFree) return 1;
        if (b.isFree) return -1;
        return Number(b.price) - Number(a.price);
      }
      return 0;
    });

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

        <Group align="flex-start" wrap="wrap">
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
            w={220}
          />
          <Select
            placeholder="Řadit podle ceny"
            data={[
              { value: "", label: "Výchozí řazení" },
              { value: "asc", label: "Cena od nejnižšího" },
              { value: "desc", label: "Cena od nejvyššího" },
            ]}
            value={sortOrder}
            onChange={(val) => setSortOrder(val || null)}
            w={200}
          />
          <NumberInput
            placeholder="Min. cena"
            value={minPrice}
            onChange={(val) => setMinPrice(typeof val === "number" ? val : undefined)}
            min={0}
            w={130}
          />
          <NumberInput
            placeholder="Max. cena"
            value={maxPrice}
            onChange={(val) => setMaxPrice(typeof val === "number" ? val : undefined)}
            min={0}
            w={130}
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
              ? `Žádné inzeráty neodpovídající "${search}".`
              : "Žádné inzeráty v tomto filtru"}
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
