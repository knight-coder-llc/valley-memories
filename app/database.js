// database.js
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { View } from "react-native";
import supabase from "./supabaseClient";

let dbPromise = null;

// 🔹 Initialize or reuse the database
const getDatabase = async () => {
  if (!dbPromise) {
    dbPromise = (async () => {
      const database = await SQLite.openDatabaseAsync("localdata.db");
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS poems (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT,
          body TEXT,
          author TEXT
        );

        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT,
          description TEXT
        );
      `);
      console.log("✅ Database initialized");
      return database;
    })();
  }
  return dbPromise;
};

// 🔹 Sync Supabase → SQLite
export const syncFromSupabase = async () => {
  const db = await getDatabase();
  const rows = await db.getAllAsync("SELECT COUNT(*) as count FROM poems;");
  const existing = rows[0]?.count ?? 0;

  if (existing > 0) {
    console.log("✅ Data already exists in SQLite.");
    return;
  }

  console.log("⬇️ Fetching from Supabase...");
  const { data, error } = await supabase.from("Poems").select("*");
  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  for (const poem of data) {
    await db.runAsync(
      "INSERT INTO poems (id, title, body, author) VALUES (?, ?, ?, ?);",
      [poem.id, poem.Title, poem.Body, poem.Author || null]
    );
  }

  console.log("✅ Supabase data saved to SQLite.");
};

// 🔹 Get cached poems
export const getPoemsFromCache = async () => {
  const db = await getDatabase();
  return await db.getAllAsync("SELECT * FROM poems;");
};

// 🔹 Drizzle Studio Component
export const DrizzleStudio = () => {
  const [db, setDb] = React.useState(null);

  useDrizzleStudio(db); // ✅ unconditionally called

  React.useEffect(() => {
    getDatabase().then(setDb);
  }, []);

  return <View />;
};

//
// ==========================
// 🔹 Database Context Section
// ==========================
//

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize DB once
  useEffect(() => {
    const init = async () => {
      const database = await getDatabase();
      setDb(database);
      const cached = await getPoemsFromCache();
      setPoems(cached);
      setLoading(false);
    };
    init();
  }, []);

  // Reload poems
  const reloadPoems = async () => {
    const cached = await getPoemsFromCache();
    setPoems(cached);
  };

  // Sync from Supabase and reload
  const syncAndReload = async () => {
    await syncFromSupabase();
    await reloadPoems();
  };

  return (
    <DatabaseContext.Provider
      value={{
        db,
        poems,
        loading,
        reloadPoems,
        syncAndReload,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);

// Export default for backward compatibility
export default {
  getDatabase,
  syncFromSupabase,
  getPoemsFromCache,
  DrizzleStudio,
  DatabaseProvider,
  useDatabase,
};
