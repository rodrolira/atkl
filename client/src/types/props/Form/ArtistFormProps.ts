export interface AddArtistFormProps {
    openPopup: boolean;
    closePopup: () => void;
    onArtistAdded?: (artist: any) => void; // Puedes definir un tipo más específico para el artista
}

export interface EditArtistModalProps {
    id: string;
    onClose: () => void;
}