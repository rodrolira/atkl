export interface AddTeamMemberFormProps {
    open: boolean;
    closePopup: () => void;
    onTeamMemberAdded?: (newTeamMember: any) => void;
}

export interface EditTeamMemberModalProps {
    id: string;
    onClose: () => void;
  }