import { Artist } from "@/types/interfaces/Artist";

export interface AddArtistFormProps {
    id?: number;
    openPopup: boolean;
    closePopup: () => void;
    onArtistAdded?: (artist: Artist) => void; // Puedes definir un tipo más específico para el artista
}

export interface EditArtistModalProps {
    id: number;
    onClose: () => void;
}