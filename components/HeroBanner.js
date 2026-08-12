import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMovieList } from "../hooks/useMovieList";
import { colors, fonts, radius } from "../constants/theme";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

export default function HeroBanner({ movie, genreMap }) {
    const router = useRouter();
    const watchlist = useMovieList("watchlist");

    if (!movie) return null;

    const title = movie.title || movie.name;
    const isTV = movie.media_type ? movie.media_type === "tv" : !movie.title && !!movie.name;
    const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
    const genreNames = (movie.genre_ids || [])
        .slice(0, 3)
        .map((id) => genreMap[id])
        .filter(Boolean)
        .join(" • ");

    const isWatchlisted = watchlist.isInList(movie.id);

    const handleToggleWatchlist = () => {
        const itemToSave = {
            ...movie,
            media_type: isTV ? "tv" : "movie",
        };
        watchlist.toggleItem(itemToSave);
    };

    return (
        <ImageBackground
            source={{ uri: `${IMAGE_BASE_URL}${movie.backdrop_path}` }}
            style={styles.hero}
            imageStyle={styles.heroImage}
        >
            <LinearGradient
                colors={["transparent", "rgba(31,20,24,0.6)", colors.background]}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    {genreNames ? <Text style={styles.genres}>{genreNames}</Text> : null}
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.metaRow}>
                        {year ? <Text style={styles.meta}>{year}</Text> : null}
                    </View>
                    <Text style={styles.overview} numberOfLines={3}>
                        {movie.overview}
                    </Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={() => router.push(isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="play" size={16} color={colors.onPrimary} />
                            <Text style={styles.playButtonText}>Detaylar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.listButton, isWatchlisted && styles.listButtonActive]}
                            onPress={handleToggleWatchlist}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={isWatchlisted ? "checkmark" : "add"}
                                size={18}
                                color={isWatchlisted ? colors.onPrimary : colors.onSurface}
                                style={{ marginRight: 4 }}
                            />
                            <Text style={[styles.listButtonText, isWatchlisted && styles.listButtonTextActive]}>
                                {isWatchlisted ? "Listemde" : "Listem"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    hero: { width: "100%", height: 480, justifyContent: "flex-end" },
    heroImage: { opacity: 0.85 },
    gradient: { flex: 1, justifyContent: "flex-end", paddingBottom: 20 },
    content: { paddingHorizontal: 16 },
    genres: {
        color: colors.secondary,
        fontFamily: fonts.label,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 6,
    },
    title: {
        color: colors.onSurface,
        fontFamily: fonts.headlineBold,
        fontSize: 30,
        marginBottom: 8,
    },
    metaRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
    meta: { color: colors.primary, fontFamily: fonts.label, fontSize: 13 },
    overview: {
        color: colors.onSurfaceVariant,
        fontFamily: fonts.body,
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 16,
    },
    buttonRow: { flexDirection: "row", gap: 12 },
    playButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: radius.md,
    },
    playButtonText: { color: colors.onPrimary, fontFamily: fonts.label, fontSize: 14 },
    listButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(64,40,50,0.5)",
        borderWidth: 1,
        borderColor: "rgba(255,77,141,0.5)",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: radius.md,
    },
    listButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    listButtonText: { color: colors.onSurface, fontFamily: fonts.label, fontSize: 14 },
    listButtonTextActive: { color: colors.onPrimary },
});