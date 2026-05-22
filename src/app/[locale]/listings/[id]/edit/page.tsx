"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Button, Card, Checkbox, Container, Group, Image,
  NumberInput, Select, Stack, Text, TextInput,
  Textarea, Title, Loader, Center,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { categories, type ListingCategory } from "@/components/data/listings";
import { useListings } from "@/components/listings/useListings";
import { ImageUpload } from "@/components/listings/ImageUpload";

type FormValues = {
  title: string,
  description: string,
  price: number | undefined,
  isFree: boolean,
  category: ListingCategory | "",
  contact: string,
};

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams<{ locale?: string, id?: string }>();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale ?? "cs";
  const id = Array.isArray(params.id) ? params.id[0] : params.id ?? "";

  const { listings, updateListing, refetch, ready } = useListings();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const listing = listings.find((item) => item.id === id);

  const form = useForm<FormValues>({
    initialValues: {
      title: "",
      description: "",
      price: undefined,
      isFree: false,
      category: "",
      contact: "",
    },
    validate: {
      title: (value) => (value.trim().length ? null : "Název je povinný"),
      description: (value) => (value.trim().length ? null : "Popis je povinný"),
      category: (value) => (value ? null : "Kategorie je povinná"),
      contact: (value) => (value.trim().length ? null : "Kontakt je povinný"),
    },
  });

  useEffect(() => {
    if (listing) {
      form.setValues({
        title: listing.title,
        description: listing.description,
        price: listing.price ? Number(listing.price) : undefined,
        isFree: listing.isFree,
        category: listing.category,
        contact: listing.contact,
      });
      setImageUrl(listing.imageUrl);
    }
  }, [listing]);

  const handleSubmit = async (values: FormValues) => {
    console.log("handleSubmit zavolán", values);

    if (!values.isFree && (values.price === undefined || values.price === null)) {
      form.setFieldError("price", "Cena je povinná, pokud nabídka není zdarma");
      return;
    }

    console.log("volám updateListing");

    await updateListing(id, {
      title: values.title,
      description: values.description,
      price: values.isFree ? null : values.price ? Number(values.price) : null,
      isFree: values.isFree,
      category: values.category as ListingCategory,
      contact: values.contact,
      imageUrl: imageUrl,
    });

    console.log("updateListing hotovo");
    window.location.href = `/${locale}/listings/${id}`;
  };

  if (!ready) return <Container py="xl"><Center><Loader /></Center></Container>;

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
        <Group justify="space-between">
          <Title order={1}>Upravit inzerát</Title>
          <Button component={Link} href={`/${locale}/listings/${id}`} variant="subtle">
            Zpět
          </Button>
        </Group>

        <Card withBorder radius="lg" p="xl">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Název"
                placeholder="Např. Psací stůl"
                {...form.getInputProps("title")}
              />

              <Textarea
                label="Popis"
                minRows={5}
                placeholder="Popiš stav, velikost a další detaily"
                {...form.getInputProps("description")}
              />

              <Checkbox
                label="Zdarma"
                checked={form.values.isFree}
                onChange={(event) => {
                  const checked = event.currentTarget.checked;
                  form.setFieldValue("isFree", checked);
                  if (checked) {
                    form.setFieldValue("price", undefined);
                    form.clearFieldError("price");
                  }
                }}
              />

              <NumberInput
                label="Cena"
                placeholder="Např. 500"
                disabled={form.values.isFree}
                value={form.values.price}
                onChange={(value) =>
                  form.setFieldValue(
                    "price",
                    typeof value === "number" ? value : undefined
                  )
                }
                error={form.errors.price}
              />

              <Select
                label="Kategorie"
                data={categories}
                placeholder="Vyber kategorii"
                {...form.getInputProps("category")}
              />

              <TextInput
                label="Kontakt"
                placeholder="Např. jana@blogic.cz"
                {...form.getInputProps("contact")}
              />

              <Stack gap="xs">
                <Text size="sm" fw={500}>Fotka</Text>
                <ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="Náhled fotky"
                    radius="md"
                    h={200}
                    fit="cover"
                  />
                )}
              </Stack>

              <Button type="submit" onClick={() => console.log("klik", form.errors, form.values)}>
                Uložit změny
              </Button>
            </Stack>
          </form>
        </Card>
      </Stack>
    </Container>
  );
}
