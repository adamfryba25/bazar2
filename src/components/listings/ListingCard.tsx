"Use client";

import Link from "next/link";
import { Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import type { Listing } from "@/components/data/listings";

const statusLabels: Record<Listing["status"], string> = {
  available: "Dostupné",
  reserved: "Rezervovano",
  sold: "Prodáno / předáno",
};

const statusColors: Record<Listing["status"], string> = {
  available: "green",
  reserved: "yellow",
  sold: "gray",
};

export function ListingCard({
  listing,
  locale,
}: {
  listing: Listing;
  locale: string;
}) {
  return (
    <Card withBorder radius="lg" p="lg">
      <Stack gap="sm">
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
            : `${listing.price?.toLocaleString("cs-CZ")} Kč`}
        </Text>
        <Text size="sm" lineClamp={3}>
            {listing.description}
        </Text>

        <Group justify="space-between" align="center" mt="sm">
            <Text size="sm" c="dimmed">
              {listing.contact}
            </Text>

            <Button component={Link} href={`/${locale}/listings/${listing.id}`}>
              Detail
            </Button>
        </Group>

      </Stack>
    </Card>
  );
}
