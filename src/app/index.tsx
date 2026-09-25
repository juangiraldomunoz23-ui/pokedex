
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
        <Text style={styles.loadingText}>
          Cargando Pokémon...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            REGIÓN KANTO
          </Text>

          <Text style={styles.title}>
            Pokédex
          </Text>

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

              <Text style={styles.arrow}>
                →
              </Text>
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
    flex: 1,
    backgroundColor: "#0B1020",
    paddingHorizontal: 18,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1020",
    paddingHorizontal: 20,
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  errorText: {
    color: "#FF3CAC",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 28,
    paddingBottom: 22,
  },

  eyebrow: {
    color: "#B7FF00",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0,
  },

  subtitle: {
    color: "#A8B3D1",
    fontSize: 14,
    marginTop: 2,
  },

  counter: {
    alignItems: "center",
    backgroundColor: "#15223D",
    borderColor: "#00F0FF",
    borderWidth: 1,
    borderRadius: 14,
    minWidth: 62,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },

  counterValue: {
    color: "#00F0FF",
    fontSize: 20,
    fontWeight: "900",
  },

  counterLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  list: {
    paddingBottom: 24,
  },

  columnWrapper: {
    gap: 14,
  },

  card: {
    flex: 1,
    backgroundColor: "#151D35",
    borderColor: "#2C3B63",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 14,
    minHeight: 212,
    overflow: "hidden",
    padding: 15,
    shadowColor: "#00F0FF",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  cardTopline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  number: {
    color: "#8D9BC2",
    fontSize: 12,
    fontWeight: "800",
  },

  arrow: {
    color: "#FF3CAC",
    fontSize: 19,
    fontWeight: "700",
  },

  image: {
    alignSelf: "center",
    height: 132,
    width: "100%",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 18,
    textTransform: "capitalize",
    fontWeight: "800",
  },
});

