import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "ceyflix_users";
const SESSION_KEY = "ceyflix_session";

async function getUsers() {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
}

export async function registerUser(email, password) {
    const users = await getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        throw new Error("Bu e-posta ile zaten bir hesap var");
    }
    const updated = [...users, { email, password }];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));
    await AsyncStorage.setItem(SESSION_KEY, email);
}

export async function loginUser(email, password) {
    const users = await getUsers();
    const match = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) {
        throw new Error("E-posta veya şifre hatalı");
    }
    await AsyncStorage.setItem(SESSION_KEY, email);
    return match;
}

export async function getSession() {
    return AsyncStorage.getItem(SESSION_KEY);
}