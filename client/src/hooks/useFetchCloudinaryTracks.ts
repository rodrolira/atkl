import { useEffect, useState } from "react";
import { Track } from "@/types/interfaces/Track";


const CLOUDINARY_CLOUD_NAME = "dotfwyxwr"; // Tu Cloud Name en Cloudinary
const CLOUDINARY_FOLDER = "releases/UKN001"; // Carpeta donde están los archivos

const useFetchCloudinaryTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(
          `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/${CLOUDINARY_FOLDER}.json`
        );

        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de archivos.");
        }

        const data = await response.json();

        // Filtrar solo archivos de audio
        const audioTracks = data.resources
          .filter((file: any) => file.format === "mp3" || file.format === "wav")
          .map((file: any, index: number) => ({
            id: `${CLOUDINARY_FOLDER}-${index}`,
            title: file.public_id.split("/").pop()?.replace(/_/g, " ") || "Unknown Track",
            audioUrl: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${file.public_id}.${file.format}`,
          }));

        setTracks(audioTracks);
      } catch (err) {
        setError("Error al obtener los tracks desde Cloudinary.");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return { tracks, loading, error };
};

export default useFetchCloudinaryTracks;
