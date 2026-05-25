"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import dynamic from "next/dynamic";

import {
  Badge, Button, Card, Container, Divider,
  Group, Image, Select, Stack, Text, Title
} from "@mantine/core";

import { statuses, type ListingStatus } from "@/components/data/listings";
import { useListings } from "@/components/listings/useListings";
import { useUser } from "@clerk/nextjs";

const ListingsMap = dynamic(
  () => import("@/components/listings/ListingsMap").then((m) => m.ListingsMap),
  { ssr: false }
);

const statusLabels: Record<ListingStatus, string> = {
  available: "Dostupné",
  reserved: "Rezervováno",
  sold: "Prodáno/předáno",
};

const statusColors: Record<ListingStatus, string> = {
  available: "green",
  reserved: "yellow",
  sold: "gray",
};

export default function ListingDetailPage() {
  const params = useParams<{ locale?: string, id?: string }>();
  const router = useRouter();

  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale ?? "cs";
  const id = Array.isArray(params.id) ? params.id[0] : params.id ?? "";

  const { listings, updateListingStatus, deleteListing, ready } = useListings();
  const { isSignedIn } = useUser();

  const listing = listings.find((item) => item.id === id);

  const handleDelete = () => {
    if (!confirm("Opravdu chceš smazat tento inzerát?")) return;
    deleteListing(id);
    notifications.show({
      title: "Inzerát smazán",
      message: "Inzerát byl úspěšně smazán.",
      color: "red",
    });
    router.push(`/${locale}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    notifications.show({
      title: "Odkaz zkopírován",
      message: "Odkaz na inzerát byl zkopírován do schránky.",
      color: "green",
    });
  };

  if (!ready) return <Container py="xl"><Text>Načítám...</Text></Container>;

  if (!listing) return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Title order={1}>Inzerát nenalezen</Title>
        <Button component={Link} href={`/${locale}`}>Zpět na přehled</Button>
      </Stack>
    </Container>
  );

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Button component={Link} href={`/${locale}`} variant="subtle">
            ← Zpět
          </Button>
          <Group>
            <Button variant="subtle" onClick={handleShare}>
              Sdílet
            </Button>
            {isSignedIn && (
              <>
                <Select
                  label="Stav"
                  data={statuses}
                  value={listing.status}
                  onChange={(value) => {
                    if (!value) return;
                    updateListingStatus(listing.id, value as ListingStatus);
                    notifications.show({
                      title: "Stav změněn",
                      message: `Stav inzerátu byl změněn na "${statusLabels[value as ListingStatus]}".`,
                      color: "blue",
                    });
                  }}
                  w={220}
                />
                <Button
                  component={Link}
                  href={`/${locale}/listings/${listing.id}/edit`}
                  variant="light"
                  mt={24}
                >
                  Upravit
                </Button>
                <Button color="red" variant="light" onClick={handleDelete} mt={24}>
                  Smazat
                </Button>
              </>
            )}
          </Group>
        </Group>

        <Card withBorder radius="lg" p={0}>
          {listing.imageUrl && (
            <Card.Section>
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                height={300}
                fit="cover"
                fallbackSrc="https://placehold.co/800x300?text=Bez+fotky"
              />
            </Card.Section>
          )}
          <Stack gap="md" p="xl">
            <Title order={1}>{listing.title}</Title>
            <Group gap="xs">
              <Badge variant="light">{listing.category}</Badge>
              <Badge color={statusColors[listing.status]}>
                {statusLabels[listing.status]}
              </Badge>
            </Group>
            <Text fw={700} size="xl" c="orange">
              {listing.isFree ? "Zdarma" : `${Number(listing.price).toLocaleString("cs-CZ")} Kč`}
            </Text>
            <Divider />
            <Text>{listing.description}</Text>
            <Text c="dimmed">Kontakt: {listing.contact}</Text>

            {/* Mapa — zobrazí se jen pokud má inzerát polohu */}
            {listing.location && (
              <Stack gap="xs">
                <Divider />
                <Text fw={500}>Poloha</Text>
                <Text c="dimmed" size="sm">{listing.location.address}</Text>
                <ListingsMap listings={[listing]} />
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
