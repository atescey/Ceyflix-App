import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "../constants/theme";

const BASE_FILTERS = ["Tümü", "Filmler", "Diziler", "Yeni", "Popüler"];

export default function FilterChips({ active, onChange, genres, selectedGenre, onSelectGenre }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                {BASE_FILTERS.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[styles.chip, active === filter && styles.chipActive]}
                        onPress={() => onChange(filter)}
                    >
                        <Text style={[styles.chipText, active === filter && styles.chipTextActive]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={[styles.chip, selectedGenre && styles.chipActive]}
                    onPress={() => setDropdownOpen(true)}
                >
                    <Text style={[styles.chipText, selectedGenre && styles.chipTextActive]}>
                        {selectedGenre ? selectedGenre.name : "Kategoriler"}
                    </Text>
                    <Ionicons
                        name="chevron-down"
                        size={14}
                        color={selectedGenre ? colors.onPrimary : colors.onSurfaceVariant}
                        style={{ marginLeft: 4 }}
                    />
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={dropdownOpen} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setDropdownOpen(false)}
                >
                    <View style={styles.dropdown}>
                        <FlatList
                            data={genres}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        onSelectGenre(item);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            ListHeaderComponent={
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        onSelectGenre(null);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>Tüm Kategoriler</Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surfaceVariant,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: radius.full,
    },
    chipActive: { backgroundColor: colors.primary },
    chipText: { color: colors.onSurfaceVariant, fontFamily: fonts.label, fontSize: 13 },
    chipTextActive: { color: colors.onPrimary },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 32 },
    dropdown: {
        backgroundColor: colors.surfaceContainerHigh,
        borderRadius: radius.lg,
        maxHeight: 400,
        padding: 8,
    },
    dropdownItem: { paddingVertical: 12, paddingHorizontal: 12 },
    dropdownItemText: { color: colors.onSurface, fontFamily: fonts.body, fontSize: 15 },
});