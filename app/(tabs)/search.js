import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { searchMovies } from "../../services/tmdbApi";
import MovieCard from "../../components/MovieCard";
import { SkeletonMovieCard } from "../../components/SkeletonCard";
import { colors, fonts, radius } from "../../constants/theme";

const screenWidth = Dimensions.get("window").width;
const PADDING = 16;
const GAP = 8;
const cardWidth = Math.floor((screenWidth - PADDING * 2 - GAP * 2) / 3);

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      searchMovies(query, 1)
        .then((data) => {
          setResults(data.results);
          setPage(1);
          setTotalPages(data.total_pages);
        })
        .catch((err) => console.error("Arama hatası:", err.message))
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    searchMovies(query, nextPage)
      .then((data) => {
        setResults((prev) => [...prev, ...data.results]);
        setPage(nextPage);
      })
      .catch((err) => console.error("Arama hatası:", err.message))
      .finally(() => setLoadingMore(false));
  }, [query, page, totalPages, loading, loadingMore]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.outline} />
        <TextInput
          style={styles.input}
          placeholder="Film ara..."
          placeholderTextColor={colors.outline}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading ? (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((i) => (
            <SkeletonMovieCard key={i} width={cardWidth} style={{ marginRight: 0 }} />
          ))}
        </View>
      ) : (
        <FlatList
          data={results}
          numColumns={3}
          key="3-cols"
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <MovieCard item={item} width={cardWidth} style={{ marginRight: 0 }} />
            </View>
          )}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            query.trim() !== "" ? (
              <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
            ) : null
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceVariant,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    gap: 8,
  },
  input: { flex: 1, color: colors.onSurface, fontFamily: fonts.body, fontSize: 15 },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  list: { paddingBottom: 24 },
  row: { paddingHorizontal: 16, gap: 8 },
  gridItem: { marginBottom: 12 },
  emptyText: {
    textAlign: "center",
    color: colors.onSurfaceVariant,
    fontFamily: fonts.body,
    marginTop: 40,
  },
});
