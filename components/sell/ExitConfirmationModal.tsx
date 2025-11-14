// components/ExitConfirmationModal.tsx
import React from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExitConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onDiscard: () => void;
  colors: any;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  visible,
  onClose,
  onDiscard,
  colors,
  slideAnim,
  fadeAnim
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="none"
    onRequestClose={onClose}
  >
    <Animated.View style={[styles.exitModalOverlay, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        style={styles.exitModalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View 
        style={[
          styles.exitModalContent,
          { 
            backgroundColor: colors.card,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.exitModalHeader}>
          <Text style={[styles.exitModalTitle, { color: colors.text }]}>
            Quitter la publication ?
          </Text>
          <Text style={[styles.exitModalMessage, { color: colors.textSecondary }]}>
            Si vous quittez maintenant, vous perdrez les modifications apportées à cette publication.
          </Text>
        </View>
        
        <View style={styles.exitModalButtons}>
          <TouchableOpacity 
            style={[styles.exitModalButton, styles.discardButton]}
            onPress={onDiscard}
          >
            <Text style={[styles.exitModalButtonText, styles.discardButtonText]}>
              Abandonner
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.exitModalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={[styles.exitModalButtonText, styles.cancelButtonText, { color: colors.text }]}>
              Annuler
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  </Modal>
);

const styles = StyleSheet.create({
  exitModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  exitModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  exitModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    // SUPPRIMER marginHorizontal et marginBottom
    width: '100%', // ← OCCUPE 100% DE LA LARGEUR
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  exitModalHeader: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: 'center',
  },
  exitModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  exitModalMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  exitModalButtons: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  exitModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  discardButton: {
    // Style par défaut - pas de background
  },
  cancelButton: {
    borderBottomWidth: 0,
  },
  exitModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  discardButtonText: {
    color: '#FF3B30',
  },
  cancelButtonText: {
    fontWeight: '600',
  },
});