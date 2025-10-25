import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Input, InputProps } from './Input';
import EyeIcon from '../assets/icons/eye';
import EyeClosedIcon from '../assets/icons/eye-closed';

export interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry'> {
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showPassword: controlledShowPassword,
  onTogglePassword,
  ...inputProps
}) => {
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  
  const isControlled = controlledShowPassword !== undefined;
  const showPassword = isControlled ? controlledShowPassword : internalShowPassword;
  
  const handleTogglePassword = () => {
    if (isControlled && onTogglePassword) {
      onTogglePassword();
    } else {
      setInternalShowPassword(!internalShowPassword);
    }
  };

  const renderRightIcon = () => {
    if (inputProps.state === 'error' || inputProps.state === 'success') {
      // If there's an error or success state, don't override the state icon
      return undefined;
    }
    
    return (
      <TouchableOpacity
        onPress={handleTogglePassword}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
      </TouchableOpacity>
    );
  };

  return (
    <Input
      {...inputProps}
      secureTextEntry={!showPassword}
      rightIcon={renderRightIcon()}
    />
  );
};
