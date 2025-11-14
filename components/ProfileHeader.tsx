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
  email: string; // Nouvelle prop pour l'email
  statusText: string;
  statusIcon: string;
  statusColor: string;
  location: string;
  isRefetching?: boolean;
  onEditProfile: () => void;
  onBecomeSeller: () => void; // Nouvelle prop pour le bouton "Devenir vendeur"
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    tint: string;
    background: string;
  };
  editButtonText: string;
  becomeSellerText: string; // Nouvelle prop pour le texte du bouton
  showBecomeSellerButton?: boolean; // Pour conditionner l'affichage du bouton
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