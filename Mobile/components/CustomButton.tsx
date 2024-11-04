import { ButtonProps } from '@/types/types';
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const CustomButton = ({
  onPress,
  title,
  bgVariant = 'primary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  className,
  loading = false,
  ...props
}: ButtonProps & { loading?: boolean }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      tw={`bg-${bgVariant}-500 text-white rounded-full px-4 py-2 ${className}`}
      {...props}
    >
      {IconLeft && !loading && <IconLeft />}
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text tw='text-lg font-bold'>{title}</Text>
      )}
      {IconRight && !loading && <IconRight />}
    </TouchableOpacity>
  );
};

export default CustomButton;