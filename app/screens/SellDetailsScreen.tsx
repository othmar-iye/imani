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
    console.log('🔧 Compression de l\'image:', imageUri);
    
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
    
    console.log('✅ Image compressée:', {
      original: imageUri,
      compressed: result.uri,
      width: result.width,
      height: result.height
    });
    
    return result.uri;
  } catch (error) {
    console.error('❌ Erreur compression image:', error);
    // En cas d'erreur, retourner l'image originale
    return imageUri;
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
    // Ne pas réinitialiser la sous-catégorie automatiquement
    setShowCategoryModal(false);
    // Ouvrir directement la modal des sous-catégories
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

  const uploadImages = async (productId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    try {
      for (const [index, image] of images.entries()) {
        if (!image.uri) {
          throw new Error(`Image ${index + 1} n'a pas d'URI valide`);
        }

        console.log(`📤 Upload image ${index + 1}/${images.length}`);
        
        // Étape 1: Compression de l'image
        const compressedImageUri = await compressImage(image.uri, 0.8, 1200, 1200);
        
        // Étape 2: Récupération de l'image compressée
        const response = await fetch(compressedImageUri);
        
        if (!response.ok) {
          throw new Error(`Erreur fetch image compressée ${index + 1}: ${response.status}`);
        }
        
        // Convertir la réponse en arrayBuffer puis en Uint8Array pour Supabase
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        if (uint8Array.length === 0) {
          throw new Error(`Données image compressée ${index + 1} sont vides`);
        }

        console.log(`📊 Taille image compressée: ${(uint8Array.length / 1024 / 1024).toFixed(2)} MB`);

        // Créer un nom de fichier unique
        const fileName = `${user?.id}/${productId}/${Date.now()}-${index}.jpg`;
        
        // Upload vers Supabase Storage avec Uint8Array
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, uint8Array, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (error) {
          throw error;
        }

        // Récupérer l'URL publique
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
          console.log(`✅ Image ${index + 1} uploadée: ${urlData.publicUrl}`);
        } else {
          throw new Error(`Impossible d'obtenir l'URL publique pour l'image ${index + 1}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur upload images:', error);
      throw new Error('Erreur lors de l\'upload des images');
    }
    
    return uploadedUrls;
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
      // Préparer les données pour l'insertion
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

      // Procéder directement à l'insertion
      await proceedWithInsertion(productData);

    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const proceedWithInsertion = async (productData: any) => {
    try {
      // Uploader toutes les images d'abord (avec compression)
      const imageUrls = await uploadImages('temp-product');
      
      if (imageUrls.length === 0) {
        throw new Error('Aucune image uploadée');
      }

      // Créer le produit avec les URLs des images
      const productDataWithImages = {
        ...productData,
        images: imageUrls
      };

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([productDataWithImages])
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      // Succès
      Alert.alert(
        t('sell.publicationSuccess', 'Annonce soumise !'),
        t('sell.pendingAdminValidation', 'Votre annonce a été soumise avec succès. Elle sera visible après validation par notre équipe.'),
        [
          {
            text: t('common.ok', 'OK'),
            onPress: () => {
              router.push('/(tabs)/home');
            }
          }
        ]
      );

    } catch (error: any) {
      let errorMessage = t('sell.publicationError', 'Impossible de soumettre l\'annonce. Veuillez réessayer.');
      
      // Messages d'erreur plus spécifiques
      if (error.message?.includes('upload') || error.message?.includes('image')) {
        errorMessage = t('sell.uploadError', 'Erreur lors de l\'upload des images. Vérifiez votre connexion internet.');
      } else if (error.message?.includes('storage')) {
        errorMessage = 'Erreur de stockage. Vérifiez les permissions du bucket.';
      } else if (error.message?.includes('Aucune image')) {
        errorMessage = t('sell.noImagesUploaded', 'Aucune image n\'a pu être uploadée.');
      }
      
      Alert.alert(
        t('common.error', 'Erreur'),
        errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.category && formData.subCategory && 
                     formData.price && formData.description.trim() && formData.condition && formData.location;

  // Fonction pour obtenir le libellé de la condition
  const getConditionLabel = (conditionValue: string) => {
    const condition = CONDITIONS.find(c => c.value === conditionValue);
    return condition ? condition.label : '';
  };

  // Navigation entre les images
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