import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMovieList } from "../../hooks/useMovieList";
import MovieCard from "../../components/MovieCard";
import { colors, fonts } from "../../constants/theme";

const { width: screenWidth } = Dimensions.get("window");
const PADDING = 16;
const GAP = 8;
const CARD_WIDTH = Math.floor((screenWidth - PADDING * 2 - GAP * 3) / 4);

export default function FavoritesScreen() {
  const { items, loading } = useMovieList("favorites");

  const movies = items.filter((item) =>
    item.media_type ? item.media_type === "movie" : !!item.title
  );
  const tvShows = items.filter((item) =>
    item.media_type ? item.media_type === "tv" : !item.title && !!item.name
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Favorilerim</Text>
      {!loading && items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Henüz favori eklemedin</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {movies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filmler ({movies.length})</Text>
              <View style={styles.grid}>
                {movies.map((item) => (
                  <View key={`movie-${item.id}`} style={styles.gridItem}>
                    <MovieCard item={item} width={CARD_WIDTH} style={{ marginRight: 0 }} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {tvShows.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diziler ({tvShows.length})</Text>
              <View style={styles.grid}>
                {tvShows.map((item) => (
                  <View key={`tv-${item.id}`} style={styles.gridItem}>
                    <MovieCard item={item} width={CARD_WIDTH} style={{ marginRight: 0 }} />
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
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
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 17,
    color: colors.onSurface,
    fontFamily: fonts.headline,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: PADDING,
    gap: GAP,
  },
  gridItem: { marginBottom: 12 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.onSurfaceVariant, fontFamily: fonts.body },
  list: { paddingBottom: 24 },
});
