import fs from "fs";
import { guard } from "radash";

const DB_PATH = "./db.json";

export type User = {
  accessToken: string;
  connectionId: string;
  integrationId: string;
};

type DB = {
  users: {
    [key: string]: User;
  };
};

const makeDb = () => {
  const loadDb = () => {
    const db = fs.readFileSync(DB_PATH, "utf8");
    return guard(() => JSON.parse(db)) ?? { users: {} };
  };

  const saveDb = (db: DB) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(db));
  };

  return {
    addUser({ userId, user }: { userId: string; user: User }) {
      const db = loadDb();
      db.users[userId] = user;
      saveDb(db);
    },
    getUser({ userId }: { userId: string }) {
      const db = loadDb();
      return db.users[userId];
    },
  };
};

export const db = makeDb();
