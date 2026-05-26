"use client";

import { useEffect, useRef, useState } from "react";
import {
  Avatar, Box, Button, Card, Group, ScrollArea,
  Stack, Text, Textarea, Title
} from "@mantine/core";

import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

type Message = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};

interface Props {
  listingId: string;
}

export function ListingChat({ listingId }: Props) {
  const { isSignedIn, user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages/${listingId}`);
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [listingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSent = async () => {
    if (!text.trim() || !user) return;
    setSending(true);
    await fetch(`/api/messages/${listingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text.trim(),
        userName: user.fullName ?? user.emailAddresses[0]?.emailAddress ?? "Uživatel",
      }),
    });
    setText("");
    await fetchMessages();
    setSending(false);
  };

  return (
    <Stack gap="sm">
      <Title order={4}>Chat</Title>
      <Card withBorder radius="md" p={0}>
        <ScrollArea h={300} p="md">
          <Stack gap="sm">
            {messages.length === 0 && (
              <Text c="dimmed" ta="center" size="sm">Zatím žádné zprávy. Buď první!</Text>
            )}
            {messages.map((msg) => (
              <Group key={msg.id} align="flex-start" gap="sm">
                <Avatar radius="xl" size="sm" color="orange">
                  {msg.userName[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Group gap="xs">
                    <Text size="sm" fw={600}>{msg.userName}</Text>
                    <Text size="xs" c="dimmed">
                      {new Date(msg.createdAt).toLocaleDateString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </Group>
                  <Text size="sm">{msg.text}</Text>
                </Box>
              </Group>
            ))}
            <div ref={bottomRef} />
          </Stack>
        </ScrollArea>

        {isSignedIn ? (
          <Box p="md" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
            <Group align="flex-start" gap="sm">
              <Textarea
                placeholder="Napiš zprávu..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSent();
                  }
                }}
                autosize
                minRows={1}
                maxRows={4}
                style={{ flex: 1 }}
              />
              <Button onClick={handleSent} loading={sending} mb={1}>
                Odeslat
              </Button>
            </Group>
          </Box>
        ) : (
          <Box p="md" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
            <Group justify="center">
              <Text c="dimmed" size="sm">Pro psaní zpráv se musíš přihlásit.</Text>
              <SignInButton mode="modal">
                <Button variant="subtle" size="sm">Přihlásit se</Button>
              </SignInButton>
            </Group>
          </Box>
        )}
      </Card>
    </Stack>
  );
}
