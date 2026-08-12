import { useLocalSearchParams } from "expo-router";
import DetailContent from "../../components/DetailContent";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  return <DetailContent id={id} mediaType="movie" />;
}