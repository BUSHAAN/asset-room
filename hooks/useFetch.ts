import { useAuth } from "@/app/contexts/AuthContext";
import React from "react";

const useFetch = () => {
  const { user } = useAuth();
  const customFetch = async (url: string, method: string, body?: any) => {
    const token = await user?.getIdToken() || "";
    try {
      const response = await fetch(url, {
        method: method,
        body: body ? JSON.stringify(body) : undefined,
        headers: body
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          : { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  return {
    customFetch,
  };
};

export default useFetch;
