import { Artist } from "../../interfaces/Artist";

export interface ArtistsTableProps {
    artists: Artist[]; // Expecting an array of artists
    onEdit: (artist: Artist) => void;
    onDelete: (id: number) => void;
    selectedArtists: Artist[];
    setSelectedArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
    isDeleteMode: boolean;    
} 