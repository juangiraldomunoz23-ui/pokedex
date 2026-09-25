import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

import { usePokemonDetail } from "../hooks/usePokemonDetail";

export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{
    name: string;
  }>();

  const {
    pokemon,
    loading,
    error,
  } = usePokemonDetail(name);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>
          Cargando Pokémon...
        </Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Pokémon no encontrado"}
        </Text>
      </View>
    );
  }

  const image =
    pokemon.sprites.other?.[
      "official-artwork"
    ]?.front_default ||
    pokemon.sprites.front_default;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.number}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>

        <Text style={styles.title}>
          {pokemon.name}
        </Text>

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="contain"
            transition={300}
            cachePolicy="disk"
            accessibilityLabel={`${pokemon.name} official artwork`}
          />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          Tipo
        </Text>

        <View style={styles.types}>
          {pokemon.types.map((item) => (
            <View
              key={item.slot}
              style={styles.type}
            >
              <Text style={styles.typeText}>
                {item.type.name}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          Estadísticas base
        </Text>

        {pokemon.stats.map((item) => (
          <View
            key={item.stat.name}
            style={styles.stat}
          >
            <View style={styles.statHeader}>
              <Text style={styles.statName}>
                {item.stat.name}
              </Text>

              <Text style={styles.statValue}>
                {item.base_stat}
              </Text>
            </View>

            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(
                      item.base_stat,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>
              ALTURA
            </Text>

            <Text style={styles.infoValue}>
              {(pokemon.height / 10).toFixed(1)} m
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>
              PESO
            </Text>

            <Text style={styles.infoValue}>
              {(pokemon.weight / 10).toFixed(1)} kg
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B1020",
    paddingBottom: 30,
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

  hero: {
    alignItems: "center",
    backgroundColor: "#151D35",
    borderBottomColor: "#B7FF00",
    borderBottomWidth: 3,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    minHeight: 365,
    paddingHorizontal: 24,
    paddingTop: 24,
    width: "100%",
  },

  number: {
    color: "#B7FF00",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    textTransform: "capitalize",
    marginTop: 4,
  },

  image: {
    height: 260,
    width: 290,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 8,
    width: "100%",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 24,
  },

  types: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  type: {
    backgroundColor: "#FF3CAC",
    borderColor: "#FF83CF",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },

  typeText: {
    color: "#FFFFFF",
    textTransform: "capitalize",
    fontWeight: "800",
  },

  stat: {
    width: "100%",
    marginBottom: 13,
  },

  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  statName: {
    color: "#A8B3D1",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  statValue: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  track: {
    backgroundColor: "#263354",
    borderRadius: 4,
    height: 7,
    overflow: "hidden",
  },

  fill: {
    backgroundColor: "#B7FF00",
    borderRadius: 4,
    height: "100%",
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  infoCard: {
    backgroundColor: "#151D35",
    borderColor: "#2C3B63",
    borderWidth: 1,
    borderRadius: 14,
    flex: 1,
    padding: 16,
  },

  infoLabel: {
    color: "#8D9BC2",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  infoValue: {
    color: "#00F0FF",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 4,
  },
});