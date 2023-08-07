"use client";
import React, { useEffect, useState } from "react";
import Vessel from "@vesselapi/client-sdk";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);
  useEffect(() => {
    const getUserId = () => {
      const userId =
        localStorage.getItem("user-id") ??
        Math.random().toString(36).substring(2);
      localStorage.setItem("user-id", userId);
      setUserId(userId);
    };
    const getIntegrations = async () => {
      const res = await fetch("https://api.vessel.dev/integrations/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {
        result: { integrations },
      } = await res.json();
      setIntegrations(integrations);
      // Optionally filter out which integrations you care about
      // setIntegrations(integrations.filter((i: any) => i.id === 'hubspot'));
    };

    getIntegrations();
    getUserId();
  }, []);

  const { open } = Vessel({
    onSuccess: async (sessionToken) => {
      await fetch("/api/auth/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          userId,
        }),
      });
      router.push("/accounts");
    },
    onLoad: () => console.log("loaded"),
    onClose: () => console.log("closed"),
  });

  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <h1 className="mb-8 text-3xl font-bold text-center lg:text-left">
        Connect your Integrations
      </h1>
      <div className="mb-32 grid gap-8 justify-center lg:hidden">
        {/* Single column on smaller screens */}
        {integrations?.map((integration: any) => (
          <button
            className="group rounded-lg border p-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center justify-center"
            onClick={() =>
              open({
                integrationId: integration.id,
                getSessionToken: async () => {
                  const response = await fetch("/api/auth/start", {
                    method: "POST",
                  });
                  const { sessionToken } = await response.json();
                  return sessionToken;
                },
              })
            }
            key={integration.id}
          >
            <img
              src={integration.display.iconURI}
              alt={integration.display.name}
              className="mb-2 max-h-16 object-contain"
            />
            <p>{integration.display.name}</p>
          </button>
        ))}
      </div>
      <div className="hidden gap-8 justify-center lg:flex lg:flex-wrap">
        {/* Multiple columns on larger screens */}
        {integrations?.map((integration: any) => (
          <button
            className="group rounded-lg border p-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center justify-center"
            onClick={() =>
              open({
                integrationId: integration.id,
                getSessionToken: async () => {
                  const response = await fetch("/api/auth/start", {
                    method: "POST",
                  });
                  const { sessionToken } = await response.json();
                  return sessionToken;
                },
              })
            }
            key={integration.id}
          >
            <img
              src={integration.display.iconURI}
              alt={integration.display.name}
              className="mb-2 max-h-16 object-contain"
            />
            <p>{integration.display.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
