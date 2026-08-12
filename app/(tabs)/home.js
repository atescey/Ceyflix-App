import { Text, View, FlatList, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getTrendingMovies,
  getPopularTVShows,
  getMovieGenres,
  getTVGenres,
  getNowPlayingMovies,
  getOnTheAirTVShows,
  getPopularMovies,
  getTrendingTVShows,
  getMoviesByGenre,
  getTVByGenre,
} from "../../services/tmdbApi";
import { useMovieList } from "../../hooks/useMovieList";
import MovieCard from "../../components/MovieCard";
import HeroBanner from "../../components/HeroBanner";
import FilterChips from "../../components/FilterChips";
import TopTenRow from "../../components/TopTenRow";
import CategoryRow from "../../components/CategoryRow";
import HomeSkeleton from "../../components/HomeSkeleton";
import { colors, fonts } from "../../constants/theme";

const FEATURED_MOVIE_GENRES = [
  { id: 28, name: "Aksiyon" },
  { id: 35, name: "Komedi" },
  { id: 27, name: "Korku" },
  { id: 10749, name: "Romantik" },
];

const FEATURED_TV_GENRES = [
  { id: 18, name: "Drama" },
  { id: 10759, name: "Aksiyon & Macera" },
  { id: 35, name: "Komedi" },
  { id: 9648, name: "Gizem" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [movieGenreMap, setMovieGenreMap] = useState({});
  const [movieGenreList, setMovieGenreList] = useState([]);
  const [tvGenreMap, setTVGenreMap] = useState({});
  const [tvGenreList, setTVGenreList] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [heroItem, setHeroItem] = useState(null);
  const [heroIsTV, setHeroIsTV] = useState(false);
  const [primaryList, setPrimaryList] = useState([]); // Top 10 (sabit, sayfalanmaz)
  const [primaryListLabel, setPrimaryListLabel] = useState("");

  // Bunlar artık CategoryRow'a devrediliyor, o kendi sayfalamasını yapıyor
  const [newListFetchFn, setNewListFetchFn] = useState(null);
  const [newListLabel, setNewListLabel] = useState("");
  const [secondaryListFetchFn, setSecondaryListFetchFn] = useState(null);
  const [secondaryListLabel, setSecondaryListLabel] = useState("");

  const [contentLoading, setContentLoading] = useState(true);

  const watchlist = useMovieList("watchlist");

  useEffect(() => {
    Promise.all([getMovieGenres(), getTVGenres()])
      .then(([movieGenres, tvGenres]) => {
        const mMap = {};
        movieGenres.genres.forEach((g) => (mMap[g.id] = g.name));
        setMovieGenreMap(mMap);
        setMovieGenreList(movieGenres.genres);

        const tMap = {};
        tvGenres.genres.forEach((g) => (tMap[g.id] = g.name));
        setTVGenreMap(tMap);
        setTVGenreList(tvGenres.genres);
      })
      .catch((err) => console.error("Tür listesi hatası:", err.message))
      .finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    setContentLoading(true);
    setSelectedGenre(null);

    let request;
    if (activeFilter === "Filmler") {
      request = getTrendingMovies().then((trending) => {
        setHeroItem(trending.results[0]);
        setHeroIsTV(false);
        setPrimaryList(trending.results);
        setPrimaryListLabel("Bugünün Top 10 Filmi");
        setNewListFetchFn(() => (page) => getNowPlayingMovies(page));
        setNewListLabel("Yeni Vizyona Girenler");
        setSecondaryListFetchFn(() => (page) => getPopularMovies(page));
        setSecondaryListLabel("Popüler Filmler");
      });
    } else if (activeFilter === "Diziler") {
      request = getTrendingTVShows().then((trending) => {
        setHeroItem(trending.results[0]);
        setHeroIsTV(true);
        setPrimaryList(trending.results);
        setPrimaryListLabel("Bugünün Top 10 Dizisi");
        setNewListFetchFn(() => (page) => getOnTheAirTVShows(page));
        setNewListLabel("Yayınlanan Yeni Bölümler");
        setSecondaryListFetchFn(() => (page) => getPopularTVShows(page));
        setSecondaryListLabel("Popüler Diziler");
      });
    } else if (activeFilter === "Yeni") {
      request = getNowPlayingMovies().then((nowPlaying) => {
        setHeroItem(nowPlaying.results[0]);
        setHeroIsTV(false);
        setPrimaryList(nowPlaying.results);
        setPrimaryListLabel("Yeni Filmler");
        setNewListFetchFn(() => (page) => getOnTheAirTVShows(page));
        setNewListLabel("Yeni Diziler");
        setSecondaryListFetchFn(null);
        setSecondaryListLabel("");
      });
    } else if (activeFilter === "Popüler") {
      request = getPopularMovies().then((movies) => {
        setHeroItem(movies.results[0]);
        setHeroIsTV(false);
        setPrimaryList([]);
        setPrimaryListLabel("");
        setNewListFetchFn(() => (page) => getPopularMovies(page));
        setNewListLabel("Popüler Filmler");
        setSecondaryListFetchFn(() => (page) => getPopularTVShows(page));
        setSecondaryListLabel("Popüler Diziler");
      });
    } else {
      // Tümü
      request = getTrendingMovies().then((trending) => {
        setHeroItem(trending.results[0]);
        setHeroIsTV(false);
        setPrimaryList(trending.results);
        setPrimaryListLabel("Bugünün Top 10'u");
        setNewListFetchFn(() => (page) => getNowPlayingMovies(page));
        setNewListLabel("Ceyflix'te Yeni İçerikler");
        setSecondaryListFetchFn(() => (page) => getPopularTVShows(page));
        setSecondaryListLabel("Popüler Diziler");
      });
    }

    request
      .catch((err) => console.error("İçerik hatası:", err.message))
      .finally(() => setContentLoading(false));
  }, [activeFilter]);

  if (initialLoading || contentLoading) {
    return <HomeSkeleton />;
  }

  const isDiziFilter = activeFilter === "Diziler";
  const activeGenreList = isDiziFilter ? tvGenreList : movieGenreList;
  const activeGenreMap = isDiziFilter ? tvGenreMap : movieGenreMap;
  const featuredGenres = isDiziFilter ? FEATURED_TV_GENRES : FEATURED_MOVIE_GENRES;
  const fetchByGenre = isDiziFilter ? getTVByGenre : getMoviesByGenre;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>CEYFLİX</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="search" size={22} color={colors.onSurface} style={{ marginRight: 16 }} />
            <TouchableOpacity onPress={() => router.push("/profiles")}>
              <Ionicons name="person-circle" size={26} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        <FilterChips
          active={activeFilter}
          onChange={setActiveFilter}
          genres={activeGenreList}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        <HeroBanner movie={heroItem} genreMap={activeGenreMap} />

        {selectedGenre ? (
          <CategoryRow
            key={selectedGenre.id}
            title={selectedGenre.name}
            fetchFn={(page) => fetchByGenre(selectedGenre.id, page)}
            onLoad={(results) => {
              if (results[0]) {
                setHeroItem(results[0]);
                setHeroIsTV(isDiziFilter);
              }
            }}
          />
        ) : (
          <>
            {activeFilter === "Tümü" && watchlist.items.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>İzlemeye Devam Et</Text>
                <FlatList
                  data={watchlist.items}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <MovieCard item={item} />}
                  contentContainerStyle={styles.list}
                />
              </View>
            )}

            {newListFetchFn && (
              <CategoryRow title={newListLabel} fetchFn={newListFetchFn} variant="backdrop" />
            )}

            {primaryList.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{primaryListLabel}</Text>
                <TopTenRow movies={primaryList} />
              </View>
            )}

            {secondaryListFetchFn && (
              <CategoryRow title={secondaryListLabel} fetchFn={secondaryListFetchFn} variant="backdrop" />
            )}

            {featuredGenres.map((genre) => (
              <CategoryRow
                key={genre.id}
                title={genre.name}
                fetchFn={(page) => fetchByGenre(genre.id, page)}
              />
            ))}
          </>
        )}
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
  logo: { fontSize: 20, color: colors.primary, fontFamily: fonts.headlineBold },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  section: { marginTop: 20, marginBottom: 8 },
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