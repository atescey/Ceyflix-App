import { View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SkeletonBox, SkeletonMovieCard } from "./SkeletonCard";
import { colors } from "../constants/theme";

const screenWidth = Dimensions.get("window").width;

export default function HomeSkeleton() {
    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Üst bar: logo + ikonlar */}
            <View style={styles.header}>
                <SkeletonBox width={100} height={22} />
                <View style={styles.headerIcons}>
                    <SkeletonBox width={22} height={22} style={{ borderRadius: 11, marginRight: 16 }} />
                    <SkeletonBox width={26} height={26} style={{ borderRadius: 13 }} />
                </View>
            </View>

            {/* Filtre çipleri */}
            <View style={styles.chipRow}>
                <SkeletonBox width={70} height={32} style={{ borderRadius: 20, marginRight: 10 }} />
                <SkeletonBox width={80} height={32} style={{ borderRadius: 20, marginRight: 10 }} />
                <SkeletonBox width={70} height={32} style={{ borderRadius: 20, marginRight: 10 }} />
                <SkeletonBox width={90} height={32} style={{ borderRadius: 20 }} />
            </View>

            {/* Hero banner */}
            <SkeletonBox
                width={screenWidth}
                height={480}
                style={{ borderRadius: 0, marginBottom: 24 }}
            />

            {/* Yatay kart satırı 1 (backdrop, "Yeni içerikler" gibi) */}
            <SkeletonRow variant="backdrop" count={3} />

            {/* Top 10 satırı (büyük posterler) */}
            <SkeletonBox width={140} height={18} style={{ marginLeft: 16, marginBottom: 12, marginTop: 8 }} />
            <SkeletonRow variant="poster" count={4} width={110} height={165} />

            {/* Kategori satırı */}
            <SkeletonBox width={120} height={18} style={{ marginLeft: 16, marginBottom: 12, marginTop: 8 }} />
            <SkeletonRow variant="poster" count={4} />
        </SafeAreaView>
    );
}

function SkeletonRow({ variant, count, width, height }) {
    const isBackdrop = variant === "backdrop";
    const itemWidth = width || (isBackdrop ? 220 : 120);
    const itemHeight = height || (isBackdrop ? itemWidth * 0.5625 : itemWidth * 1.5);

    return (
        <View style={styles.row}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonBox
                    key={i}
                    width={itemWidth}
                    height={itemHeight}
                    style={{ marginRight: 12 }}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerIcons: { flexDirection: "row", alignItems: "center" },
    chipRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    row: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 24,
    },
});