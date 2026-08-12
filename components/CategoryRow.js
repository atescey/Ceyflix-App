import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import MovieCard from "./MovieCard";
import { SkeletonMovieCard } from "./SkeletonCard";
import { colors, fonts } from "../constants/theme";

export default function CategoryRow({ title, fetchFn, variant = "poster", onLoad }) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        setLoading(true);
        setPage(1);
        fetchFn(1)
            .then((data) => {
                const results = data.results || [];
                setItems(results);
                setTotalPages(data.total_pages || 1);
                if (onLoad) onLoad(results);
            })
            .catch((err) => console.error(`${title} hatası:`, err.message))
            .finally(() => setLoading(false));
    }, [title]);

    const loadMore = useCallback(() => {
        if (loading || loadingMore || page >= totalPages) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        fetchFn(nextPage)
            .then((data) => {
                setItems((prev) => [...prev, ...(data.results || [])]);
                setPage(nextPage);
            })
            .catch((err) => console.error(`${title} hatası:`, err.message))
            .finally(() => setLoadingMore(false));
    }, [fetchFn, page, totalPages, loading, loadingMore, title]);

    if (!loading && items.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text style={styles.title}>{title}</Text>
            {loading ? (
                <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
                    {[1, 2, 3].map((i) => (
                        <SkeletonMovieCard
                            key={i}
                            variant={variant}
                            width={variant === "backdrop" ? 220 : undefined}
                        />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={items}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={({ item }) => <MovieCard item={item} variant={variant} />}
                    contentContainerStyle={styles.list}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator color={colors.primary} style={{ marginHorizontal: 16 }} />
                        ) : null
                    }
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