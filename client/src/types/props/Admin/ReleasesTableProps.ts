import Release from "../../interfaces/Release";

export interface ReleasesTableProps {
    releases: Release[];
    onEdit: (release: Release) => void;
    onDelete: (releaseId: number) => void;
  }
  