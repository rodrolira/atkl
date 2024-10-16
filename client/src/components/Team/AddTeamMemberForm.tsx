import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@/components/Button/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { createTeamMemberRequest } from '@/app/api/team'; // Ensure you have this function in your API
import { AddTeamMemberFormProps } from '@/types/props/Form/TeamFormProps';
import { TeamMemberFormValues } from './TeamMemberFormInterfaces';


const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({
  open,
  closePopup,
  onTeamMemberAdded,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const initialValues: TeamMemberFormValues = {
    name: '',
    position: '',
    bio: '',
    image_url: '',
  };

  const onSubmit = async (values: TeamMemberFormValues, actions: any) => {
    try {
      const newTeamMember = await createTeamMemberRequest(values);
      actions.setSubmitting(false);
      closePopup();
      onTeamMemberAdded && onTeamMemberAdded(newTeamMember);
    } catch (error) {
      console.error('Error adding team member:', error);
      setError(t('error.addTeamMember'));
      actions.setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={closePopup} fullWidth maxWidth="sm">
      <DialogTitle style={{ textAlign: 'center' }}>
        {t('addTeamMember.title')}
        <IconButton style={{ float: 'right' }} onClick={closePopup}>
          <CloseIcon color="error" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(t('validation.nameRequired')),
            position: Yup.string(),
            bio: Yup.string(),
            image_url: Yup.string().url(t('validation.invalidUrl')),
          })}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={2} margin={2}>
                <Field name="name">
                  {({ field, form }: any) => (
                    <TextField
                      {...field}
                      label={t('label.name')}
                      variant="outlined"
                      error={Boolean(form.errors.name && form.touched.name)}
                      helperText={form.errors.name && form.touched.name && form.errors.name}
                    />
                  )}
                </Field>
                <Field name="position">
                  {({ field, form }: any) => (
                    <TextField
                      {...field}
                      label={t('label.position')}
                      variant="outlined"
                      error={Boolean(form.errors.position && form.touched.position)}
                      helperText={form.errors.position && form.touched.position && form.errors.position}
                    />
                  )}
                </Field>
                <Field name="bio">
                  {({ field, form }: any) => (
                    <TextField
                      {...field}
                      label={t('label.bio')}
                      variant="outlined"
                      multiline
                      rows={4}
                      error={Boolean(form.errors.bio && form.touched.bio)}
                      helperText={form.errors.bio && form.touched.bio && form.errors.bio}
                    />
                  )}
                </Field>
                <Field name="image_url">
                  {({ field, form }: any) => (
                    <TextField
                      {...field}
                      label={t('label.image_url')}
                      variant="outlined"
                      error={Boolean(form.errors.image_url && form.touched.image_url)}
                      helperText={form.errors.image_url && form.touched.image_url && form.errors.image_url}
                    />
                  )}
                </Field>
                {error && <div className="text-red-500">{error}</div>}
                <Button
                  type="submit"
                  colorClass="bg-[#24db13] text-[#122e0f]"
                  disabled={isSubmitting}
                  variant="contained"
                  className="mx-auto flex justify-center"
                >
                  {t('submit')}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberForm;
