import { NextApiRequest, NextApiResponse } from "next";
import { db, User } from "@/db";

export default async function complete(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, sessionToken } = req.body;

  if (!process.env.VESSEL_API_KEY) {
    throw new Error("Missing VESSEL_API_KEY environment variable");
  }
  if (!userId || !sessionToken) {
    throw new Error("Missing userId or sessionToken");
  }

  const response = await fetch("https://api.vessel.dev/auth/access-token", {
    headers: {
      "Content-Type": "application/json",
      "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
      "x-vessel-session-token": sessionToken,
    },
    method: "POST",
  });
  const {
    result: { connectionId, accessToken, integrationId },
  } = await response.json();

  // !!IMPORTANT!! Make sure to store the connectionId and accessToken securely
  // Store this against your internal user id
  const user: User = { integrationId, connectionId, accessToken };
  await db.addUser({ userId, user });

  res.send({ success: true });
}
