"use client";

import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "bazar123";
const STORAGE_KEY = "blogic-bazar-admin";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect (() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if(stored === "true") setIsAdmin(true);
    setReady(true);
  }, []);

  const login  = (password: string) : boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      window.localStorage.setItem(STORAGE_KEY, "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return { isAdmin, login, logout, ready };
}
