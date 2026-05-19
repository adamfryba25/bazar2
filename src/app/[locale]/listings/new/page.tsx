"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { categories, type ListingCategory } from "@/components/data/listings";
import { useListings } from "@/components/listings/useListings";

type FormValues = {
  title: string;
  description: string;
  price: number | undefined;
  isFree: boolean;
  category: ListingCategory | "";
  contact: string;
};

export default function NewListingPage() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale =
    Array.isArray(params.locale) ? params.locale[0] : params.locale ?? "cs";

  const { addListing } = useListings();

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

  const handleSubmit = (values: FormValues) => {
    if (!values.isFree && (values.price === undefined || values.price === null)) {
      form.setFieldError("price", "Cena je povinná, pokud nabídka není zdarma");
      return;
    }
  }
}
