import React, { useEffect, useMemo, memo } from 'react';
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
import { FormValues } from '@/types/interfaces/Form';
import Loading from '../atoms/Loading/Loading';


const AdminSignin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signin, isAuthenticated, errors: signinErrors } = useAdminAuth();

  // Memoize validation schema using Yup
  const validationSchema = useMemo(() => Yup.object({
    username: Yup.string().required(t('validation.usernameRequired')),
    password: Yup.string().required(t('validation.passwordRequired')),
  }), [t]);

  // Memoize Formik setup
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

  // Memoize sx prop for Grid
  const gridSx = useMemo(() => ({
    marginTop: {
      xs: '50px',
      md: '30px',
      lg: '0px',
    },
    marginBottom: '20px',
    width: '80%',
  }), []);

  // Memoize sx prop for outer Box
  const outerBoxSx = useMemo(() => ({
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    blockSize: '100%',
    borderRadius: '10px',
    border: '1px solid rgba(22, 163, 74, 0.2)',
  }), []);

  // Memoize sx prop for inner Box (width: 80%)
  const innerBoxSx = useMemo(() => ({ width: '80%' }), []);

  // Memoize sx prop for Logo container Box
  const logoBoxSx = useMemo(() => ({
    mt: {
      xs: '20px',
      sm: '50px',
      md: '50px',
      lg: '50px',
      xl: '50px',
    },
    width: {
      xs: '100px',
      sm: '150px',
      md: '200px',
      lg: '200px',
      xl: '200px',
    },
    height: {
      xs: '100px',
      sm: '150px',
      md: '200px',
      lg: '200px',
      xl: '200px',
    },
    bgcolor: 'black',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }), []);

  // Memoize sx prop for Typography
  const typographySx = useMemo(() => ({
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    mt: 2,
    mb: 1,
  }), []);

  // Memoize control prop for FormControlLabel
  const rememberMeControl = useMemo(() => (
    <Checkbox
      disableRipple
      sx={{ p: 0, pr: 1 }}
      checked={formik.values.rememberMe}
      onChange={formik.handleChange}
      name="rememberMe"
    />
  ), [formik.values.rememberMe, formik.handleChange]);

  // Memoize FormControlLabel component
  const rememberMeFormControlLabel = useMemo(() => (
    <FormControlLabel
      control={rememberMeControl}
      label={t('login.rememberMe')}
    />
  ), [rememberMeControl, t]);

  // Memoize sx prop for Button
  const buttonSx = useMemo(() => ({
    mt: 1,
    mb: 2.5,
    boxShadow: `0 0 15px ${colors.green[500]}`,
    minWidth: '25%',
  }), []);

  // Memoize the Grid component
  const memoizedGrid = useMemo(() => (
    <Grid
      minHeight='100%'
      sx={gridSx}
    >
      <Box
        sx={outerBoxSx}
      >
        <Box sx={innerBoxSx}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              sx={logoBoxSx}
            >
              <Logo alt="Company Logo" isAdminSignin />
            </Box>
            <Typography sx={typographySx}>
              {t('login.loginAdmin')}
            </Typography>
          </Box>

          <div>
            <Box component="form" onSubmit={formik.handleSubmit} autoComplete="off">
              <CustomInput
                type="text"
                label={t('login.username') + ':'}
                placeholder={t('login.enterUsername')}
                onChange={formik.handleChange}
                name="username"
                id="username"
                value={formik.values.username}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="mt-2 min-h-10 overflow-hidden inline-block relative w-full bg-red-100 rounded border-l-4 border-red-500 text-red-700 ">
                  <p className="mb-1 font-bold text-center h-[30%]">Error</p>
                  <p>{formik.errors.username}</p>
                </div>
              )}

              <CustomInput
                label={t('login.password') + ':'}
                placeholder={t('login.password')}
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
                id="password"
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="mt-2 min-h-10 overflow-hidden inline-block relative w-full bg-red-100 rounded border-l-4 border-red-500 text-red-700">
                  <p className="mb-1 font-bold text-center h-[30%]">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              )}

              <Box display="flex" flexDirection="row" justifyContent="center" width="100%" color="white">
                {rememberMeFormControlLabel}
              </Box>
              <Button
                id='loginAdminSubmit'
                type="submit"
                variant="contained"
                fullWidth
                sx={buttonSx}
              >
                {t('login.login')}
              </Button>
              {signinErrors && signinErrors.length > 0 && (
                <div>
                  {signinErrors.map((error, index) => (
                    <div className="text-red-900 font-bold rounded mb-4 bg-red-200" key={index}>
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
  ), [gridSx, outerBoxSx, innerBoxSx, logoBoxSx, typographySx, rememberMeFormControlLabel, buttonSx, formik, t, signinErrors]);

  return (
    <React.Suspense fallback={<div><Loading /></div>}>
      {memoizedGrid}
    </React.Suspense>
  );
};

export default React.memo(AdminSignin);
