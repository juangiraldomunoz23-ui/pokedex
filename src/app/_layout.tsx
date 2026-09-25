import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0B1020",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "800",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Pokédex",
        }}
      />

      <Stack.Screen
        name="pokemon/[name]"
        options={{
          title: "Detalle Pokémon",
        }}
      />
    </Stack>
  );
}