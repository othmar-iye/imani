// screens/SellDetailsScreen.tsx
import CustomButton from '@/components/CustomButton';
import { Header } from '@/components/Header';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { categories, Category } from '@/src/data/categories';
import { allCities } from '@/src/data/cities';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import des nouveaux composants
import { FormInputGroup } from '@/components/selldetail/FormInputGroup';
import { ImageGalleryPreview } from '@/components/selldetail/ImageGalleryPreview';
import { PriceInput } from '@/components/selldetail/PriceInput';
import { ProductFormSection } from '@/components/selldetail/ProductFormSection';
import { SelectField } from '@/components/selldetail/SelectField';
import { ValidationInfoCard } from '@/components/selldetail/ValidationInfoCard';

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

// Composant Modal Item Typographique
const TypographicModalItem = ({ 
  item, 
  isSelected, 
  onPress, 
  colors 
}: { 
  item: { label: string; value: string };
  isSelected: boolean;
  onPress: () => void;
  colors: any;
}) => (
  <TouchableOpacity
    style={[
      styles.modalItem,
      { 
        borderBottomColor: colors.border,
        backgroundColor: isSelected ? colors.tint + '15' : 'transparent'
      }
    ]}
    onPress={onPress}
  >
    <View style={styles.modalItemContent}>
      <Text style={[
        styles.modalItemText,
        { 
          color: isSelected ? colors.tint : colors.text,
          fontWeight: isSelected ? '700' : '400'
        }
      ]}>
        {item.label}
      </Text>
      {isSelected && (
        <View style={[styles.selectionIndicator, { backgroundColor: colors.tint }]} />
      )}
    </View>
  </TouchableOpacity>
);

// Composant Modal Header Typographique DE BASE (sans recherche)
const TypographicModalHeader = ({ 
  title, 
  onClose, 
  colors 
}: { 
  title: string; 
  onClose: () => void; 
  colors: any;
}) => (
  <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
    <View style={styles.modalHeaderContent}>
      <Text style={[styles.modalTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
        Sélectionnez une option
      </Text>
    </View>
    <TouchableOpacity 
      style={styles.closeButton}
      onPress={onClose}
    >
      <Ionicons name="close" size={24} color={colors.text} />
    </TouchableOpacity>
  </View>
);

// Composant Modal Header Typographique AVEC RECHERCHE
const TypographicModalHeaderWithSearch = ({ 
  title, 
  onClose, 
  colors,
  searchValue,
  onSearchChange,
  placeholder = "Rechercher..."
}: { 
  title: string; 
  onClose: () => void; 
  colors: any;
  searchValue: string;
  onSearchChange: (text: string) => void;
  placeholder?: string;
}) => (
  <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
    <View style={styles.modalHeaderContent}>
      <Text style={[styles.modalTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
        Sélectionnez une option
      </Text>
      
      {/* Barre de recherche */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={searchValue}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchValue.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
    <TouchableOpacity 
      style={styles.closeButton}
      onPress={onClose}
    >
      <Ionicons name="close" size={24} color={colors.text} />
    </TouchableOpacity>
  </View>
);

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

  // États pour la recherche de villes
  const [locationSearch, setLocationSearch] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<string[]>(allCities);

  const selectedCategory = categories.find(cat => cat.name === formData.category);
  const subCategories = selectedCategory?.subCategories || [];

  // Filtrer les villes basées sur la recherche
  useEffect(() => {
    if (!locationSearch.trim()) {
      setFilteredLocations(allCities);
    } else {
      const searchTerm = locationSearch.toLowerCase();
      const filtered = allCities.filter(city => 
        city.toLowerCase().includes(searchTerm)
      );
      setFilteredLocations(filtered);
    }
  }, [locationSearch]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategorySelect = (category: Category) => {
    handleInputChange('category', category.name);
    setShowCategoryModal(false);
    // NE PAS ouvrir automatiquement la sous-catégorie
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
    setLocationSearch(''); // Réinitialiser la recherche
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

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TypographicModalItem
      item={{ label: item.name, value: item.name }}
      isSelected={formData.category === item.name}
      onPress={() => handleCategorySelect(item)}
      colors={colors}
    />
  );

  const renderSubCategoryItem = ({ item }: { item: string }) => (
    <TypographicModalItem
      item={{ label: item, value: item }}
      isSelected={formData.subCategory === item}
      onPress={() => handleSubCategorySelect(item)}
      colors={colors}
    />
  );

  const renderConditionItem = ({ item }: { item: { id: string; label: string; value: string } }) => (
    <TypographicModalItem
      item={{ label: item.label, value: item.value }}
      isSelected={formData.condition === item.value}
      onPress={() => handleConditionSelect(item)}
      colors={colors}
    />
  );

  const renderLocationItem = ({ item }: { item: string }) => (
    <TypographicModalItem
      item={{ label: item, value: item }}
      isSelected={formData.location === item}
      onPress={() => handleLocationSelect(item)}
      colors={colors}
    />
  );

  // Réinitialiser la recherche quand la modal s'ouvre/ferme
  const handleLocationModalOpen = () => {
    setLocationSearch('');
    setFilteredLocations(allCities);
    setShowLocationModal(true);
  };

  const handleLocationModalClose = () => {
    setLocationSearch('');
    setShowLocationModal(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header avec composant réutilisable */}
        <Header
          colors={colors}
          title={t('sell.detailsTitle', 'Détails de l\'annonce')}
          showBackButton={true}
          customPaddingTop={Platform.OS === 'ios' ? 0 : 60}
        />

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

              {/* Catégorie */}
              <View style={styles.inputGroup}>
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

              {/* Sous-catégorie - Maintenant indépendante */}
              <View style={styles.inputGroup}>
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
              {/* État du produit */}
              <View style={styles.inputGroup}>
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

              {/* Localisation */}
              <View style={styles.inputGroup}>
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
                  onPress={handleLocationModalOpen}
                  required={true}
                  colors={colors}
                />
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

        {/* Modal Catégorie */}
        <Modal
          visible={showCategoryModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <TypographicModalHeader
              title="Catégories"
              onClose={() => setShowCategoryModal(false)}
              colors={colors}
            />
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              style={styles.modalList}
            />
          </View>
        </Modal>

        {/* Modal Sous-catégorie */}
        <Modal
          visible={showSubCategoryModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <TypographicModalHeader
              title={`${formData.category} - Sous-catégories`}
              onClose={() => setShowSubCategoryModal(false)}
              colors={colors}
            />
            <FlatList
              data={subCategories}
              renderItem={renderSubCategoryItem}
              keyExtractor={item => item}
              style={styles.modalList}
            />
          </View>
        </Modal>

        {/* Modal Condition */}
        <Modal
          visible={showConditionModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <TypographicModalHeader
              title="État du produit"
              onClose={() => setShowConditionModal(false)}
              colors={colors}
            />
            <FlatList
              data={CONDITIONS}
              renderItem={renderConditionItem}
              keyExtractor={item => item.id}
              style={styles.modalList}
            />
          </View>
        </Modal>

        {/* Modal Localisation AVEC RECHERCHE */}
        <Modal
          visible={showLocationModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <TypographicModalHeaderWithSearch
              title="Localisation"
              onClose={handleLocationModalClose}
              colors={colors}
              searchValue={locationSearch}
              onSearchChange={setLocationSearch}
              placeholder="Rechercher une ville..."
            />
            
            {/* Liste des villes filtrées */}
            <FlatList
              data={filteredLocations}
              renderItem={renderLocationItem}
              keyExtractor={item => item}
              style={styles.modalList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    Aucune ville trouvée
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Essayez avec d'autres termes de recherche
                  </Text>
                </View>
              }
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
  publishButton: {
    marginTop: 8,
  },
  helperText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  // NOUVEAUX STYLES TYPOGRAPHIQUES
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  closeButton: {
    padding: 4,
  },
  modalList: {
    flex: 1,
  },
  modalItem: {
    borderBottomWidth: 1,
    minHeight: 60,
    justifyContent: 'center',
  },
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  modalItemText: {
    fontSize: 17,
    letterSpacing: -0.2,
    flex: 1,
  },
  selectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginLeft: 12,
  },
  // Styles pour la recherche
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  // Styles pour l'état vide
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});