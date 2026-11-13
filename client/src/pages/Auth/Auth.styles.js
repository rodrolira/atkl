/* eslint-disable import/prefer-default-export */
export const FormSX = {
  p: 3,
  zIndex: 1,
  top: '50%',
  left: '50%',
  boxShadow: 6,
  userSelect: 'none',
  overflow: 'hidden',
  position: 'absolute',
  borderRadius: 0,
  transition: 'transform 0.3s',
  width: { xs: '90%', sm: 400 },
  transform: 'translate(-50%, -50%)',

  img: {
    p: '16px 32px',
  },

  button: {
    height: '3rem',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '600',
  },

  a: {
    fontWeight: '500',
    lineHeight: 1.5,
    color: '#FFFFFF',
    transition: 'color 0.3s',
  },

  '@keyframes wawes': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },

  '&::before, &::after': {
    content: '""',
    zIndex: -1,
    width: '600px',
    height: '800px',
    position: 'absolute',
    borderRadius: '40% 45% 35% 40%',
  },

  '&::before': {
    top: '-35%',
    left: '75%',
    animation: 'wawes 6s linear infinite',
    background:
      'linear-gradient(90deg, rgba(26, 26, 26, 0.2) 0%, rgba(42, 42, 42, 0.4) 100%)',
  },

  '&::after': {
    top: '-30%',
    left: '70%',
    animation: 'wawes 8s linear infinite',
    background:
      'linear-gradient(90deg, rgba(74, 74, 74, 0.5) 0%, rgba(154, 154, 154, 0.3) 100%)',
  },

  '& span': {
    fontSize: '0.75rem',
    color: '#9A9A9A',
  },
  '& input': {
    fontSize: '16px',
    borderRadius: 0,
    color: '#FFFFFF',
    '&::placeholder': {
      color: '#9A9A9A',
    },
  },
  '& label.Mui-focused ': {
    pt: 0.2,
    color: '#FFFFFF',
  },
  '& .MuiFormLabel-root': {
    fontSize: '16px',
    color: '#9A9A9A',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#9A9A9A',
    },
    '&:hover fieldset': {
      borderColor: '#FFFFFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFFFFF',
    },
  },
};
