// EditTeamMemberModal.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getTeamMemberRequest, updateTeamMemberRequest, getRolesRequest } from '@/app/api/team';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Role } from '@/types/interfaces/Role';
import { TeamMemberValues } from '@/types/interfaces/TeamMember';
import { EditTeamMemberModalProps } from '@/types/props/Form/TeamFormProps';

const validationSchema = Yup.object().shape({
  member_name: Yup.string().required('Name is required'),
  roleIds: Yup.array().required('Role is required'),
});



const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({ id, onClose }) => {
  const { t } = useTranslation();
  const [initialValues, setInitialValues] = useState({
    member_name: '',
    roleIds: [],
  });
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchTeamMember = async () => {
      const response = await getTeamMemberRequest(id);
      const teamMember = response.data;
      setInitialValues({
        member_name: teamMember.member_name,
        roleIds: teamMember.Roles.map((role: Role) => role.id),
      });
    };

    const fetchRoles = async () => {
      const response = await getRolesRequest();
      setRoles(response.data);
    };

    fetchTeamMember();
    fetchRoles();
  }, [id]);

  const handleSubmit = async (values: TeamMemberValues) => {
    try {
      await updateTeamMemberRequest(id, values);
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
