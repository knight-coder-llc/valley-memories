import React, { useEffect } from "react";
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Text, FlatList, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { useDatabase } from '../database';
import { useRouter } from "expo-router";

const PoemsList = () => {
  const router = useRouter();
  const { poems, loading, setSelectedPoem } = useDatabase();

  if (loading) return <Text>Loading...</Text>;

  return (
    <SafeAreaView>
      <FlatList
        data={poems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "#ccc",
              }}
              onPress={() => {
              setSelectedPoem(item); // store poem in context
              router.push({
                pathname: "/poems/[id]",
                params: { id: item.id.toString() }, // must match [id] exactly
              }); // navigate to a fixed page
            }}
            >  
            <ThemedText type="subtitle">{item.title}</ThemedText>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/png/2-nature-background-2.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Valley of Memories</ThemedText>
        <HelloWave />
      </ThemedView>
       
      <PoemsList />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: 390,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
