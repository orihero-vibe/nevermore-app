import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import CheckIcon from '../assets/icons/check';
import InfoIcon from '../assets/icons/info';

export type InputState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  state?: InputState;
  errorMessage?: string;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  errorStyle?: any;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  state = 'default',
  errorMessage,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  rightIcon,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const getInputContainerStyle = () => {
    const baseStyle = styles.inputContainer;
    
    // Handle focus state first
    if (isFocused && state === 'default') {
      return [baseStyle, styles.inputContainerFocused];
    }
    
    switch (state) {
      case 'error':
        return [baseStyle, styles.inputContainerError];
      case 'success':
        return [baseStyle, styles.inputContainerSuccess];
      default:
        return baseStyle;
    }
  };

  const getInputStyle = () => {
    const baseStyle = styles.input;
    
    switch (state) {
      case 'error':
        return [baseStyle, styles.inputError];
      case 'success':
        return [baseStyle, styles.inputSuccess];
      default:
        return baseStyle;
    }
  };

  const getRightIcon = () => {
    // If a custom rightIcon is provided, use it
    if (rightIcon) {
      return rightIcon;
    }
    
    // Otherwise, show state-based icons
    switch (state) {
      case 'error':
        return (
          <View style={styles.errorIcon}>
            <InfoIcon width={12} height={12} color="#ffffff" />
          </View>
        );
      case 'success':
        return (
          <View style={styles.successIcon}>
            <CheckIcon />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={getInputContainerStyle()}>
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholderTextColor="#666666"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {getRightIcon()}
      </View>
      {state === 'error' && errorMessage && (
        <Text style={[styles.errorMessage, errorStyle]}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Roboto_500Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666666',
  },
  inputContainerFocused: {
    borderColor: '#999999',
  },
  inputContainerError: {
    borderColor: '#ff4444',
  },
  inputContainerSuccess: {
    borderColor: '#00ff88',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
  },
  inputError: {
    color: '#ffffff',
  },
  inputSuccess: {
    color: '#ffffff',
  },
  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff4444',
    borderWidth: 1,
    borderColor: '#ff4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  successIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00ff88',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: '#ff4444',
    marginTop: 8,
    fontFamily: 'Roboto_400Regular',
  },
});
