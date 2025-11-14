// components/ProfileHeader.tsx
import CustomButton from '@/components/CustomButton';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
  profileImageUrl: string | null;
  imageError: boolean;
  userInitials: string;
  fullName: string;
  email: string;
  statusText: string;
  statusIcon: string;
  statusColor: string;
  location: string;
  isRefetching?: boolean;
  onEditProfile: () => void;
  onBecomeSeller: () => void;
  onEditPhoto: () => void; // NOUVELLE PROP pour ouvrir la modal photo
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    tint: string;
    background: string;
  };
  editButtonText: string;
  becomeSellerText: string;
  showBecomeSellerButton?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImageUrl,
  imageError,
  userInitials,
  fullName,
  email,
  statusText,
  statusIcon,
  statusColor,
  location,
  isRefetching = false,
  onEditProfile,
  onBecomeSeller,
  onEditPhoto, // NOUVELLE PROP
  colors,
  editButtonText,
  becomeSellerText,
  showBecomeSellerButton = true,
}) => {
  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      {/* Section principale avec avatar à gauche et infos à droite */}
      <View style={styles.profileMainSection}>
        {/* Avatar à gauche */}
        <View style={styles.avatarSection}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={onEditPhoto} // Ouvre la modal photo au clic
            activeOpacity={0.7}
          >
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
            
            {/* Icône d'édition en bas à droite */}
            <View style={[styles.editIconContainer, { backgroundColor: colors.tint }]}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          {/* Indicateur de synchronisation */}
          {isRefetching && (
            <View style={[styles.syncIndicator, { backgroundColor: colors.tint }]}>
              <Ionicons name="sync" size={12} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Infos utilisateur à droite */}
        <View style={styles.userInfoSection}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {fullName}
          </Text>
          
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {email}
          </Text>
          
          <View style={styles.statusLocationSection}>
            <View style={styles.statusContainer}>
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
          </View>
        </View>
      </View>

      {/* Section des boutons en bas */}
      <View style={styles.buttonsSection}>
        <CustomButton
          title={editButtonText}
          onPress={onEditProfile}
          variant="outline"
          size="medium"
          style={styles.editButton}
        />
        
        {showBecomeSellerButton && (
          <CustomButton
            title={becomeSellerText}
            onPress={onBecomeSeller}
            variant="primary"
            size="medium"
            style={styles.becomeSellerButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  profileMainSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // NOUVEAU STYLE : Icône d'édition
  editIconContainer: {
  position: 'absolute',
  bottom: 6,
  right: 6,
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Theme.light.tint,
  borderWidth: 3,
  borderColor: Theme.light.card,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
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
  userInfoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 12,
  },
  statusLocationSection: {
    gap: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatus: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  userLocation: {
    fontSize: 13,
    fontWeight: '400',
  },
  buttonsSection: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
  },
  becomeSellerButton: {
    flex: 1,
  },
});