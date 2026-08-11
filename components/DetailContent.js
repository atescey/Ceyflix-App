import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { getMovieDetails, getTVDetails } from "../services/tmdbApi";
import { useMovieList } from "../hooks/useMovieList";
import { colors, fonts, radius } from "../constants/theme";
import { SkeletonBox } from "./SkeletonCard";

const BACKDROP_URL = "https://image.tmdb.org/t/p/w780";
const PROFILE_URL = "https://image.tmdb.org/t/p/w185";
const screenWidth = Dimensions.get("window").width;

export default function DetailContent({ id, mediaType = "movie" }) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const favorites = useMovieList("favorites");
    const watchlist = useMovieList("watchlist");

    const isTV = mediaType === "tv";

    useEffect(() => {
        setLoading(true);
        setItem(null);
        const fetchFn = isTV ? getTVDetails : getMovieDetails;
        fetchFn(id)
            .then(setItem)
            .catch((err) => console.error("Detay hatası:", err.message))
            .finally(() => setLoading(false));
    }, [id, isTV]);

    if (loading) {
        return <DetailSkeleton />;
    }

    if (!item) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>
                    {isTV ? "Dizi bulunamadı" : "Film bulunamadı"}
                </Text>
            </View>
        );
    }

    // Film/dizi arasındaki alan adı farklarını normalize et
    const title = item.title || item.name;
    const dateStr = item.release_date || item.first_air_date;
    const year = (dateStr || "").slice(0, 4);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
    const runtime = isTV
        ? item.episode_run_time?.[0]
        : item.runtime;
    const seasonCount = isTV ? item.number_of_seasons : null;

    const trailer = item.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    );
    const cast = item.credits?.cast?.slice(0, 15) || [];

    const listPayload = {
        id: item.id,
        title,
        poster_path: item.poster_path,
        media_type: mediaType,
    };

    return (
        <ScrollView style={styles.container}>
            {item.backdrop_path && (
                <Image
                    source={{ uri: `${BACKDROP_URL}${item.backdrop_path}` }}
                    style={styles.backdrop}
                />
            )}

            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>

                <View style={styles.metaRow}>
                    {rating && <Text style={styles.meta}>⭐ {rating}</Text>}
                    {year && <Text style={styles.meta}>{year}</Text>}
                    {runtime ? <Text style={styles.meta}>{runtime} dk</Text> : null}
                    {seasonCount ? (
                        <Text style={styles.meta}>{seasonCount} Sezon</Text>
                    ) : null}
                </View>

                {item.genres?.length > 0 && (
                    <View style={styles.genreRow}>
                        {item.genres.map((g) => (
                            <View key={g.id} style={styles.genreChip}>
                                <Text style={styles.genreText}>{g.name}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <Text style={styles.overview}>{item.overview}</Text>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => favorites.toggleItem(listPayload)}
                    >
                        <Ionicons
                            name={favorites.isInList(item.id) ? "heart" : "heart-outline"}
                            size={22}
                            color={colors.primary}
                        />
                        <Text style={styles.actionText}>Favori</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => watchlist.toggleItem(listPayload)}
                    >
                        <Ionicons
                            name={watchlist.isInList(item.id) ? "bookmark" : "bookmark-outline"}
                            size={22}
                            color={colors.primary}
                        />
                        <Text style={styles.actionText}>İzlenecek</Text>
                    </TouchableOpacity>
                </View>

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
                            keyExtractor={(c) => c.credit_id || c.id.toString()}
                            contentContainerStyle={{ paddingRight: 16 }}
                            renderItem={({ item: actor }) => (
                                <View style={styles.castItem}>
                                    {actor.profile_path ? (
                                        <Image
                                            source={{ uri: `${PROFILE_URL}${actor.profile_path}` }}
                                            style={styles.castImage}
                                        />
                                    ) : (
                                        <View style={[styles.castImage, styles.castImagePlaceholder]} />
                                    )}
                                    <Text style={styles.castName} numberOfLines={1}>
                                        {actor.name}
                                    </Text>
                                    <Text style={styles.castCharacter} numberOfLines={1}>
                                        {actor.character}
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

function DetailSkeleton() {
    return (
        <ScrollView style={styles.container} scrollEnabled={false}>
            <SkeletonBox width={screenWidth} height={screenWidth * 0.5625} style={{ borderRadius: 0 }} />
            <View style={styles.content}>
                <SkeletonBox width={screenWidth * 0.6} height={28} style={{ marginBottom: 12 }} />
                <SkeletonBox width={screenWidth * 0.4} height={16} style={{ marginBottom: 16 }} />
                <SkeletonBox width="100%" height={14} style={{ marginBottom: 6 }} />
                <SkeletonBox width="100%" height={14} style={{ marginBottom: 6 }} />
                <SkeletonBox width="70%" height={14} style={{ marginBottom: 20 }} />
                <SkeletonBox width={screenWidth - 32} height={(screenWidth - 32) * 0.5625} />
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
    metaRow: { flexDirection: "row", gap: 16, marginBottom: 12, flexWrap: "wrap" },
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
        marginBottom: 16,
    },
    actionRow: { flexDirection: "row", gap: 24, marginBottom: 24 },
    actionButton: { alignItems: "center", gap: 4 },
    actionText: { color: colors.onSurfaceVariant, fontFamily: fonts.label, fontSize: 11 },
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