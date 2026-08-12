import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors, radius } from "../constants/theme";

export function SkeletonBox({ width, height, style }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View
            style={[
                { width, height, backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.lg, opacity },
                style,
            ]}
        />
    );
}

export function SkeletonMovieCard({ width = 120, variant = "poster", style }) {
    const isBackdrop = variant === "backdrop";
    const posterHeight = isBackdrop ? width * 0.5625 : width * 1.5;

    return (
        <View style={[{ width, marginRight: 12, marginBottom: isBackdrop ? 0 : 12 }, style]}>
            <SkeletonBox width={width} height={posterHeight} />
            {!isBackdrop && (
                <View style={{ marginTop: 8 }}>
                    <SkeletonBox width={width * 0.85} height={12} style={{ marginBottom: 4, borderRadius: radius.sm }} />
                    <SkeletonBox width={width * 0.5} height={12} style={{ borderRadius: radius.sm }} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({});