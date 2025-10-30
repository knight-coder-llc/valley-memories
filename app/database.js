import * as SQLite from 'expo-sqlite';
import { supabase } from './supabaseClient';

export const db = SQLite.openDatabase('localdata.db');

// Create my tables
export const initDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS poems (
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
            `
        )
    });
}

// 2️⃣ Insert Supabase data
export const syncFromSupabase = async () => {
  initDatabase()

  // Check if data already exists
  const existing = await new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM poems',
        [],
        (_, { rows }) => resolve(rows._array[0].count),
        (_, error) => {
          console.error('SQLite error', error)
          resolve(0)
        }
      )
    });
  })

  if (existing > 0) {
    console.log('✅ Data already exists in SQLite.');
    return;
  }

  console.log('⬇️ Fetching from Supabase...')
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    console.error('Supabase error:', error)
    return
  }

  db.transaction(tx => {
    data.forEach(poems => {
      tx.executeSql(
        'INSERT INTO poems (id, title, body) VALUES (?, ?, ?)',
        [poems.id, poems.title, poems.body]
      )
    });
  });

  console.log('✅ Supabase data saved to SQLite.')
}

// 3️⃣ Read from local cache
export const getUsersFromCache = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM poems',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      )
    });
  });
}