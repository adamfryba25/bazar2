"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Text, Badge, Stack } from "@mantine/core";
import type { Listing } from "@/components/listings/useListings";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const statusColors: Record<string, string> = {
  available: "green",
  reserved: "yellow",
  sold: "red",
};

const statusLabels: Record<string, string> = {
  available: "Dostupné",
  reserved: "Rezervováno",
  sold: "Prodáno",
};

interface Props {
  listings: Listing[];
}

export function ListingsMap({ listings }: Props) {
  const withLocation = listings.filter((l) => l.location);

  if (withLocation.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Žádné inzeráty nemají zadanou polohu.
      </Text>
    );
  }

  return (
    <MapContainer
      center={[49.8, 15.5]}
      zoom={7}
      style={{ height: 300, width: "100%", borderRadius: 12 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withLocation.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.location!.lat, listing.location!.lng]}
        >
          <Popup>
            <Stack gap={4}>
              <Text fw={600} size="sm">{listing.title}</Text>
              <Text size="sm" c="dimmed">{listing.location!.address}</Text>
              <Text size="sm" fw={500} c="orange">
                {listing.isFree ? "Zdarma" : `${Number(listing.price)?.toLocaleString("cs-CZ")} Kč`}
              </Text>
              <Badge color={statusColors[listing.status]} size="sm">
                {statusLabels[listing.status]}
              </Badge>
            </Stack>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
