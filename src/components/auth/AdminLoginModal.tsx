"use client";

import { useState } from "react";
import { Button, Modal, PasswordInput, Stack, Text } from "@mantine/core";
import { useAdmin } from "./useAdmin";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export function AdminLoginModal({ opened, onClose }: Props) {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const ok = login(password);
    if (ok) {
      setPassword("");
      setError("");
      onClose();
    } else {
      setError("Špatné heslo");
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Přihlášení admina">
      <Stack gap="md">
        <Text c="dimmed" size="sm">
          Zadej heslo pro správu inzerátů.
        </Text>
        <PasswordInput
          label="Heslo"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          error={error}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <Button onClick={handleLogin}>Přihlásit se</Button>
      </Stack>
    </Modal>
  );
}
