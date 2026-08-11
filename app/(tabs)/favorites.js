import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMovieList } from "../../hooks/useMovieList";
import MovieCard from "../../components/MovieCard";
import { colors, fonts } from "../../constants/theme";

export default function FavoritesScreen() {
  const { items, loading } = useMovieList("favorites");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Favorilerim</Text>
      {!loading && items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Henüz favori eklemedin</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <MovieCard item={item} width={100} />
            </View>
          )}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    fontSize: 22,
    color: colors.onSurface,
    fontFamily: fonts.headline,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.onSurfaceVariant, fontFamily: fonts.body },
  row: { paddingHorizontal: 16, justifyContent: "flex-start" },
  gridItem: { marginBottom: 16 },
  list: { paddingBottom: 24 },
});
