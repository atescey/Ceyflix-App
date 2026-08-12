import { useLocalSearchParams } from "expo-router";
import DetailContent from "../../components/DetailContent";

export default function TVDetailScreen() {
    const { id } = useLocalSearchParams();
    return <DetailContent id={id} mediaType="tv" />;
}