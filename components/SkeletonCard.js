import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
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

export function SkeletonMovieCard({ width = 120, variant = "poster" }) {
    const isBackdrop = variant === "backdrop";
    const height = isBackdrop ? width * 0.5625 : width * 1.5;

    return (
        <SkeletonBox
            width={width}
            height={height}
            style={{ marginRight: 12, marginBottom: isBackdrop ? 0 : 8 }}
        />
    );
}

const styles = StyleSheet.create({});