"use client";

import Link from "next/link";

import {
  Badge, Button, Card, Group, Image,
  Stack, Text, Title
} from "@mantine/core";

import type { Listing } from "@/components/listings/useListings";

const statusLabels: Record<Listing["status"], string> = {
  available: "Dostupné",
  reserved: "Rezervováno",
  sold: "Prodáno / předáno",
};

const statusColors: Record<Listing["status"], string> = {
  available: "green",
  reserved: "yellow",
  sold: "gray",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ListingCard({
  listing,
  locale,
}: {
  listing: Listing & { price: number | null };
  locale: string;
}) {
  return (
    <Card withBorder radius="lg" p="lg">
      <Card.Section>
        <Image
          src={listing.imageUrl ?? "/placeholder.jpg"}
          alt={listing.title}
          height={200}
          fit="cover"
          fallbackSrc="https://placehold.co/400x200?text=Bez+fotky"
        />
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3}>{listing.title}</Title>
            <Text size="sm" c="dimmed">
              {listing.category}
            </Text>
          </div>
          <Badge color={statusColors[listing.status]} variant="light">
            {statusLabels[listing.status]}
          </Badge>
        </Group>
        <Text fw={700} c="orange" size="lg">
          {listing.isFree
            ? "Zdarma"
            : `${Number(listing.price)?.toLocaleString("cs-CZ")} Kč`}
        </Text>
        <Text size="sm" lineClamp={3}>
          {listing.description}
        </Text>
        <Group justify="space-between" align="center" mt="sm">
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              Přidáno: {formatDate(listing.createdAt)}
            </Text>
          </Stack>
          <Button component={Link} href={`/${locale}/listings/${listing.id}`}>
            Detail
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
