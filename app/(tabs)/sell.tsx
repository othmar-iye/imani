// screens/SellScreen.tsx (version corrigée)
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function SellScreen() {

    const navigation = useNavigation();

    useEffect(() => {
        // Cacher les tabs quand l'écran est focus
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        });

        // Remettre les tabs quand l'écran est quitté
        return () => {
            navigation.setOptions({
                tabBarStyle: { display: 'flex' } // Ou tes styles par défaut
            });
        };
    }, [navigation]);
    
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const colors = {
        background: isDark ? Theme.dark.background : Theme.light.background,
        card: isDark ? Theme.dark.card : Theme.light.card,
        text: isDark ? Theme.dark.text : Theme.light.text,
        textSecondary: isDark ? '#8E8E93' : '#666666',
        border: isDark ? Theme.dark.border : Theme.light.border,
        tint: isDark ? Theme.dark.tint : Theme.light.tint,
    };

    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [showImagePicker, setShowImagePicker] = useState(false);

    const pickImages = async () => {
        try {
            // Demander la permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à vos photos.');
                return;
            }

            console.log('Ouverture de la galerie...');
            
            // Ouvrir le sélecteur d'images
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: true,
                quality: 1,
                selectionLimit: 5 - selectedImages.length,
            });

            console.log('Résultat galerie:', result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImages = result.assets.map((asset, index) => ({
                    uri: asset.uri,
                    id: `${Date.now()}-${index}`
                }));
                
                setSelectedImages(prev => [...prev, ...newImages]);
                console.log('Photos ajoutées:', newImages.length);
            } else if (result.canceled) {
                console.log('Sélection annulée par l\'utilisateur');
            } else {
                console.log('Aucune photo sélectionnée');
            }
        } catch (error) {
            console.error('Erreur lors de la sélection des photos:', error);
            Alert.alert('Erreur', 'Impossible d\'accéder à la galerie photos.');
        }
    };

    const removeImage = (imageId: string) => {
        setSelectedImages(prev => prev.filter(img => img.id !== imageId));
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour utiliser la caméra.');
                return;
            }

            console.log('Ouverture de la caméra...');
            
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                quality: 1,
            });

            console.log('Résultat caméra:', result);

            if (!result.canceled && result.assets && result.assets[0]) {
                const newImage = {
                    uri: result.assets[0].uri,
                    id: `camera-${Date.now()}`
                };
                
                setSelectedImages(prev => [...prev, newImage]);
                console.log('Photo prise ajoutée');
            }
        } catch (error) {
            console.error('Erreur avec la caméra:', error);
            Alert.alert('Erreur', 'Impossible d\'accéder à la caméra.');
        } finally {
            setShowImagePicker(false);
        }
    };

    const openGallery = async () => {
        console.log('Ouverture galerie depuis modal...');
        setShowImagePicker(false);
        
        // Petit délai pour laisser le modal se fermer complètement
        setTimeout(async () => {
            await pickImages();
        }, 500);
    };

    const openImagePickerDirect = async () => {
        await pickImages();
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

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            
            {/* Header avec croix */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="close" size={26} color={colors.tint} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Nouvelle vente
                </Text>
                <View style={styles.headerRight} />
            </View>

            {/* Contenu principal */}
            <View style={styles.content}>
                {/* Section de sélection des photos */}
                <View style={[styles.photoSection, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Photos ({selectedImages.length}/5)
                    </Text>
                    
                    {selectedImages.length === 0 ? (
                        <TouchableOpacity 
                            style={[styles.addPhotoButton, { borderColor: colors.border }]}
                            onPress={openImagePickerDirect} // ← Appel direct
                        >
                            <Ionicons name="camera" size={48} color={colors.textSecondary} />
                            <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>
                                Ajouter des photos
                            </Text>
                            <Text style={[styles.addPhotoSubtext, { color: colors.textSecondary }]}>
                                Maximum 5 photos
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
                                    onPress={openImagePickerDirect} // ← Appel direct
                                >
                                    <Ionicons name="add" size={24} color={colors.textSecondary} />
                                    <Text style={[styles.addMoreText, { color: colors.textSecondary }]}>
                                        Ajouter
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
                        }}
                    >
                        <Text style={styles.continueButtonText}>Continuer</Text>
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
                            Ajouter une photo
                        </Text>
                        
                        <TouchableOpacity 
                            style={[styles.modalOption, { borderBottomColor: colors.border }]}
                            onPress={takePhoto}
                        >
                            <Ionicons name="camera" size={24} color={colors.tint} />
                            <Text style={[styles.modalOptionText, { color: colors.text }]}>
                                Prendre une photo
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.modalOption, { borderBottomColor: colors.border }]}
                            onPress={openGallery}
                        >
                            <Ionicons name="images" size={24} color={colors.tint} />
                            <Text style={[styles.modalOptionText, { color: colors.text }]}>
                                Choisir depuis la galerie
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.modalCancel}
                            onPress={() => setShowImagePicker(false)}
                        >
                            <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>
                                Annuler
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
        elevation: 8, // Garde elevation pour Android
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
        elevation: 8, // Garde elevation pour Android
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
});