import { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TextInput,
    ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getSession } from "../hooks/useAuth";
import { useProfiles } from "../hooks/useProfiles";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { colors, fonts, radius } from "../constants/theme";

export default function ProfilesScreen() {
    const router = useRouter();
    const [email, setEmail] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace("/");
            } else {
                setEmail(session);
            }
        });
    }, []);

    const { profiles, loading, addProfile } = useProfiles(email);
    const { selectProfile } = useActiveProfile();

    const handleSelect = async (profile) => {
        await selectProfile(profile);
        router.replace("/(tabs)/home");
    };

    const handleAddProfile = async () => {
        if (!newName.trim()) return;
        await addProfile(newName.trim());
        setNewName("");
        setModalVisible(false);
    };

    if (loading || !email) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.centered} />
            </SafeAreaView>
        );
    }

    return (
        <ImageBackground
            source={require("../assets/images/cinema-background.png")}
            style={styles.background}
            imageStyle={{ opacity: 0.5 }}
        >
            <View style={styles.overlay} />
            <SafeAreaView style={styles.safe}>
                <View style={styles.content}>
                    <Text style={styles.title}>Kim İzliyor?</Text>

                    <FlatList
                        data={[...profiles, { id: "add", isAdd: true }]}
                        numColumns={3}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.grid}
                        columnWrapperStyle={styles.row}
                        renderItem={({ item }) =>
                            item.isAdd ? (
                                <TouchableOpacity style={styles.profileItem} onPress={() => setModalVisible(true)}>
                                    <View style={[styles.avatar, styles.addAvatar]}>
                                        <Ionicons name="add" size={32} color={colors.onSurfaceVariant} />
                                    </View>
                                    <Text style={styles.profileName}>Profil Ekle</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.profileItem} onPress={() => handleSelect(item)}>
                                    <View style={[styles.avatar, { backgroundColor: item.color }]}>
                                        {item.isKid ? (
                                            <Ionicons name="happy" size={36} color={colors.onPrimary} />
                                        ) : (
                                            <Text style={styles.avatarLetter}>{item.name.charAt(0).toUpperCase()}</Text>
                                        )}
                                    </View>
                                    <Text style={styles.profileName} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    />
                </View>
            </SafeAreaView>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Yeni Profil</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Profil adı"
                            placeholderTextColor={colors.outline}
                            value={newName}
                            onChangeText={setNewName}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Vazgeç</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalConfirm} onPress={handleAddProfile}>
                                <Text style={styles.modalConfirmText}>Ekle</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: colors.background },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(31,20,24,0.55)" },
    safe: { flex: 1, justifyContent: "center" },
    centered: { flex: 1 },
    content: { paddingHorizontal: 16 },
    title: {
        fontSize: 26,
        color: colors.onSurface,
        fontFamily: fonts.headline,
        textAlign: "center",
        marginBottom: 32,
    },
    grid: { alignItems: "center", justifyContent: "center" },
    row: { justifyContent: "center", gap: 20 },
    profileItem: { alignItems: "center", marginBottom: 24, width: 90 },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: radius.lg,
        justifyContent: "center",
        alignItems: "center",
    },
    addAvatar: { backgroundColor: colors.surfaceVariant },
    avatarLetter: { fontSize: 30, color: colors.onPrimary, fontFamily: fonts.headlineBold },
    profileName: { color: colors.onSurfaceVariant, fontFamily: fonts.body, fontSize: 13, marginTop: 8, textAlign: "center" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 32 },
    modalBox: { backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.lg, padding: 20 },
    modalTitle: { color: colors.onSurface, fontFamily: fonts.headline, fontSize: 18, marginBottom: 16 },
    modalInput: {
        backgroundColor: colors.surfaceVariant,
        borderRadius: radius.md,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: colors.onSurface,
        fontFamily: fonts.body,
        marginBottom: 16,
    },
    modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 16 },
    modalCancel: { paddingVertical: 8, paddingHorizontal: 12 },
    modalCancelText: { color: colors.onSurfaceVariant, fontFamily: fonts.label },
    modalConfirm: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
    },
    modalConfirmText: { color: colors.onPrimary, fontFamily: fonts.label },
});