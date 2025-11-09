// screens/SellDetailsScreen.tsx
import CustomButton from '@/components/CustomButton';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { categories, Category } from '@/src/data/categories';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import des nouveaux composants
import { CategorySelectorModal } from '@/components/CategorySelectorModal';
import { FormInputGroup } from '@/components/FormInputGroup';
import { ImageGalleryPreview } from '@/components/ImageGalleryPreview';
import { PriceInput } from '@/components/PriceInput';
import { ProductFormSection } from '@/components/ProductFormSection';
import { SelectField } from '@/components/SelectField';
import { ValidationInfoCard } from '@/components/ValidationInfoCard';

import { NotificationService } from '@/src/services/notificationService';

interface SelectedImage {
  uri: string;
  id: string;
}

interface ProductFormData {
  name: string;
  category: string;
  subCategory: string;
  price: string;
  description: string;
  condition: string;
  location: string;
}

// Conditions avec les 4 valeurs
const CONDITIONS = [
  { id: 'new', label: 'Neuf', value: 'new' },
  { id: 'like-new', label: 'Comme neuf', value: 'like-new' },
  { id: 'good', label: 'Bon état', value: 'good' },
  { id: 'fair', label: 'État correct', value: 'fair' }
];

const LOCATIONS = [
    'Lubumbashi', 'Likasi', 'Kipushi', 'Kambove', 'Kakanda', 'Kinshasa',
    'Kasumbalesa', 'Mutoshi', 'Panda', 'Ruwe', 'Shinkolobwe', 'Goma',
    'Sakania', 'Ankoro', 'Bukama', 'Kamina', 'Malemba Nkulu', 'Matadi',
    'Nyunzu', 'Kabondo Dianda', 'Kazembe', 'Moba', 'Mwana Muyombo', 'Pweto'
  ];

// Fonction de compression d'image
const compressImage = async (
  imageUri: string, 
  quality: number = 0.7,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<string> => {
  try {
    const result = await manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        },
      ],
      {
        compress: quality,
        format: SaveFormat.JPEG,
        base64: false,
      }
    );
    
    return result.uri;
  } catch (error) {
    return imageUri;
  }
};

// FONCTION POUR CRÉER LA MINIATURE AVEC RATIO RESPECTÉ
const createThumbnail = async (
  imageUri: string, 
  quality: number = 0.6,
  maxWidth: number = 300,
  maxHeight: number = 300
): Promise<string> => {
  try {
    // D'abord, on récupère les dimensions originales
    const getImageSize = (uri: string): Promise<{width: number, height: number}> => {
      return new Promise((resolve, reject) => {
        Image.getSize(uri, (width, height) => {
          resolve({width, height});
        }, reject);
      });
    };

    const originalSize = await getImageSize(imageUri);
    
    // Calculer les nouvelles dimensions en conservant le ratio
    let newWidth = originalSize.width;
    let newHeight = originalSize.height;

    if (originalSize.width > maxWidth || originalSize.height > maxHeight) {
      const ratio = Math.min(maxWidth / originalSize.width, maxHeight / originalSize.height);
      newWidth = originalSize.width * ratio;
      newHeight = originalSize.height * ratio;
    }

    const result = await manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: newWidth,
            height: newHeight,
          },
        },
      ],
      {
        compress: quality,
        format: SaveFormat.JPEG,
        base64: false,
      }
    );
    
    return result.uri;
  } catch (error) {
    return imageUri;
  }
};

// FONCTION POUR UPLOADER UNE IMAGE VERS SUPABASE
const uploadImageToSupabase = async (
  imageUri: string, 
  fileName: string
): Promise<string> => {
  try {
    const response = await fetch(imageUri);
    
    if (!response.ok) {
      throw new Error('Erreur fetch image');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    if (uint8Array.length === 0) {
      throw new Error('Données image sont vides');
    }

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, uint8Array, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    if (urlData?.publicUrl) {
      return urlData.publicUrl;
    } else {
      throw new Error('Impossible d\'obtenir l\'URL publique');
    }
  } catch (error) {
    throw error;
  }
};

export default function SellDetailsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  
  // Récupérer les images depuis les paramètres de navigation
  const images = JSON.parse(params.images as string) as SelectedImage[];

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

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    subCategory: '',
    price: '',
    description: '',
    condition: '',
    location: '',
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedCategory = categories.find(cat => cat.name === formData.category);
  const subCategories = selectedCategory?.subCategories || [];

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategorySelect = (category: Category) => {
    handleInputChange('category', category.name);
    setShowCategoryModal(false);
    setShowSubCategoryModal(true);
  };

  const handleSubCategorySelect = (subCategory: string) => {
    handleInputChange('subCategory', subCategory);
    setShowSubCategoryModal(false);
  };

  const handleConditionSelect = (condition: { id: string; label: string; value: string }) => {
    handleInputChange('condition', condition.value);
    setShowConditionModal(false);
  };

  const handleLocationSelect = (location: string) => {
    handleInputChange('location', location);
    setShowLocationModal(false);
  };

  const uploadImages = async (productId: string): Promise<{imageUrls: string[], thumbnailUrl: string}> => {
    const uploadedUrls: string[] = [];
    let thumbnailUrl = '';
    
    try {
      // ÉTAPE 1: Créer et uploader la miniature (première image)
      if (images.length > 0 && images[0].uri) {
        const thumbnailUri = await createThumbnail(images[0].uri);
        const thumbnailFileName = `${user?.id}/${productId}/thumbnail-${Date.now()}.jpg`;
        thumbnailUrl = await uploadImageToSupabase(thumbnailUri, thumbnailFileName);
      }

      // ÉTAPE 2: Uploader toutes les images normales
      for (const [index, image] of images.entries()) {
        if (!image.uri) {
          throw new Error(`Image ${index + 1} n'a pas d'URI valide`);
        }

        const compressedImageUri = await compressImage(image.uri);
        const fileName = `${user?.id}/${productId}/${Date.now()}-${index}.jpg`;
        const imageUrl = await uploadImageToSupabase(compressedImageUri, fileName);
        uploadedUrls.push(imageUrl);
      }
    } catch (error) {
      throw new Error('Erreur lors de l\'upload des images');
    }
    
    return { imageUrls: uploadedUrls, thumbnailUrl };
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.category || !formData.subCategory || 
        !formData.price || !formData.description || !formData.condition || !formData.location) {
      Alert.alert(
        t('sell.missingFields', 'Champs manquants'),
        t('sell.fillAllFields', 'Veuillez remplir tous les champs obligatoires.')
      );
      return;
    }

    if (!user) {
      Alert.alert(
        t('common.error', 'Erreur'),
        t('sell.userNotConnected', 'Utilisateur non connecté.')
      );
      return;
    }

    if (images.length === 0) {
      Alert.alert(
        t('common.error', 'Erreur'),
        t('sell.noImages', 'Veuillez sélectionner au moins une image.')
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        sub_category: formData.subCategory,
        price: parseFloat(formData.price),
        price_discount: null,
        discount: null,
        description: formData.description.trim(),
        condition: formData.condition,
        location: formData.location,
        seller_id: user.id,
        views: 0,
        product_state: 'pending',
        created_at: new Date().toISOString(),
      };

      await proceedWithInsertion(productData);

    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const proceedWithInsertion = async (productData: any) => {
    try {
      const tempProductId = `product-${Date.now()}`;
      
      const { imageUrls, thumbnailUrl } = await uploadImages(tempProductId);
      
      if (imageUrls.length === 0) {
        throw new Error('Aucune image uploadée');
      }

      const productDataWithImages = {
        ...productData,
        images: imageUrls,
        thumbnail: thumbnailUrl
      };

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([productDataWithImages])
        .select()
        .single();

      if (productError) {
        throw productError;
      }

        // ✅ AJOUT : Créer la notification de SOUMISSION (pas d'approbation)
        if (product && user) {
            try {
                await NotificationService.productSubmitted(user.id, productData.name);
                console.log('✅ Notification de soumission créée');
            } catch (notificationError) {
                console.log('⚠️ Notification non créée, mais produit soumis:', notificationError);
                // On continue même si la notification échoue
            }
        }

      // ✅ REDIRECTION RAPIDE SANS ALERTE BLOQUANTE
      setIsSubmitting(false);
      
      // Navigation immédiate
      router.push('/(tabs)/home');
      
      // Alert non-bloquant après la navigation
      setTimeout(() => {
        Alert.alert(
          t('sell.publicationSuccess', 'Annonce soumise !'),
          t('sell.pendingAdminValidation', 'Votre annonce a été soumise avec succès. Elle sera visible après validation par notre équipe.')
        );
      }, 500);

    } catch (error: any) {
      setIsSubmitting(false);
      
      let errorMessage = t('sell.publicationError', 'Impossible de soumettre l\'annonce. Veuillez réessayer.');
      
      if (error.message?.includes('upload') || error.message?.includes('image')) {
        errorMessage = t('sell.uploadError', 'Erreur lors de l\'upload des images. Vérifiez votre connexion internet.');
      } else if (error.message?.includes('storage')) {
        errorMessage = 'Erreur de stockage. Vérifiez les permissions du bucket.';
      } else if (error.message?.includes('Aucune image')) {
        errorMessage = t('sell.noImagesUploaded', 'Aucune image n\'a pu être uploadée.');
      }
      
      Alert.alert(t('common.error', 'Erreur'), errorMessage);
    }
  };

  const isFormValid = formData.name.trim() && formData.category && formData.subCategory && 
                     formData.price && formData.description.trim() && formData.condition && formData.location;

  const getConditionLabel = (conditionValue: string) => {
    const condition = CONDITIONS.find(c => c.value === conditionValue);
    return condition ? condition.label : '';
  };

  const goToNextImage = () => {
    setSelectedImageIndex(prev => (prev + 1) % images.length);
  };

  const goToPrevImage = () => {
    setSelectedImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const renderSubCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.modalItem, { borderBottomColor: colors.border }]}
      onPress={() => handleSubCategorySelect(item)}
    >
      <Text style={[styles.modalItemText, { color: colors.text }]}>{item}</Text>
    </TouchableOpacity>
  );

  const renderConditionItem = ({ item }: { item: { id: string; label: string; value: string } }) => (
    <TouchableOpacity
      style={[styles.modalItem, { borderBottomColor: colors.border }]}
      onPress={() => handleConditionSelect(item)}
    >
      <Text style={[styles.modalItemText, { color: colors.text }]}>{item.label}</Text>
      {formData.condition === item.value && (
        <Ionicons name="checkmark" size={20} color={colors.tint} />
      )}
    </TouchableOpacity>
  );

  const renderLocationItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.modalItem, { borderBottomColor: colors.border }]}
      onPress={() => handleLocationSelect(item)}
    >
      <Text style={[styles.modalItemText, { color: colors.text }]}>{item}</Text>
      {formData.location === item && (
        <Ionicons name="checkmark" size={20} color={colors.tint} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={colors.tint} 
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('sell.detailsTitle', 'Détails de l\'annonce')}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Section Prévisualisation des Images */}
            <ImageGalleryPreview
              images={images}
              selectedImageIndex={selectedImageIndex}
              onSelectImage={selectImage}
              onNextImage={goToNextImage}
              onPrevImage={goToPrevImage}
              colors={colors}
            />

            {/* Section Informations de base */}
            <ProductFormSection title={t('sell.basicInfo', 'Informations de base')} colors={colors}>
              {/* Nom du produit */}
              <FormInputGroup
                label={t('sell.productName', 'Nom du produit')}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder={t('sell.productNamePlaceholder', 'Ex: Montre Rolex Submariner')}
                required={true}
                maxLength={100}
                colors={colors}
              />

              {/* Catégorie et Sous-catégorie */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {t('sell.category', 'Catégorie')}
                    </Text>
                    <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                  </View>
                  <SelectField
                    label="Catégorie"
                    value={formData.category}
                    placeholder={t('sell.chooseCategory', 'Choisir une catégorie')}
                    onPress={() => setShowCategoryModal(true)}
                    required={true}
                    colors={colors}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {t('sell.subCategory', 'Sous-catégorie')}
                    </Text>
                    <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                  </View>
                  <SelectField
                    label="Sous-catégorie"
                    value={formData.subCategory}
                    placeholder={t('sell.chooseSubCategory', 'Sous-catégorie')}
                    onPress={() => formData.category && setShowSubCategoryModal(true)}
                    disabled={!formData.category}
                    required={true}
                    colors={colors}
                  />
                </View>
              </View>

              {/* Prix */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    {t('sell.price', 'Prix')}
                  </Text>
                  <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                </View>
                <PriceInput
                  value={formData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder={t('sell.pricePlaceholder', '0.00')}
                  colors={colors}
                />
              </View>
            </ProductFormSection>

            {/* Section Description */}
            <ProductFormSection title={t('sell.description', 'Description')} colors={colors}>
              <FormInputGroup
                label={t('sell.detailedDescription', 'Description détaillée')}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder={t('sell.descriptionPlaceholder', 'Décrivez votre produit en détail... (minimum 50 caractères)')}
                required={true}
                multiline={true}
                maxLength={1000}
                colors={colors}
                characterCount={true}
              />
            </ProductFormSection>

            {/* Section État et Localisation */}
            <ProductFormSection title={t('sell.conditionAndLocation', 'État et localisation')} colors={colors}>
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {t('sell.productCondition', 'État du produit')}
                    </Text>
                    <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                  </View>
                  <SelectField
                    label="État du produit"
                    value={formData.condition ? getConditionLabel(formData.condition) : ''}
                    placeholder={t('sell.chooseCondition', 'État du produit')}
                    onPress={() => setShowConditionModal(true)}
                    required={true}
                    colors={colors}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {t('sell.location', 'Localisation')}
                    </Text>
                    <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                  </View>
                  <SelectField
                    label="Localisation"
                    value={formData.location}
                    placeholder={t('sell.chooseLocation', 'Ville')}
                    onPress={() => setShowLocationModal(true)}
                    required={true}
                    colors={colors}
                  />
                </View>
              </View>
            </ProductFormSection>

            {/* Message d'information sur la validation admin */}
            <ValidationInfoCard colors={colors} />

            {/* Bouton de publication */}
            <CustomButton
              title={isSubmitting ? t('sell.submitting', 'Soumission...') : t('sell.submitAd', 'Soumettre l\'annonce')}
              onPress={handleSubmit}
              variant="primary"
              size="large"
              loading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
              style={styles.publishButton}
            />

            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              * {t('sell.requiredFields', 'Champs obligatoires')}
            </Text>
          </View>
        </ScrollView>

        {/* Modals */}
        <CategorySelectorModal
          visible={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          categories={categories}
          onSelectCategory={handleCategorySelect}
          colors={colors}
        />

        <Modal
          visible={showSubCategoryModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {formData.category} - {t('sell.subCategories', 'Sous-catégories')}
              </Text>
              <TouchableOpacity onPress={() => setShowSubCategoryModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={subCategories}
              renderItem={renderSubCategoryItem}
              keyExtractor={item => item}
              style={styles.modalList}
            />
          </View>
        </Modal>

        <Modal
          visible={showConditionModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('sell.productCondition', 'État du produit')}
              </Text>
              <TouchableOpacity onPress={() => setShowConditionModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CONDITIONS}
              renderItem={renderConditionItem}
              keyExtractor={item => item.id}
              style={styles.modalList}
            />
          </View>
        </Modal>

        <Modal
          visible={showLocationModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('sell.location', 'Localisation')}
              </Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LOCATIONS}
              renderItem={renderLocationItem}
              keyExtractor={item => item}
              style={styles.modalList}
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  requiredStar: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  publishButton: {
    marginTop: 8,
  },
  helperText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalList: {
    flex: 1,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  modalItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});