import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function profilesKey(email) {
    return `ceyflix_profiles_${email}`;
}

const AVATAR_COLORS = ["#ff4d8d", "#ecbbba", "#a38b8e", "#ff7aa9", "#c26b8f"];

export function useProfiles(email) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!email) return;
        try {
            const raw = await AsyncStorage.getItem(profilesKey(email));
            let list = raw ? JSON.parse(raw) : [];

            if (list.length === 0) {
                list.push({
                    id: Date.now().toString(),
                    name: email.split("@")[0],
                    color: AVATAR_COLORS[0],
                });
            }

            const hasKid = list.some((p) => p.isKid);
            if (!hasKid) {
                list.push({
                    id: (Date.now() + 1).toString(),
                    name: "Çocuk",
                    color: AVATAR_COLORS[1],
                    isKid: true,
                });
            }

            await AsyncStorage.setItem(profilesKey(email), JSON.stringify(list));
            setProfiles(list);
        } catch (err) {
            console.error("Profiller yüklenemedi:", err.message);
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        load();
    }, [load]);

    const addProfile = useCallback(
        async (name) => {
            const newProfile = {
                id: Date.now().toString(),
                name,
                color: AVATAR_COLORS[profiles.length % AVATAR_COLORS.length],
            };
            const updated = [...profiles, newProfile];
            setProfiles(updated);
            await AsyncStorage.setItem(profilesKey(email), JSON.stringify(updated));
        },
        [email, profiles]
    );

    return { profiles, loading, addProfile };
}