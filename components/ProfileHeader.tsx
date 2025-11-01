// components/ProfileHeader.tsx
import CustomButton from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ProfileHeaderProps {
  profileImageUrl: string | null;
  imageError: boolean;
  userInitials: string;
  fullName: string;
  statusText: string;
  statusIcon: string;
  statusColor: string;
  location: string;
  isRefetching?: boolean;
  onEditProfile: () => void;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    tint: string;
  };
  editButtonText: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImageUrl,
  imageError,
  userInitials,
  fullName,
  statusText,
  statusIcon,
  statusColor,
  location,
  isRefetching = false,
  onEditProfile,
  colors,
  editButtonText,
}) => {
  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: (profileImageUrl && !imageError) ? 'transparent' : colors.tint }]}>
          {(profileImageUrl && !imageError) ? (
            <Image 
              source={{ uri: profileImageUrl }} 
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>{userInitials}</Text>
          )}
        </View>
        
        {/* Indicateur de synchronisation */}
        {isRefetching && (
          <View style={[styles.syncIndicator, { backgroundColor: colors.tint }]}>
            <Ionicons name="sync" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <Text style={[styles.userName, { color: colors.text }]}>
        {fullName}
      </Text>
      
      <View style={styles.userInfo}>
        <Ionicons 
          name={statusIcon as any} 
          size={14} 
          color={statusColor} 
        />
        <Text style={[styles.userStatus, { color: statusColor }]}>
          {statusText}
        </Text>
      </View>
      
      <Text style={[styles.userLocation, { color: colors.textSecondary }]}>
        {location}
      </Text>

      <CustomButton
        title={editButtonText}
        onPress={onEditProfile}
        variant="primary"
        size="large"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    paddingTop: 60,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  syncIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  userLocation: {
    fontSize: 14,
    marginBottom: 16,
  },
});