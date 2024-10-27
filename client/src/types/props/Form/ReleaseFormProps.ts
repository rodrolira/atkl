export interface ReleaseFormProps {
    handleSubmit: (values: any) => void; // Adjust the type as needed
    initialValues: any; // Adjust the type as needed
    validationSchema: any; // Adjust the type as needed
    artists: Array<{ id: number; artist_name: string }>;
    genres: Array<{ id: number; name: string }>;
    handleClose: () => void;
}

export interface EditReleaseModalProps {
    id: number;
    onClose: () => void
}