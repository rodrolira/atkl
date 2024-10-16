// DialogManager.jsx
import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import Button from '@/components/Button/Button';

const DialogManager = ({ children }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={handleOpen}
        className="btn-add mx-auto"
        variant="contained"
      >
        Add Release
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {children(handleClose)}
      </Dialog>
    </>
  );
};

export default DialogManager;
