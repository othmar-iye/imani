// screens/SellScreen.tsx
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

interface SelectedImage {
    uri: string;
    id: string;
}

// Fonction pour récupérer le statut vendeur
const fetchSellerStatus = async (user: any): Promise<{ isSeller: boolean; status: string }> => {
    if (!user) {
        return { isSeller: false, status: 'not_authenticated' };
    }

    try {
        const { data: userProfile, error } = await supabase
            .from('user_profiles')
            .select('verification_status')
            .eq('id', user.id)
            .single();

        // CAS 1: L'utilisateur n'existe PAS dans la table → doit devenir vendeur
        if (error && error.code === 'PGRST116') {
            return { isSeller: false, status: 'not_seller' };
        }

        // CAS 2: Autre erreur
        if (error) {
            console.error('Erreur base de données:', error);
            return { isSeller: false, status: 'not_seller' };
        }

        // CAS 3: Utilisateur existe dans la table → vérifier le statut
        const isSeller = userProfile?.verification_status === 'verified';
        
        return { 
            isSeller, 
            status: userProfile?.verification_status || 'pending' 
        };

    } catch (error) {
        console.error('Erreur inattendue:', error);
        return { isSeller: false, status: 'not_seller' };
    }
};

export default function SellScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { t } = useTranslation();

    // Query pour récupérer le statut vendeur
    const { 
        data: sellerStatus, 
        isLoading: isLoadingStatus,
        error: statusError,
        refetch 
    } = useQuery({
        queryKey: ['seller-status', user?.id],
        queryFn: () => fetchSellerStatus(user),
        enabled: !!user,
    });

    const colors = {
        background: isDark ? Theme.dark.background : Theme.light.background,
        card: isDark ? Theme.dark.card : Theme.light.card,
        text: isDark ? Theme.dark.text : Theme.light.text,
        textSecondary: isDark ? '#8E8E93' : '#666666',
        border: isDark ? Theme.dark.border : Theme.light.border,
        tint: isDark ? Theme.dark.tint : Theme.light.tint,
        error: isDark ? '#FF453A' : '#FF3B30',
        disabled: isDark ? '#3A3A3C' : '#E5E5EA',
    };

    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [showImagePicker, setShowImagePicker] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        });

        return () => {
            navigation.setOptions({
                tabBarStyle: { display: 'flex' }
            });
        };
    }, [navigation]);

    // Fonction de retour améliorée
    const handleBack = () => {
        if (navigation.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/home');
        }
    };

    const pickImages = async () => {
        // Vérifier si l'utilisateur est vendeur
        if (!sellerStatus?.isSeller) {
            Alert.alert(
                t('verificationRequired', 'Vérification requise'),
                t('verificationInfo', 'La vérification de votre identité est nécessaire pour devenir vendeur sur {{appName}}.', { appName: 'Imani' }),
                [
                    { text: t('cancel', 'Annuler'), style: 'cancel' },
                    { 
                        text: t('becomeSeller', 'Devenir vendeur'), 
                        onPress: () => router.push('/screens/ProfileSettingsScreen')
                    }
                ]
            );
            return;
        }

        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    t('permissionRequired', 'Permission requise'), 
                    t('galleryPermissionMessage', 'Nous avons besoin de votre permission pour accéder à vos photos.')
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: true,
                quality: 1,
                selectionLimit: 5 - selectedImages.length,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImages = result.assets.map((asset, index) => ({
                    uri: asset.uri,
                    id: `${Date.now()}-${index}`
                }));
                
                setSelectedImages(prev => [...prev, ...newImages]);
            }
        } catch (error) {
            console.error('Erreur lors de la sélection des photos:', error);
            Alert.alert(
                t('error', 'Erreur'), 
                t('galleryError', 'Impossible d\'accéder à la galerie photos.')
            );
        }
    };

    const removeImage = (imageId: string) => {
        setSelectedImages(prev => prev.filter(img => img.id !== imageId));
    };

    const takePhoto = async () => {
        // Vérifier si l'utilisateur est vendeur
        if (!sellerStatus?.isSeller) {
            Alert.alert(
                t('verificationRequired', 'Vérification requise'),
                t('verificationInfo', 'La vérification de votre identité est nécessaire pour devenir vendeur sur {{appName}}.', { appName: 'Imani' }),
                [
                    { text: t('cancel', 'Annuler'), style: 'cancel' },
                    { 
                        text: t('becomeSeller', 'Devenir vendeur'), 
                        onPress: () => router.push('/screens/ProfileSettingsScreen')
                    }
                ]
            );
            return;
        }

        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    t('permissionRequired', 'Permission requise'),
                    t('cameraPermissionMessage', 'Nous avons besoin de votre permission pour utiliser la caméra.')
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const newImage = {
                    uri: result.assets[0].uri,
                    id: `camera-${Date.now()}`
                };
                
                setSelectedImages(prev => [...prev, newImage]);
            }
        } catch (error) {
            console.error('Erreur avec la caméra:', error);
            Alert.alert(
                t('error', 'Erreur'),
                t('cameraError', 'Impossible d\'accéder à la caméra.')
            );
        } finally {
            setShowImagePicker(false);
        }
    };

    const openGallery = async () => {
        setShowImagePicker(false);
        
        setTimeout(async () => {
            await pickImages();
        }, 500);
    };

    const openImagePickerDirect = async () => {
        await pickImages();
    };

    // Fonction pour obtenir le message selon le statut
    const getStatusMessage = () => {
        if (!user) {
            return {
                title: t('loginRequired', 'Connexion requise'),
                message: t('loginToSell', 'Veuillez vous connecter pour vendre des articles.'),
                action: t('login', 'Se connecter'),
                onPress: () => router.push('/(auth)/login')
            };
        }

        // Si statut est 'not_seller' → l'utilisateur n'existe pas dans la table
        if (sellerStatus?.status === 'not_seller') {
            return {
                title: t('becomeSeller', 'Devenir vendeur'),
                message: t('verificationInfo', 'La vérification de votre identité est nécessaire pour devenir vendeur sur {{appName}}.', { appName: 'Imani' }),
                action: t('becomeSeller', 'Devenir vendeur'),
                onPress: () => router.push('/screens/ProfileSettingsScreen')
            };
        }

        // Si l'utilisateur existe dans la table, vérifier son statut
        switch(sellerStatus?.status) {
            case 'pending_review':
                return {
                    title: t('verificationInProgress', 'Vérification en cours'),
                    message: t('verificationTimeMessage', 'Votre demande de vérification est en cours de traitement. Cela peut prendre 24 à 48 heures. Vous serez notifié dès que votre profil sera vérifié.'),
                    action: t('checkStatus', 'Vérifier le statut'),
                    onPress: () => router.push('/screens/ProfileSettingsScreen')
                };
            case 'rejected':
                return {
                    title: t('verificationRejected', 'Profil rejeté'),
                    message: t('verificationRejectedMessage', 'Votre demande de vérification a été rejetée. Veuillez vérifier vos documents et soumettre à nouveau votre profil.'),
                    action: t('resubmitProfile', 'Soumettre à nouveau'),
                    onPress: () => router.push('/screens/ProfileSettingsScreen')
                };
            default:
                return {
                    title: t('becomeSeller', 'Devenir vendeur'),
                    message: t('verificationInfo', 'La vérification de votre identité est nécessaire pour devenir vendeur sur {{appName}}.', { appName: 'Imani' }),
                    action: t('becomeSeller', 'Devenir vendeur'),
                    onPress: () => router.push('/screens/ProfileSettingsScreen')
                };
        }
    };

    const renderImageItem = ({ item, index }: { item: SelectedImage; index: number }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.selectedImage} />
            <TouchableOpacity 
                style={[styles.removeButton, { backgroundColor: colors.tint }]}
                onPress={() => removeImage(item.id)}
            >
                <Ionicons name="close" size={16} color="#FFF" />
            </TouchableOpacity>
            <View style={[styles.imageNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.imageNumberText}>{index + 1}</Text>
            </View>
        </View>
    );

    // État de chargement
    if (isLoadingStatus) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
                        <Ionicons name="close" size={26} color={colors.tint} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {t('tabs.sell', 'Vendre')}
                    </Text>
                    <View style={styles.headerRight} />
                </View>

                <View style={styles.content}>
                    <View style={[styles.photoSection, { backgroundColor: colors.card }]}>
                        <View style={[styles.addPhotoButton, { borderColor: colors.border }]}>
                            <Ionicons name="camera" size={48} color={colors.textSecondary} />
                            <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>
                                {t('loading', 'Chargement...')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    // État d'erreur
    if (statusError) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
                        <Ionicons name="close" size={26} color={colors.tint} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {t('tabs.sell', 'Vendre')}
                    </Text>
                    <View style={styles.headerRight} />
                </View>

                <View style={styles.content}>
                    <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
                        <Text style={[styles.statusTitle, { color: colors.text }]}>
                            {t('error', 'Erreur')}
                        </Text>
                        <Text style={[styles.statusMessage, { color: colors.textSecondary }]}>
                            {t('errorLoadingProfile', 'Erreur lors du chargement du profil')}
                        </Text>
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: colors.tint }]}
                            onPress={() => refetch()}
                        >
                            <Text style={styles.actionButtonText}>
                                {t('retry', 'Réessayer')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // Utilisateur non vendeur
    if (!sellerStatus?.isSeller) {
        const statusMessage = getStatusMessage();
        
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
                        <Ionicons name="close" size={26} color={colors.tint} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {t('tabs.sell', 'Vendre')}
                    </Text>
                    <View style={styles.headerRight} />
                </View>

                <View style={styles.content}>
                    <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
                        <Ionicons 
                            name={
                                sellerStatus?.status === 'not_seller' ? 'person-add-outline' :
                                sellerStatus?.status === 'pending_review' ? 'time-outline' :
                                sellerStatus?.status === 'rejected' ? 'close-circle-outline' :
                                'alert-circle-outline'
                            } 
                            size={48} 
                            color={colors.textSecondary} 
                        />
                        <Text style={[styles.statusTitle, { color: colors.text }]}>
                            {statusMessage.title}
                        </Text>
                        <Text style={[styles.statusMessage, { color: colors.textSecondary }]}>
                            {statusMessage.message}
                        </Text>
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: colors.tint }]}
                            onPress={statusMessage.onPress}
                        >
                            <Text style={styles.actionButtonText}>{statusMessage.action}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // Utilisateur vendeur vérifié - écran normal de vente
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={handleBack}
                >
                    <Ionicons name="close" size={26} color={colors.tint} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {t('tabs.sell', 'Vendre')}
                </Text>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.content}>
                <View style={[styles.photoSection, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('photos', 'Photos')} ({selectedImages.length}/5)
                    </Text>
                    
                    {selectedImages.length === 0 ? (
                        <TouchableOpacity 
                            style={[styles.addPhotoButton, { borderColor: colors.border }]}
                            onPress={openImagePickerDirect}
                        >
                            <Ionicons name="camera" size={48} color={colors.textSecondary} />
                            <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>
                                {t('addPhoto', 'Ajouter une photo')}
                            </Text>
                            <Text style={[styles.addPhotoSubtext, { color: colors.textSecondary }]}>
                                {t('maxPhotos', 'Maximum 5 photos')}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.imagesGrid}>
                            <FlatList
                                data={selectedImages}
                                renderItem={renderImageItem}
                                keyExtractor={item => item.id}
                                numColumns={3}
                                scrollEnabled={false}
                                contentContainerStyle={styles.imagesGridContent}
                                columnWrapperStyle={styles.imagesRow}
                            />
                            
                            {selectedImages.length < 5 && (
                                <TouchableOpacity 
                                    style={[styles.addMoreButton, { borderColor: colors.border }]}
                                    onPress={openImagePickerDirect}
                                >
                                    <Ionicons name="add" size={24} color={colors.textSecondary} />
                                    <Text style={[styles.addMoreText, { color: colors.textSecondary }]}>
                                        {t('add', 'Ajouter')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>

                {selectedImages.length > 0 && (
                    <TouchableOpacity 
                        style={[styles.continueButton, { backgroundColor: colors.tint }]}
                        onPress={() => {
                            console.log('Continuer avec les photos:', selectedImages);
                            // Navigation vers l'écran de détails de l'annonce
                            // router.push('/screens/PostDetailsScreen', { images: selectedImages });
                        }}
                    >
                        <Text style={styles.continueButtonText}>
                            {t('continue', 'Continuer')}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Modal pour choisir entre caméra et galerie */}
            <Modal
                visible={showImagePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowImagePicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {t('addPhoto', 'Ajouter une photo')}
                        </Text>
                        
                        <TouchableOpacity 
                            style={[styles.modalOption, { borderBottomColor: colors.border }]}
                            onPress={takePhoto}
                        >
                            <Ionicons name="camera" size={24} color={colors.tint} />
                            <Text style={[styles.modalOptionText, { color: colors.text }]}>
                                {t('takePhoto', 'Prendre une photo')}
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.modalOption, { borderBottomColor: colors.border }]}
                            onPress={openGallery}
                        >
                            <Ionicons name="images" size={24} color={colors.tint} />
                            <Text style={[styles.modalOptionText, { color: colors.text }]}>
                                {t('chooseFromGallery', 'Choisir depuis la galerie')}
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.modalCancel}
                            onPress={() => setShowImagePicker(false)}
                        >
                            <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>
                                {t('cancel', 'Annuler')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Les styles restent identiques...
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 60,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    photoSection: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        elevation: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    addPhotoButton: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 4,
    },
    addPhotoSubtext: {
        fontSize: 14,
    },
    imagesGrid: {
        marginTop: 8,
    },
    imagesGridContent: {
        paddingBottom: 16,
    },
    imagesRow: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    imageContainer: {
        position: 'relative',
        width: '32%',
        aspectRatio: 1,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        elevation: 8,
    },
    imageNumber: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageNumberText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    addMoreButton: {
        width: '32%',
        aspectRatio: 1,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addMoreText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        gap: 12,
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    modalCancel: {
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    modalCancelText: {
        fontSize: 16,
        fontWeight: '600',
    },
    statusCard: {
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    statusMessage: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    actionButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});