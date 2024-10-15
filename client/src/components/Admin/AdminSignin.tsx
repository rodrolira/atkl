import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  colors,
  FormControlLabel,
  Typography,
  Grid,
} from '@mui/material';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import CustomInput from '@/components/atoms/Input/CustomInput';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Logo from '@/components/atoms/Logo/Logo';
import { useTranslation } from 'react-i18next';

// Define the shape of the form values
interface FormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const AdminSignin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signin, isAuthenticated, errors: signinErrors } = useAdminAuth();

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required(t('validation.usernameRequired')),
    password: Yup.string().required(t('validation.passwordRequired')),
  });

  // Formik setup
  const formik = useFormik<FormValues>({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false, // Added rememberMe to initial values
    },
    validationSchema,
    onSubmit: (values) => {
      const { username, password, rememberMe } = values;
      signin({ username, password, rememberMe }); // Assuming signin handles rememberMe
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <React.Suspense fallback={<div>{t('loading')}</div>}>
      <Grid
        minHeight={550}
        sx={{
          boxShadow: {
            md: '15px 2px 5px -5px',
            lg: '15px 2px 5px -5px',
            xl: '15px 2px 5px -5px',
          },
          marginTop: { xs: '50px', sm: '50px', md: '0px' },
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            blockSize: '100%',
            borderRadius: '30px',
          }}
        >
          <Box width="80%">
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                sx={{
                  mt: '60px',
                  width: '150px',
                  height: '150px',
                  bgcolor: 'black',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Logo isAdminSignin />
              </Box>
              <Typography color="white" fontSize="24px" fontWeight="bold" mt={7} mb={3}>
                {t('login.loginAdmin')}
              </Typography>
            </Box>

            <div>
              <Box component="form" onSubmit={formik.handleSubmit}>
                <CustomInput
                  type="text"
                  label={t('login.username')}
                  placeholder={t('login.enterUsername')}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  onBlur={formik.handleBlur}
                  name="username"
                  id="username"
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.username}</p>
                  </div>
                )}

                <CustomInput
                  label={t('login.password')}
                  placeholder={t('login.password')}
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  name="password"
                  id="password"
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.password}</p>
                  </div>
                )}

                <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2} width="100%" color="white">
                  <FormControlLabel
                    control={
                      <Checkbox
                        disableRipple
                        sx={{ p: 0, pr: 1 }}
                        checked={formik.values.rememberMe}
                        onChange={formik.handleChange}
                        name="rememberMe"
                      />
                    }
                    label={t('login.rememberMe')}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 4, mb: 4, boxShadow: `0 0 20px ${colors.green[500]}` }}
                >
                  {t('login.login')}
                </Button>
                {signinErrors && signinErrors.length > 0 && (
                  <div>
                    {signinErrors.map((error, index) => (
                      <div className="text-red-900 font-bold mb-4 bg-red-200" key={index}>
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </Box>
            </div>
          </Box>
        </Box>
      </Grid>
    </React.Suspense>
  );
};

export default AdminSignin;
