import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, radius } from "../constants/theme";

const POSTER_URL = "https://image.tmdb.org/t/p/w342";

export default function TopTenRow({ movies }) {
    const router = useRouter();

    return (
        <FlatList
            data={movies.slice(0, 10)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
                const isTV = item.media_type ? item.media_type === "tv" : !item.title && !!item.name;
                return (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push(isTV ? `/tv/${item.id}` : `/movie/${item.id}`)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.rank}>{index + 1}</Text>
                        {item.poster_path ? (
                            <Image source={{ uri: `${POSTER_URL}${item.poster_path}` }} style={styles.poster} />
                        ) : (
                            <View style={[styles.poster, styles.placeholder]} />
                        )}
                    </TouchableOpacity>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    list: { paddingHorizontal: 16, paddingLeft: 30 },
    item: { flexDirection: "row", alignItems: "flex-end", marginRight: 4 },
    rank: {
        fontFamily: fonts.headlineBold,
        fontSize: 72,
        color: colors.primary,
        textShadowColor: "rgba(255, 77, 141, 0.4)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
        marginRight: -22,
        marginBottom: -6,
        zIndex: 1,
    },
    poster: { width: 110, height: 165, borderRadius: radius.md, backgroundColor: colors.surfaceContainer },
    placeholder: {},
});