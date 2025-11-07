import React, { useMemo } from "react";
import { ScrollView, ImageBackground, StyleSheet } from "react-native";
import { useDatabase } from "../database";
import { ThemedText } from "@/components/themed-text";
import { useLocalSearchParams } from "expo-router";

export default function PoemDetailScreen() {
  const { selectedPoem } = useDatabase();
  const { id } = useLocalSearchParams();

  if (!selectedPoem) return <ThemedText>No poem selected.</ThemedText>;

  // 🔹 Array of background images
  const backgrounds = [
    require("@/assets/images/png/1-nature-background-1.png"),
    require("@/assets/images/png/2-nature-background-2.png"),
    require("@/assets/images/png/3-nature-background-3.png"),
    require("@/assets/images/png/4-nature-background-4.png"),
  ];

  // 🔹 Randomize once per render
  const randomBackground = useMemo(() => {
    const index = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[index];
  }, []);

  return (
    <ImageBackground
      source={randomBackground}
      style={styles.background}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.title} type="subtitle">
          {selectedPoem.title}
        </ThemedText>

        <ThemedText style={styles.body}>{selectedPoem.body}</ThemedText>

        <ThemedText style={styles.author} type="subtitle">
          — {selectedPoem.author}
        </ThemedText>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  image: {
    opacity: 0.25, // soften the background for readability
  },
  content: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 25,
  },
  body: {
    marginTop: 25,
    fontSize: 16,
    lineHeight: 22,
  },
  author: {
    marginTop: 25,
    textAlign: "right",
    fontStyle: "italic",
  },
});
