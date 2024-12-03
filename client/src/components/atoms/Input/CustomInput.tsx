import React, { useState, forwardRef, Ref, useMemo } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  Typography,
} from '@mui/material';
import { colors } from '@/themes/theme';
import CustomTextInput from './CustomTextInput';

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
  autoComplete?: boolean;
  helperText?: string | React.ReactNode;

}

// eslint-disable-next-line react/display-name
const CustomInput = React.memo(React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      isIconActive = true,
      label = '',
      placeholder = '',
      type = 'text',
      id = '',
      name = '',
      autoComplete = false,
      onChange = () => { },
      onBlur = () => { },
      value = '',
    },
    ref: Ref<HTMLInputElement>,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const memoizedInput = useMemo(() => (
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
        onBlur={onBlur}
        autoComplete={autoComplete ? 'on' : 'off'}
        inputProps={{
          autoComplete: { autoComplete: 'off' },
        }}
        value={value}
        sx={{
          bgcolor: colors.green[800],
          color: 'white',
          p: 1,
          paddingX: 1,
          borderRadius: '5px',
          border: '1px solid',
          borderColor: colors.green[700],
          height: '30px',
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
    ), [
      type,
      showPassword,
      isIconActive,
      placeholder,
      id,
      name,
      onChange,
      ref,
      onBlur,
      autoComplete,
      value,
    ]);

    const memoizedOuterBox = useMemo(() => (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mb={0.5}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="100%"
        >
          <Typography color="white" pb={0.3} textAlign="center">
            {label}
          </Typography>
          {memoizedInput}
        </Box>
      </Box>
    ), [label, memoizedInput]);

    return memoizedOuterBox;
  },
));



export default CustomInput;
