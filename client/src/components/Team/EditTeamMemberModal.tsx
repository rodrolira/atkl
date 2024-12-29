// EditTeamMemberModal.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Role } from '@/types/interfaces/Role';
import { TeamMemberValues } from '@/types/interfaces/TeamMember';
import { EditTeamMemberModalProps } from '@/types/props/Form/TeamFormProps';

const validationSchema = Yup.object().shape({
  member_name: Yup.string().required('Name is required'),
  roleIds: Yup.array().required('Role is required'),
});

// Datos simulados de roles
const mockRoles: Role[] = [
  { id: 1, label: 'Manager' },
  { id: 2, label: 'Developer' },
  { id: 3, label: 'Designer' },
];

// Datos simulados de un miembro del equipo
const mockTeamMember = {
  id: '1',
  member_name: 'John Doe',
  Roles: [
    { id: '1', label: 'Manager' },
    { id: '3', label: 'Designer' },
  ],
};

const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({ id, onClose }) => {
  const { t } = useTranslation();
  const [initialValues, setInitialValues] = useState<TeamMemberValues>({
    member_name: '',
    roleIds: [] as number[],
  });
  const [roles, setRoles] = useState<Role[]>(mockRoles); // Usamos roles simulados

  useEffect(() => {
    const fetchTeamMember = () => {
      // Simulamos la respuesta de un miembro del equipo
      if (id === mockTeamMember.id) {
        setInitialValues({
          member_name: mockTeamMember.member_name,
          roleIds: mockTeamMember.Roles.map((role) => parseInt(role.id)),
        });
      }
    };

    fetchTeamMember();
  }, [id]);

  const handleSubmit = async (values: TeamMemberValues) => {
    try {
      // Simulamos la actualización de un miembro del equipo
      console.log('Updated Team Member:', values);
      onClose();
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  return (
    <div>
      <h3>{t('edit_member')}</h3>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div>
              <label>{t('name')}</label>
              <Field name="member_name" type="text" />
            </div>

            <FormControl fullWidth>
              <InputLabel>{t('select_role')}</InputLabel>
              <Field
                as={Select}
                name="roleIds"
                multiple
                value={values.roleIds}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setFieldValue('roleIds', event.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.label}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>

            <button type="submit">{t('save')}</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditTeamMemberModal;
