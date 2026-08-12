import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVE_PROFILE_KEY = "ceyflix_active_profile";

export function useActiveProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
            setProfile(raw ? JSON.parse(raw) : null);
        } catch (err) {
            console.error("Aktif profil yüklenemedi:", err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const selectProfile = useCallback(async (p) => {
        setProfile(p);
        await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(p));
    }, []);

    return { profile, loading, selectProfile };
}