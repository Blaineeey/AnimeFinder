import AnimeDetails from "../../components/anime-details"

export default function AnimeDetailsPage({ params }: { params: { id: string } }) {
  return <AnimeDetails id={params.id} />
}
