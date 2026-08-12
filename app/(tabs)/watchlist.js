import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMovieList } from "../../hooks/useMovieList";
import { colors, fonts, radius } from "../../constants/theme";

export default function WatchlistScreen() {
  const { items, loading, toggleItem } = useMovieList("watchlist");

  const isTV = (item) => item.media_type === "tv" || (!item.title && !!item.name);
  const movies = items.filter((item) => !isTV(item));
  const tvShows = items.filter(isTV);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Listem</Text>
      {!loading && items.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="bookmark-outline" size={48} color={colors.outline} style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>Henüz izlenecek eklemedin</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {movies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filmler ({movies.length})</Text>
              {movies.map((item) => (
                <WatchlistItemCard key={`movie-${item.id}`} item={item} onRemove={toggleItem} />
              ))}
            </View>
          )}

          {tvShows.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diziler ({tvShows.length})</Text>
              {tvShows.map((item) => (
                <WatchlistItemCard key={`tv-${item.id}`} item={item} onRemove={toggleItem} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function WatchlistItemCard({ item, onRemove }) {
  const router = useRouter();
  const title = item.title || item.name;
  const isTV = item.media_type === "tv" || (!item.title && !!item.name);
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const imagePath = item.poster_path || item.backdrop_path;
  const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w300${imagePath}` : null;

  return (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => router.push(isTV ? `/tv/${item.id}` : `/movie/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.itemImageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.itemImage} resizeMode="contain" />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="film-outline" size={24} color={colors.outline} />
          </View>
        )}
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          {year ? <Text style={styles.itemMeta}>{year}</Text> : null}
          {year && rating ? <Text style={styles.dot}>•</Text> : null}
          {rating ? (
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={13} color="#ffc107" style={{ marginRight: 4 }} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={20} color={colors.outline} />
      </TouchableOpacity>
    </TouchableOpacity>
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
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.onSurfaceVariant, fontFamily: fonts.body },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.lg,
    padding: 10,
    marginBottom: 12,
  },
  itemImageContainer: {
    width: 60,
    height: 90,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceVariant,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 15,
    color: colors.onSurface,
    fontFamily: fonts.label,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemMeta: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    fontFamily: fonts.body,
  },
  dot: {
    color: colors.outline,
    marginHorizontal: 6,
    fontSize: 12,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: colors.onSurface,
    fontFamily: fonts.bodyMedium,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
});
