import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export function useMovieList(storageKey) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(storageKey);
            setItems(raw ? JSON.parse(raw) : []);
        } catch (err) {
            console.error("Liste yüklenemedi:", err.message);
        } finally {
            setLoading(false);
        }
    }, [storageKey]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    const isInList = useCallback(
        (movieId) => items.some((item) => item.id === movieId),
        [items]
    );

    const toggleItem = useCallback(
        async (movie) => {
            const exists = items.some((item) => item.id === movie.id);
            const updated = exists
                ? items.filter((item) => item.id !== movie.id)
                : [...items, movie];

            setItems(updated);
            try {
                await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
            } catch (err) {
                console.error("Liste güncellenemedi:", err.message);
            }
        },
        [items, storageKey]
    );

    return { items, loading, isInList, toggleItem, reload: load };
}