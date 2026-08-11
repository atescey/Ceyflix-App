import { Text, View, FlatList, StyleSheet, ActivityIndicator, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getTrendingMovies, getPopularTVShows, getMovieGenres } from "../../services/tmdbApi";
import MovieCard from "../../components/MovieCard";
import HeroBanner from "../../components/HeroBanner";
import { colors, fonts, radius } from "../../constants/theme";
import { SkeletonBox, SkeletonMovieCard } from "../../components/SkeletonCard";

export default function HomeScreen() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [genreMap, setGenreMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrendingMovies(), getPopularTVShows(), getMovieGenres()])
      .then(([moviesData, showsData, genresData]) => {
        setTrendingMovies(moviesData.results);
        setPopularShows(showsData.results);
        const map = {};
        genresData.genres.forEach((g) => (map[g.id] = g.name));
        setGenreMap(map);
      })
      .catch((err) => console.error("Hata:", err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <SkeletonBox width={100} height={20} />
        </View>
        <SkeletonBox width="100%" height={480} style={{ borderRadius: 0 }} />
        <View style={{ marginLeft: 16, marginTop: 20, marginBottom: 12 }}>
          <SkeletonBox width={140} height={18} />
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </View>
        <View style={{ marginLeft: 16, marginTop: 20, marginBottom: 12 }}>
          <SkeletonBox width={160} height={18} />
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonMovieCard key={i} variant="backdrop" width={220} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  const heroMovie = trendingMovies[0];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image source={require("../../assets/logo.png")} style={styles.logoImage} />
            <Text style={styles.logo}>CEYFLİX</Text>
          </View>
          <View style={styles.headerIcons}>
            <Ionicons name="search" size={22} color={colors.onSurface} style={{ marginRight: 16 }} />
            <Ionicons name="person-circle" size={26} color={colors.onSurface} />
          </View>
        </View>

        <HeroBanner movie={heroMovie} genreMap={genreMap} />

        <Text style={styles.sectionTitle}>Trend Filmler</Text>
        <FlatList
          data={trendingMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard item={item} />}
          contentContainerStyle={styles.list}
        />

        <Text style={styles.sectionTitle}>Popüler Diziler</Text>
        <FlatList
          data={popularShows}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard item={item} variant="backdrop" />}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoImage: { width: 32, height: 32, borderRadius: radius.sm, marginRight: 10 },
  logo: { fontSize: 20, color: colors.primary, fontFamily: fonts.headlineBold },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  sectionTitle: {
    fontSize: 18,
    color: colors.onSurface,
    fontFamily: fonts.headline,
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
});
