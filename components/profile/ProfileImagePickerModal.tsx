// components/profile/ProfileImagePickerModal.tsx
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';

interface ProfileImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
}

export const ProfileImagePickerModal: React.FC<ProfileImagePickerModalProps> = ({
  visible,
  onClose,
  onTakePhoto,
  onChooseFromGallery,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Références pour les animations
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const actionTimeoutRef = useRef<number | null>(null); // CORRECTION : number au lieu de NodeJS.Timeout

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  // Nettoyer les timeouts
  useEffect(() => {
    return () => {
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current);
      }
    };
  }, []);

  // Animation pour l'affichage de la modal
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset les animations quand la modal se ferme
      slideAnim.setValue(300);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  // SOLUTION : Fermer d'abord, puis exécuter l'action après un délai
  const handleTakePhoto = () => {
    onClose(); // Fermer IMMÉDIATEMENT la modal
    
    // Attendre que la modal soit complètement fermée avant d'ouvrir la caméra
    actionTimeoutRef.current = setTimeout(() => {
      console.log('🚀 Ouverture caméra après fermeture modal');
      onTakePhoto();
    }, 400) as unknown as number; // CORRECTION : cast en number
  };

  const handleChooseFromGallery = () => {
    onClose(); // Fermer IMMÉDIATEMENT la modal
    
    // Attendre que la modal soit complètement fermée avant d'ouvrir la galerie
    actionTimeoutRef.current = setTimeout(() => {
      console.log('🚀 Ouverture galerie après fermeture modal');
      onChooseFromGallery();
    }, 400) as unknown as number; // CORRECTION : cast en number
  };

  // Fonction pour fermer la modal avec animation
  const closeModal = () => {
    // Annuler tout timeout en cours
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
      actionTimeoutRef.current = null;
    }
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={closeModal}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={closeModal}
        />
        <Animated.View 
          style={[
            styles.modalContent,
            { 
              backgroundColor: colors.card,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('changeProfilePhoto', 'Changer la photo de profil')}
            </Text>
          </View>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionButton, { borderBottomColor: 'rgba(0, 0, 0, 0.08)' }]}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={22} color={colors.tint} />
              <Text style={[styles.optionText, { color: colors.text }]}>
                {t('takePhoto', 'Prendre une photo')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionButton, { borderBottomColor: 'rgba(0, 0, 0, 0.08)' }]}
              onPress={handleChooseFromGallery}
            >
              <Ionicons name="images" size={22} color={colors.tint} />
              <Text style={[styles.optionText, { color: colors.text }]}>
                {t('chooseFromGallery', 'Choisir dans la galerie')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bouton Annuler */}
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={closeModal}
          >
            <Text style={[styles.cancelText, { color: colors.tint }]}>
              {t('cancel', 'Annuler')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});