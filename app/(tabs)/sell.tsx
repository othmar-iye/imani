// screens/SellScreen.tsx
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Animated,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// Import des composants
import { EmptyPhotoState } from '@/components/sell/EmptyPhotoState';
import { ExitConfirmationModal } from '@/components/sell/ExitConfirmationModal';
import { ImageGridComponent } from '@/components/sell/ImageGridComponent';
import { ImagePickerModal } from '@/components/sell/ImagePickerModal';
import { SellerStatusCard } from '@/components/sell/SellerStatusCard';
import { SellSkeleton } from '@/components/sell/SellSkeleton';

interface SelectedImage {
    uri: string;
    id: string;
}

interface SellerStatus {
    isSeller: boolean;
    status: string;
}

export default function SellScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { t } = useTranslation();

    const [sellerStatus, setSellerStatus] = useState<SellerStatus | null>(null);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [lastKnownStatus, setLastKnownStatus] = useState<string | null>(null);

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
    const [isNavigating, setIsNavigating] = useState(false);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    
    // Animation pour la modal de confirmation
    const slideAnim = useState(new Animated.Value(300))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Fonction pour récupérer le statut vendeur
    const fetchSellerStatus = async (showLoading: boolean = true): Promise<void> => {
        if (!user) {
            setSellerStatus({ isSeller: false, status: 'not_authenticated' });
            setLastKnownStatus('not_authenticated');
            if (showLoading) setIsLoadingStatus(false);
            setIsRefreshing(false);
            return;
        }

        try {
            if (showLoading) {
                setIsLoadingStatus(true);
            } else {
                setIsRefreshing(true);
            }
            setStatusError(null);

            const { data: userProfile, error } = await supabase
                .from('user_profiles')
                .select('verification_status')
                .eq('id', user.id)
                .single();

            // CAS 1: L'utilisateur n'existe PAS dans la table → doit devenir vendeur
            if (error && error.code === 'PGRST116') {
                setSellerStatus({ isSeller: false, status: 'not_seller' });
                setLastKnownStatus('not_seller');
                return;
            }

            // CAS 2: Autre erreur
            if (error) {
                console.error('Erreur base de données:', error);
                setStatusError('Erreur de base de données');
                setSellerStatus({ isSeller: false, status: 'not_seller' });
                setLastKnownStatus('not_seller');
                return;
            }

            // CAS 3: Utilisateur existe dans la table → vérifier le statut
            const isSeller = userProfile?.verification_status === 'verified';
            const status = userProfile?.verification_status || 'not_seller';
            
            setSellerStatus({ isSeller, status });
            setLastKnownStatus(status);

        } catch (error) {
            console.error('Erreur inattendue:', error);
            setStatusError('Erreur inattendue');
            setSellerStatus({ isSeller: false, status: 'not_seller' });
            setLastKnownStatus('not_seller');
        } finally {
            if (showLoading) {
                setIsLoadingStatus(false);
            }
            setIsRefreshing(false);
        }
    };

    // 🔥 SOLUTION AVEC SKELETON : Rechargement silencieux
    useFocusEffect(
        useCallback(() => {
            console.log('SellScreen focused - reloading seller status');
            fetchSellerStatus();
        }, [user])
    );

    // Premier chargement
    useEffect(() => {
        fetchSellerStatus();
    }, [user]);

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

    // Animation pour l'affichage de la modal
    useEffect(() => {
        if (showExitConfirmation) {
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
    }, [showExitConfirmation]);

    // Fonction de retour avec confirmation
    const handleBack = () => {
        if (selectedImages.length > 0) {
            // Afficher la boîte de dialogue de confirmation
            setShowExitConfirmation(true);
        } else {
            // Pas d'images, retour direct
            if (navigation.canGoBack()) {
                router.back();
            } else {
                router.replace('/(tabs)/home');
            }
        }
    };

    // Fonction pour fermer la modal avec animation
    const closeExitModal = () => {
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
            setShowExitConfirmation(false);
        });
    };

    // Fonction pour gérer les actions de la boîte de dialogue
    const handleExitAction = (action: 'discard' | 'cancel') => {
        closeExitModal();
        
        switch (action) {
            case 'discard':
                // Supprimer les photos et quitter
                setSelectedImages([]);
                if (navigation.canGoBack()) {
                    router.back();
                } else {
                    router.replace('/(tabs)/home');
                }
                break;
                
            case 'cancel':
                // Ne rien faire, juste fermer la boîte de dialogue
                break;
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

    // Fonction pour gérer la navigation vers SellDetailsScreen
    const handleContinue = async () => {
        setIsNavigating(true); // Activer le loader
        
        try {
            // Simuler un petit délai pour une meilleure UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Navigation vers l'écran de détails de l'annonce
            router.push({
                pathname: '/screens/SellDetailsScreen',
                params: { images: JSON.stringify(selectedImages) }
            });
        } catch (error) {
            console.error('Erreur navigation:', error);
            Alert.alert(
                t('error', 'Erreur'),
                t('navigationError', 'Erreur lors de la navigation. Veuillez réessayer.')
            );
        } finally {
            // Désactiver le loader après un court délai même en cas d'erreur
            setTimeout(() => setIsNavigating(false), 1000);
        }
    };

    // 🆕 FONCTION AMÉLIORÉE POUR LES MESSAGES DE STATUT
    const getStatusMessage = () => {
        if (!user) {
            return {
                title: t('loginRequired', 'Connexion requise'),
                message: t('loginToSell', 'Veuillez vous connecter pour vendre des articles.'),
                action: t('login', 'Se connecter'),
                onPress: () => router.push('/(auth)/login'),
                iconName: 'person-circle-outline' as const,
            };
        }

        // Basé sur le statut de vérification
        switch(sellerStatus?.status) {
            case 'not_seller':
                return {
                    title: t('becomeSeller', 'Devenir vendeur'),
                    message: t('verificationInfo', 'La vérification de votre identité est nécessaire pour devenir vendeur sur {{appName}}.', { appName: 'Imani' }),
                    action: t('becomeSeller', 'Devenir vendeur'),
                    onPress: () => router.push('/screens/ProfileSettingsScreen'),
                    iconName: 'person-add-outline' as const,
                };
                
            case 'pending_review':
                return {
                    title: t('verificationInProgress', 'Vérification en cours'),
                    message: t('verificationTimeMessage', 'Votre demande de vérification est en cours de traitement. Cela peut prendre 24 à 48 heures. Vous serez notifié dès que votre profil sera vérifié.'),
                    action: '',
                    onPress: () => {},
                    iconName: 'time-outline' as const,
                };
                
            case 'rejected':
                return {
                    title: t('verificationRejected', 'Profil rejeté'),
                    message: t('verificationRejectedMessage', 'Votre demande de vérification a été rejetée. Veuillez vérifier vos documents et soumettre à nouveau votre profil.'),
                    action: t('resubmitProfile', 'Soumettre à nouveau'),
                    onPress: () => router.push('/screens/ProfileSettingsScreen'),
                    iconName: 'close-circle-outline' as const,
                };
                
            case 'verified':
                // Ce cas ne devrait pas arriver ici car l'utilisateur est vendeur
                return {
                    title: '',
                    message: '',
                    action: '',
                    onPress: () => {},
                    iconName: 'checkmark-circle-outline' as const,
                };
                
            default:
                return {
                    title: t('becomeSeller', 'Devenir vendeur'),
                    message: t('verificationInfo', 'La vérification de votre identité est nécessaire pour devenir vendeur sur {{appName}}.', { appName: 'Imani' }),
                    action: t('becomeSeller', 'Devenir vendeur'),
                    onPress: () => router.push('/screens/ProfileSettingsScreen'),
                    iconName: 'alert-circle-outline' as const,
                };
        }
    };

    // 🎯 NOUVELLE LOGIQUE AVEC SKELETON
    const getSkeletonMode = () => {
        if (isLoadingStatus) {
            return 'loading';
        }
        
        // Si on a un statut connu, on affiche le skeleton correspondant
        if (lastKnownStatus === 'verified') {
            return 'seller';
        } else if (lastKnownStatus && lastKnownStatus !== 'verified') {
            return 'non-seller';
        }
        
        return 'loading';
    };

    // État de chargement - MAINTENANT AVEC SKELETON SEULEMENT DANS LE CONTENU
    if (isLoadingStatus) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                
                {/* Header toujours visible */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
                        <Ionicons name="close" size={26} color={colors.tint} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {t('tabs.sell', 'Vendre')}
                    </Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Contenu avec skeleton */}
                <View style={styles.content}>
                    <SellSkeleton colors={colors} mode={getSkeletonMode()} />
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
                    <SellerStatusCard
                        title={t('error', 'Erreur')}
                        message={t('errorLoadingProfile', 'Erreur lors du chargement du profil')}
                        action={t('retry', 'Réessayer')}
                        onPress={() => fetchSellerStatus(true)}
                        iconName="alert-circle-outline"
                        colors={colors}
                    />
                </View>
            </View>
        );
    }

    // 🆕 LOGIQUE AMÉLIORÉE : Afficher l'écran de vente seulement si l'utilisateur est vérifié
    if (sellerStatus?.status !== 'verified') {
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
                    <SellerStatusCard
                        title={statusMessage.title}
                        message={statusMessage.message}
                        action={statusMessage.action}
                        onPress={statusMessage.onPress}
                        iconName={statusMessage.iconName}
                        colors={colors}
                    />
                </View>
            </View>
        );
    }

    // ✅ Utilisateur vendeur vérifié - écran normal de vente
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={handleBack}
                    disabled={isNavigating}
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
                        {t('sell.photos', 'Photos')} ({selectedImages.length}/5)
                    </Text>
                    
                    {selectedImages.length === 0 ? (
                        <EmptyPhotoState 
                            onAddPhoto={openImagePickerDirect}
                            colors={colors}
                            disabled={isNavigating}
                        />
                    ) : (
                        <ImageGridComponent
                            images={selectedImages}
                            onRemoveImage={removeImage}
                            onAddMore={openImagePickerDirect}
                            maxImages={5}
                            colors={colors}
                            disabled={isNavigating}
                        />
                    )}
                </View>

                {selectedImages.length > 0 && (
                    <TouchableOpacity 
                        style={[
                            styles.continueButton, 
                            { 
                                backgroundColor: colors.tint,
                                opacity: isNavigating ? 0.7 : 1
                            }
                        ]}
                        onPress={handleContinue}
                        disabled={isNavigating}
                    >
                        {isNavigating ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <>
                                <Text style={styles.continueButtonText}>
                                    {t('continue', 'Continuer')}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Modals */}
            <ImagePickerModal
                visible={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                onTakePhoto={takePhoto}
                onChooseFromGallery={openGallery}
                colors={colors}
                disabled={isNavigating}
            />

            <ExitConfirmationModal
                visible={showExitConfirmation}
                onClose={closeExitModal}
                onDiscard={() => handleExitAction('discard')}
                colors={colors}
                slideAnim={slideAnim}
                fadeAnim={fadeAnim}
            />
        </View>
    );
}

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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
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
});