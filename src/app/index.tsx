import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { Image } from "expo-image";
import { Link } from "expo-router";
import { useMemo, useState } from "react";

import { usePokemonList } from "./hooks/usePokemonList";

export default function HomeScreen() {
  const { pokemon, loading, error } = usePokemonList();

  const { width } = useWindowDimensions();

  const [search, setSearch] = useState("");

  const columns =
    width > 800
      ? 4
      : width > 600
      ? 3
      : 2;

  const filteredPokemon = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return pokemon;
    }

    return pokemon.filter((item) =>
      item.name.toLowerCase().includes(text)
    );
  }, [pokemon, search]);

  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingCircle}>
          <Text style={styles.loadingPokeball}>
            P
          </Text>
        </View>

        <Text style={styles.loadingTitle}>
          Preparando Pokédex
        </Text>

        <Text style={styles.loadingSubtitle}>
          Buscando Pokémon...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>
          !
        </Text>

        <Text style={styles.errorTitle}>
          Algo salió mal
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPokemon}
        key={columns}
        numColumns={columns}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        columnWrapperStyle={
          columns > 1
            ? styles.columnWrapper
            : undefined
        }
        ListHeaderComponent={
          <View>
            <View style={styles.topHeader}>
              <View style={styles.logoArea}>
                <View style={styles.logoCircle}>
                  <View style={styles.logoCircleInner} />
                </View>

                <View>
                  <Text style={styles.logoText}>
                    POKÉDEX
                  </Text>

                  <Text style={styles.logoSubtext}>
                    KANTO DATABASE
                  </Text>
                </View>
              </View>

              <View style={styles.status}>
                <View style={styles.statusDot} />

                <Text style={styles.statusText}>
                  ONLINE
                </Text>
              </View>
            </View>

            <View style={styles.hero}>
              <View style={styles.heroText}>
                <Text style={styles.heroSmall}>
                  WELCOME, TRAINER
                </Text>

                <Text style={styles.heroTitle}>
                  Descubre tu próximo Pokémon.
                </Text>

                <Text style={styles.heroDescription}>
                  Explora información, estadísticas
                  y características de tus Pokémon.
                </Text>
              </View>

              <View style={styles.heroDecor}>
                <View style={styles.heroCircle} />

                <View style={styles.heroLineOne} />
                <View style={styles.heroLineTwo} />
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>
                🔍
              </Text>

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar Pokémon..."
                placeholderTextColor="#8B93A7"
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  POKÉMON
                </Text>

                <Text style={styles.sectionSubtitle}>
                  {filteredPokemon.length} encontrados
                </Text>
              </View>

              <View style={styles.totalBadge}>
                <Text style={styles.totalBadgeNumber}>
                  {pokemon.length}
                </Text>

                <Text style={styles.totalBadgeText}>
                  TOTAL
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              ?
            </Text>

            <Text style={styles.emptyTitle}>
              Pokémon no encontrado
            </Text>

            <Text style={styles.emptyText}>
              Prueba buscando otro nombre.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const id = getPokemonId(item.url);
          const typeColor =
            getCardColor(Number(id));

          return (
            <Link
              href={{
                pathname: "/pokemon/[name]",
                params: {
                  name: item.name,
                },
              }}
              style={[
                styles.card,
                {
                  borderColor: typeColor,
                },
              ]}
            >
              <View
                style={[
                  styles.cardGlow,
                  {
                    backgroundColor: typeColor,
                  },
                ]}
              />

              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.cardNumber,
                    {
                      color: typeColor,
                    },
                  ]}
                >
                  #{String(id).padStart(3, "0")}
                </Text>

                <Text style={styles.cardIndex}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </View>

              <Image
                source={{
                  uri: getPokemonImage(item.url),
                }}
                style={styles.image}
                contentFit="contain"
                transition={350}
                cachePolicy="disk"
                accessibilityLabel={`${item.name} official artwork`}
              />

              <View style={styles.cardBottom}>
                <Text style={styles.name}>
                  {item.name}
                </Text>

                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: typeColor,
                    },
                  ]}
                >
                  <Text style={styles.typeBadgeText}>
                    POKÉMON
                  </Text>
                </View>
              </View>

              <View style={styles.cardArrow}>
                <Text style={styles.arrow}>
                  →
                </Text>
              </View>
            </Link>
          );
        }}
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

const getCardColor = (id: number) => {
  const colors = [
    "#FF5353",
    "#FF9F43",
    "#FFD93D",
    "#6BCB77",
    "#4D96FF",
    "#845EC2",
    "#FF6F91",
    "#00C9A7",
  ];

  return colors[id % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080A0F",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#080A0F",
    paddingHorizontal: 30,
  },

  loadingCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  loadingPokeball: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  loadingTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  loadingSubtitle: {
    color: "#858B9B",
    fontSize: 14,
    marginTop: 7,
  },

  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FF5353",
    color: "#FF5353",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    paddingTop: 8,
    marginBottom: 18,
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },

  errorText: {
    color: "#A3A8B5",
    fontSize: 15,
    textAlign: "center",
  },

  list: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 35,
  },

  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  logoArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  logoCircleInner: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#080A0F",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  logoSubtext: {
    color: "#6F7687",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginTop: 2,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#252A35",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#6BCB77",
    marginRight: 6,
  },

  statusText: {
    color: "#A8AFBF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  hero: {
    minHeight: 190,
    borderRadius: 28,
    backgroundColor: "#151821",
    borderWidth: 1,
    borderColor: "#252A35",
    overflow: "hidden",
    padding: 24,
    justifyContent: "center",
    marginBottom: 16,
  },

  heroText: {
    width: "72%",
    zIndex: 2,
  },

  heroSmall: {
    color: "#FF5353",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 32,
  },

  heroDescription: {
    color: "#858B9B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    maxWidth: 280,
  },

  heroDecor: {
    position: "absolute",
    right: -55,
    top: -45,
    width: 210,
    height: 210,
  },

  heroCircle: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 25,
    borderColor: "#202530",
  },

  heroLineOne: {
    position: "absolute",
    width: 150,
    height: 1,
    backgroundColor: "#343A48",
    transform: [
      {
        rotate: "45deg",
      },
    ],
    top: 80,
    left: 30,
  },

  heroLineTwo: {
    position: "absolute",
    width: 150,
    height: 1,
    backgroundColor: "#343A48",
    transform: [
      {
        rotate: "-45deg",
      },
    ],
    top: 80,
    left: 30,
  },

  searchContainer: {
    height: 56,
    backgroundColor: "#151821",
    borderWidth: 1,
    borderColor: "#292E3A",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    marginBottom: 25,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sectionSubtitle: {
    color: "#707788",
    fontSize: 11,
    marginTop: 3,
  },

  totalBadge: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#292E3A",
    borderRadius: 12,
    minWidth: 58,
    paddingVertical: 7,
    paddingHorizontal: 9,
  },

  totalBadgeNumber: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  totalBadgeText: {
    color: "#6F7687",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1,
  },

  columnWrapper: {
    gap: 12,
  },

  card: {
    flex: 1,
    minHeight: 245,
    backgroundColor: "#12151C",
    borderWidth: 1,
    borderRadius: 24,
    marginBottom: 12,
    padding: 14,
    overflow: "hidden",
    position: "relative",
  },

  cardGlow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    opacity: 0.07,
    right: -45,
    top: 45,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardNumber: {
    fontSize: 13,
    fontWeight: "900",
  },

  cardIndex: {
    color: "#4E5565",
    fontSize: 10,
    fontWeight: "800",
  },

  image: {
    width: "100%",
    height: 145,
    marginTop: 3,
  },

  cardBottom: {
    marginTop: 4,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    textTransform: "capitalize",
    marginBottom: 8,
  },

  typeBadge: {
    alignSelf: "flex-start",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  cardArrow: {
    position: "absolute",
    right: 13,
    bottom: 13,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#1C2029",
    justifyContent: "center",
    alignItems: "center",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  empty: {
    alignItems: "center",
    paddingVertical: 70,
  },

  emptyIcon: {
    color: "#FF5353",
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 10,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  emptyText: {
    color: "#777F90",
    fontSize: 13,
    marginTop: 6,
  },
});