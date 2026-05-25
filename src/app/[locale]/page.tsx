"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

import {
  Button, Card, Center, Container, Group, NumberInput, Select,
  SimpleGrid, Skeleton, Stack, Text, TextInput
} from "@mantine/core";

import { ListingCard } from "@/components/listings/ListingCard";
import { useListings } from "@/components/listings/useListings";
import { categories } from "@/components/data/listings";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";

const PAGE_SIZE = 6;

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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredListings = listings
    .filter((l) => !selectedCategory || l.category === selectedCategory)
    .filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))
    .filter((l) => {
      if (l.isFree) return true;
      const price = Number(l.price);
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

  const visibleListings = filteredListings.slice(0, visibleCount);
  const hasMore = visibleCount < filteredListings.length;

  const handleFilterChange = () => {
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">

        {/* Hlavička */}
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <Text c="dimmed">
            Vyber si inzerát, otevři detail nebo přidej nový
          </Text>
          <Group gap="sm">
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

        {/* Filtry */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
          <TextInput
            placeholder="Hledat inzeráty"
            value={search}
            onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
          />
          <Select
            placeholder="Všechny kategorie"
            data={[{ value: "", label: "Všechny kategorie" }, ...categories]}
            value={selectedCategory}
            onChange={(val) => { setSelectedCategory(val || null); handleFilterChange(); }}
          />
          <Select
            placeholder="Řadit podle ceny"
            data={[
              { value: "", label: "Výchozí řazení" },
              { value: "asc", label: "Cena od nejnižšího" },
              { value: "desc", label: "Cena od nejvyššího" },
            ]}
            value={sortOrder}
            onChange={(val) => { setSortOrder(val || null); handleFilterChange(); }}
          />
          <NumberInput
            placeholder="Min. cena"
            value={minPrice}
            onChange={(val) => { setMinPrice(typeof val === "number" ? val : undefined); handleFilterChange(); }}
            min={0}
          />
          <NumberInput
            placeholder="Max. cena"
            value={maxPrice}
            onChange={(val) => { setMaxPrice(typeof val === "number" ? val : undefined); handleFilterChange(); }}
            min={0}
          />
        </SimpleGrid>

        {/* Inzeráty */}
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
              : "Žádné inzeráty v tomto filtru."}
          </Text>
        ) : (
          <Stack gap="lg">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {visibleListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  locale={locale}
                />
              ))}
            </SimpleGrid>

            {hasMore && (
              <Center>
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                >
                  Načíst více ({filteredListings.length - visibleCount} zbývá)
                </Button>
              </Center>
            )}
          </Stack>
        )}
      </Stack>

      <AdminLoginModal
        opened={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </Container>
  );
}
