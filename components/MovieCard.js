import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, radius } from "../constants/theme";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w342";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ item, variant = "poster", width }) {
    const router = useRouter();
    const title = item.title || item.name;
    const isTV = item.media_type ? item.media_type === "tv" : !item.title && !!item.name;
    const isBackdrop = variant === "backdrop";
    const imagePath = isBackdrop ? item.backdrop_path : item.poster_path;
    const imageUrl = imagePath
        ? `${isBackdrop ? BACKDROP_BASE_URL : POSTER_BASE_URL}${imagePath}`
        : null;

    const cardWidth = width || (isBackdrop ? 220 : 120);
    const posterHeight = isBackdrop ? cardWidth * 0.5625 : cardWidth * 1.5;

    return (
        <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() => router.push(isTV ? `/tv/${item.id}` : `/movie/${item.id}`)}
            activeOpacity={0.8}
        >
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={[styles.image, { width: cardWidth, height: posterHeight }]}
                />
            ) : (
                <View style={[styles.image, styles.placeholder, { width: cardWidth, height: posterHeight }]}>
                    <Text style={styles.placeholderText}>Görsel Yok</Text>
                </View>
            )}
            {!isBackdrop && (
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { marginRight: 12 },
    image: {
        borderRadius: radius.lg,
        backgroundColor: colors.surfaceContainer,
    },
    placeholder: { justifyContent: "center", alignItems: "center" },
    placeholderText: { color: colors.outline, fontSize: 12, fontFamily: fonts.body },
    title: {
        marginTop: 8,
        fontSize: 13,
        color: colors.onSurface,
        fontFamily: fonts.bodyMedium,
    },
});