import React, { useState, forwardRef, Ref } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  Typography,
} from '@mui/material';
import { colors } from '@/themes/theme';

// Define the props type for the CustomInput component
interface CustomInputProps {
  isIconActive?: boolean;
  label?: string;
  placeholder?: string;
  type?: string;
  id?: string;
  name?: string;
  value?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
}

// eslint-disable-next-line react/display-name
const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      isIconActive = true,
      label = '',
      placeholder = '',
      type = 'text',
      id = '',
      name = '',
      onChange = () => {},

    },
    ref: Ref<HTMLInputElement>,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mb={2}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="100%"
        >
          <Typography color="white" pb={1} textAlign="center">
            {label}
          </Typography>
          <InputBase
            fullWidth
            type={
              type === 'password' ? (showPassword ? 'text' : 'password') : type
            }
            placeholder={placeholder}
            id={id}
            name={name}
            onChange={onChange}
            inputRef={ref}
            sx={{
              bgcolor: colors.input[500],
              color: 'black',
              p: 1,
              paddingX: 2,
              borderRadius: '5px',
            }}
            endAdornment={
              type === 'password' &&
              isIconActive && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </Box>
      </Box>
    );
  },
);

export default CustomInput;
