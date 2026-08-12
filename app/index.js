import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter, Link } from "expo-router";
import { loginUser } from "../hooks/useAuth";
import { colors, fonts, radius } from "../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("E-posta ve şifre gerekli");
      return;
    }
    setSubmitting(true);
    try {
      await loginUser(email.trim(), password);
      router.replace("/profiles");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/auth-background.png")}
      style={styles.background}
      imageStyle={{ opacity: 0.6 }}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <Text style={styles.logo}>CEYFLİX</Text>

          <View style={styles.form}>
            <Text style={styles.title}>Giriş Yap</Text>

            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor={colors.outline}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor={colors.outline}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={submitting}>
              <Text style={styles.signInButtonText}>{submitting ? "Giriş yapılıyor..." : "Giriş Yap"}</Text>
            </TouchableOpacity>

            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.skipText}>
                  Ceyflix'te yeni misin? <Text style={styles.link}>Kayıt Ol</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.background },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(31,20,24,0.4)" },
  safe: { flex: 1 },
  flex: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  logo: {
    fontSize: 42,
    color: colors.primary,
    fontFamily: fonts.headlineBold,
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 4,
    textShadowColor: "rgba(255, 77, 141, 0.85)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
  form: { backgroundColor: colors.surfaceContainer, borderRadius: radius.xl, padding: 24 },
  title: { fontSize: 22, color: colors.onSurface, fontFamily: fonts.headline, marginBottom: 20 },
  input: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.onSurface,
    fontFamily: fonts.body,
    fontSize: 15,
    marginBottom: 12,
  },
  errorText: { color: colors.primary, fontFamily: fonts.body, fontSize: 13, marginBottom: 8 },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  signInButtonText: { color: colors.onPrimary, fontFamily: fonts.label, fontSize: 15 },
  skipText: { color: colors.onSurfaceVariant, fontFamily: fonts.body, fontSize: 13, textAlign: "center" },
  link: { color: colors.primary, fontFamily: fonts.label },
});
