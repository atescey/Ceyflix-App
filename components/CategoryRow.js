import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import MovieCard from "./MovieCard";
import { SkeletonMovieCard } from "./SkeletonCard";
import { colors, fonts } from "../constants/theme";

export default function CategoryRow({ title, fetchFn, onLoad }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchFn()
            .then((data) => {
                const results = data.results || [];
                setItems(results);
                if (onLoad) onLoad(results);
            })
            .catch((err) => console.error(`${title} hatası:`, err.message))
            .finally(() => setLoading(false));
    }, [title]);

    if (!loading && items.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text style={styles.title}>{title}</Text>
            {loading ? (
                <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
                    {[1, 2, 3].map((i) => (
                        <SkeletonMovieCard key={i} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={items}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <MovieCard item={item} />}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 8 },
    title: {
        fontSize: 18,
        color: colors.onSurface,
        fontFamily: fonts.headline,
        marginLeft: 16,
        marginBottom: 12,
    },
    list: { paddingHorizontal: 16, paddingBottom: 8 },
});