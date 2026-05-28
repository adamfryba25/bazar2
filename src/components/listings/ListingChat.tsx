"use client";

import { useEffect, useRef, useState } from "react";

import {
  ActionIcon, Avatar, Box, Button, Card, Group, ScrollArea,
  Stack, Text, Textarea, Title
} from "@mantine/core";

import { IconTrash } from "@tabler/icons-react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/clerk-react";

type Message = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};

interface Props {
  listingId: string;
  hasColor?: boolean;  // ← NOVÉ
}

export function ListingChat({ listingId, hasColor }: Props) {
  const { isSignedIn, user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const cardStyle = hasColor ? {
    backgroundColor: "#ffffff",
    color: "#333333",
  } : undefined;

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

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    setSending(true);
    await fetch(`/api/messages/${listingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        text: text.trim(),
        userName: user.fullName ?? user.emailAddresses[0]?.emailAddress ?? "Uživatel",
      }),
    });
    setText("");
    await fetchMessages();
    setSending(false);
  };

  const handleDelete = async (messageId: string) => {
    await fetch(`/api/messages/${listingId}/${messageId}`, {
      method: "DELETE",
    });
    await fetchMessages();
  };

  return (
    <Stack gap="sm">
      <Title order={4} style={{ color: hasColor ? "#333333" : undefined }}>Chat</Title>
      <Card withBorder radius="md" p={0} style={cardStyle}>
        <ScrollArea h={300} p="md">
          <Stack gap="sm">
            {messages.length === 0 && (
              <Text c="dimmed" ta="center" size="sm">Zatím žádné zprávy. Buď první!</Text>
            )}
            {messages.map((msg) => (
              <Group key={msg.id} align="flex-start" gap="sm" justify="space-between">
                <Group align="flex-start" gap="sm" style={{ flex: 1 }}>
                  <Avatar radius="xl" size="sm" color="orange">
                    {msg.userName[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Group gap="xs">
                      <Text size="sm" fw={600} style={{ color: hasColor ? "#333333" : undefined }}>
                        {msg.userName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {new Date(msg.createdAt).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </Group>
                    <Text size="sm" style={{ color: hasColor ? "#333333" : undefined }}>
                      {msg.text}
                    </Text>
                  </Box>
                </Group>
                {user?.id === msg.userId && (
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => handleDelete(msg.id)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                )}
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
                    handleSend();
                  }
                }}
                autosize
                minRows={1}
                maxRows={4}
                style={{ flex: 1 }}
              />
              <Button onClick={handleSend} loading={sending}>
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
