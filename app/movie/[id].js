import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { getMovieDetails } from "../../services/tmdbApi";
import { colors, fonts, radius } from "../../constants/theme";

const BACKDROP_URL = "https://image.tmdb.org/t/p/w780";
const PROFILE_URL = "https://image.tmdb.org/t/p/w185";
const screenWidth = Dimensions.get("window").width;

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovieDetails(id)
      .then(setMovie)
      .catch((err) => console.error("Detay hatası:", err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Film bulunamadı</Text>
      </View>
    );
  }

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const cast = movie.credits?.cast?.slice(0, 15) || [];
  const year = (movie.release_date || "").slice(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <ScrollView style={styles.container}>
      {movie.backdrop_path && (
        <Image
          source={{ uri: `${BACKDROP_URL}${movie.backdrop_path}` }}
          style={styles.backdrop}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.metaRow}>
          {rating && <Text style={styles.meta}>⭐ {rating}</Text>}
          {year && <Text style={styles.meta}>{year}</Text>}
          {movie.runtime ? <Text style={styles.meta}>{movie.runtime} dk</Text> : null}
        </View>

        {movie.genres?.length > 0 && (
          <View style={styles.genreRow}>
            {movie.genres.map((g) => (
              <View key={g.id} style={styles.genreChip}>
                <Text style={styles.genreText}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.overview}>{movie.overview}</Text>

        {trailer && (
          <View style={styles.trailerSection}>
            <Text style={styles.sectionTitle}>Fragman</Text>
            <View style={styles.videoWrapper}>
              <WebView
                source={{ uri: `https://www.youtube.com/embed/${trailer.key}` }}
                style={styles.video}
                allowsFullscreenVideo
              />
            </View>
          </View>
        )}

        {cast.length > 0 && (
          <View style={styles.castSection}>
            <Text style={styles.sectionTitle}>Oyuncular</Text>
            <FlatList
              data={cast}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.credit_id || item.id.toString()}
              contentContainerStyle={{ paddingRight: 16 }}
              renderItem={({ item }) => (
                <View style={styles.castItem}>
                  {item.profile_path ? (
                    <Image
                      source={{ uri: `${PROFILE_URL}${item.profile_path}` }}
                      style={styles.castImage}
                    />
                  ) : (
                    <View style={[styles.castImage, styles.castImagePlaceholder]} />
                  )}
                  <Text style={styles.castName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.castCharacter} numberOfLines={1}>
                    {item.character}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorText: { color: colors.onSurfaceVariant, fontFamily: fonts.body },
  backdrop: { width: screenWidth, height: screenWidth * 0.5625 },
  content: { padding: 16 },
  title: { fontSize: 24, color: colors.onSurface, fontFamily: fonts.headlineBold, marginBottom: 8 },
  metaRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  meta: { color: colors.primary, fontFamily: fonts.label, fontSize: 13 },
  genreRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  genreChip: {
    backgroundColor: "rgba(236,187,186,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  genreText: { color: colors.secondary, fontFamily: fonts.label, fontSize: 11 },
  overview: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.onSurface,
    fontFamily: fonts.headline,
    marginBottom: 12,
  },
  trailerSection: { marginBottom: 24 },
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainer,
  },
  video: { flex: 1 },
  castSection: { marginBottom: 24 },
  castItem: { width: 90, marginRight: 12 },
  castImage: {
    width: 90,
    height: 90,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
  },
  castImagePlaceholder: {},
  castName: {
    color: colors.onSurface,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
  castCharacter: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.body,
    fontSize: 11,
    textAlign: "center",
  },
});
