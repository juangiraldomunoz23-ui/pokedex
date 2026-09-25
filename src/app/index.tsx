```tsx
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Image } from "expo-image";
import { Link } from "expo-router";

import { usePokemonList } from "../app/hooks/usePokemonList";

export default function HomeScreen() {
  const { pokemon, loading, error } = usePokemonList();

  const { width } = useWindowDimensions();

  const columns =
    width > 600
      ? 3
      : width > 380
      ? 2
      : 1;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>REGIÓN KANTO</Text>

          <Text style={styles.title}>Pokédex</Text>

          <Text style={styles.subtitle}>
            Explora tus primeros 20 Pokémon
          </Text>
        </View>

        <View style={styles.counter}>
          <Text style={styles.counterValue}>
            {pokemon.length}
          </Text>

          <Text style={styles.counterLabel}>
            vistos
          </Text>
        </View>
      </View>

      <FlatList
        data={pokemon}
        key={columns}
        numColumns={columns}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        columnWrapperStyle={
          columns > 1
            ? styles.columnWrapper
            : undefined
        }
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/pokemon/[name]",
              params: {
                name: item.name,
              },
            }}
            style={styles.card}
          >
            <View style={styles.cardTopline}>
              <Text style={styles.number}>
                #{getPokemonId(item.url)}
              </Text>

              <Text style={styles.arrow}>→</Text>
            </View>

            <Image
              source={{
                uri: getPokemonImage(item.url),
              }}
              style={styles.image}
              contentFit="contain"
              transition={250}
              cachePolicy="disk"
              accessibilityLabel={`${item.name} official artwork`}
            />

            <Text style={styles.name}>
              {item.name}
            </Text>
          </Link>
        )}
      />
    </View>
  );
}

const getPokemonId = (url: string) =>
  url.split("/").filter(Boolean).pop() ?? "0";

const getPokemonImage = (url: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonId(
    url
  )}.png`;

const styles = StyleSheet.create({
  container: {
```
