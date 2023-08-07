import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import Vessel from "@vesselapi/sdk";

export default async function accounts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: userId, cursor } = JSON.parse(req.body);

  if (!process.env.VESSEL_API_KEY) {
    throw new Error("Missing VESSEL_API_KEY environment variable");
  }
  if (!userId) {
    throw new Error("Missing userId");
  }

  const { accessToken } = await db.getUser({ userId });
  const api = Vessel({ apiToken: process.env.VESSEL_API_KEY, accessToken });

  // Fetch Accounts
  const {
    body: {
      result: { accounts, nextPageCursor },
    },
  } = await api.unifications.crm.accounts.list({
    cursor,
    associations: ["contacts", "deals"],
  });
  res.json({ accounts, cursor: nextPageCursor });
}
