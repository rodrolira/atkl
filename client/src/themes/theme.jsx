import { createTheme } from '@mui/material';

export const colors = {
  green: {
    100: '#d5f5e0',
    200: '#abebc1',
    300: '#81e2a3',
    400: '#57d884',
    500: '#2dce65',
    600: '#24a551',
    700: '#1b7c3d',
    800: '#125228',
    900: '#092914',
  },
  lightBlue: {
    100: '#d2eafb',
    200: '#a6d5f8',
    300: '#79c0f4',
    400: '#4dabf1',
    500: '#2096ed',
    600: '#1a78be',
    700: '#135a8e',
    800: '#0d3c5f',
    900: '#061e2f',
  },
  input: {
    100: '#d3d6da',
    200: '#a7aeb5',
    300: '#7b8591',
    400: '#4f5d6c',
    500: '#000000',
    600: '#1A1A1A',
    700: '#2A2A2A',
    800: '#4A4A4A',
    900: '#9A9A9A',
  },
  background: {
    100: '#000000',
    200: '#0A0A0A',
    300: '#1A1A1A',
    400: '#2A2A2A',
    500: '#4A4A4A',
    600: '#6A6A6A',
    700: '#8A8A8A',
    800: '#BEBEBE',
    900: '#FFFFFF',
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#000000',
    },
  },
  typography: {
    fontFamily: ['"Inter Tight"', 'Inter', 'sans-serif'].join(' '),
    textAlign: 'center',
  },
});
