// screens/SellDetailsScreen.tsx
import CustomButton from '@/components/CustomButton';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { categories, Category } from '@/src/data/categories';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
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
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    handleInputChange('subCategory', '');
    setShowCategoryModal(false);
    setTimeout(() => setShowSubCategoryModal(true), 300);
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

        const response = await fetch(image.uri);
        
        if (!response.ok) {
          throw new Error(`Erreur fetch image ${index + 1}: ${response.status}`);
        }
        
        // Convertir la réponse en arrayBuffer puis en Uint8Array pour Supabase
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        if (uint8Array.length === 0) {
          throw new Error(`Données image ${index + 1} sont vides`);
        }

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
        } else {
          throw new Error(`Impossible d'obtenir l'URL publique pour l'image ${index + 1}`);
        }
      }
    } catch (error) {
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
        is_available: true,
        is_valid: false,
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
      // Uploader toutes les images d'abord
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
              router.push('/screens/profileOption/MyItemsScreen');
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

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.modalItem, { borderBottomColor: colors.border }]}
      onPress={() => handleCategorySelect(item)}
    >
      <Ionicons name={item.icon as any} size={24} color={colors.tint} />
      <Text style={[styles.modalItemText, { color: colors.text }]}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

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
        <View style={[styles.header, { borderBottomColor: Theme.light.borderInput }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={Theme.light.tint} 
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
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('sell.photosPreview', 'Aperçu des photos')} ({images.length}/5)
              </Text>
              
              {/* Image principale avec navigation */}
              <View style={styles.mainImageContainer}>
                <Image
                  source={{ uri: images[selectedImageIndex].uri }}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
                
                {/* Indicateur de navigation si plusieurs images */}
                {images.length > 1 && (
                  <>
                    {/* Bouton précédent */}
                    <TouchableOpacity 
                      style={[styles.navButton, styles.prevButton]}
                      onPress={goToPrevImage}
                    >
                      <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    
                    {/* Bouton suivant */}
                    <TouchableOpacity 
                      style={[styles.navButton, styles.nextButton]}
                      onPress={goToNextImage}
                    >
                      <Ionicons name="chevron-forward" size={24} color="#FFF" />
                    </TouchableOpacity>
                    
                    {/* Indicateur de position */}
                    <View style={styles.imageCounter}>
                      <Text style={styles.imageCounterText}>
                        {selectedImageIndex + 1}/{images.length}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {/* Miniatures des images */}
              {images.length > 1 && (
                <View style={styles.thumbnailsContainer}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnailsScroll}
                  >
                    {images.map((image, index) => (
                      <TouchableOpacity
                        key={image.id}
                        style={[
                          styles.thumbnail,
                          { 
                            borderColor: index === selectedImageIndex ? colors.tint : colors.border,
                            borderWidth: index === selectedImageIndex ? 2 : 1
                          }
                        ]}
                        onPress={() => selectImage(index)}
                      >
                        <Image
                          source={{ uri: image.uri }}
                          style={styles.thumbnailImage}
                          resizeMode="cover"
                        />
                        {index === selectedImageIndex && (
                          <View style={[styles.thumbnailOverlay, { backgroundColor: colors.tint }]}>
                            <Ionicons name="checkmark" size={16} color="#FFF" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Message informatif */}
              <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
                <Ionicons name="information-circle-outline" size={20} color={colors.tint} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  {t('sell.photosInfo', 'Ces photos seront affichées dans votre annonce. La première image sera la photo principale.')}
                </Text>
              </View>
            </View>

            {/* Section Informations de base */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('sell.basicInfo', 'Informations de base')}
              </Text>

              {/* Nom du produit */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    {t('sell.productName', 'Nom du produit')}
                  </Text>
                  <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                </View>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background,
                    borderColor: Theme.light.borderInput,
                    color: colors.text 
                  }]}
                  placeholder={t('sell.productNamePlaceholder', 'Ex: Montre Rolex Submariner')}
                  placeholderTextColor={colors.textSecondary}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  maxLength={100}
                />
              </View>

              {/* Catégorie et Sous-catégorie */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {t('sell.category', 'Catégorie')}
                    </Text>
                    <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.selectButton, { 
                      backgroundColor: colors.background,
                      borderColor: Theme.light.borderInput,
                    }]}
                    onPress={() => setShowCategoryModal(true)}
                  >
                    <Text style={[
                      styles.selectButtonText, 
                      { color: formData.category ? colors.text : colors.textSecondary }
                    ]}>
                      {formData.category || t('sell.chooseCategory', 'Choisir une catégorie')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {t('sell.subCategory', 'Sous-catégorie')}
                    </Text>
                    <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.selectButton, { 
                      backgroundColor: colors.background,
                      borderColor: Theme.light.borderInput,
                    }]}
                    onPress={() => formData.category && setShowSubCategoryModal(true)}
                    disabled={!formData.category}
                  >
                    <Text style={[
                      styles.selectButtonText, 
                      { color: formData.subCategory ? colors.text : colors.textSecondary,
                        opacity: formData.category ? 1 : 0.5 }
                    ]}>
                      {formData.subCategory || t('sell.chooseSubCategory', 'Sous-catégorie')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
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
                <View style={styles.priceContainer}>
                  <TextInput
                    style={[styles.priceInput, { 
                      backgroundColor: colors.background,
                      borderColor: Theme.light.borderInput,
                      color: colors.text 
                    }]}
                    placeholder={t('sell.pricePlaceholder', '0.00')}
                    placeholderTextColor={colors.textSecondary}
                    value={formData.price}
                    onChangeText={(value) => handleInputChange('price', value.replace(/[^0-9.]/g, ''))}
                    keyboardType="decimal-pad"
                  />
                  <Text style={[styles.currency, { color: colors.textSecondary }]}>
                    {t('sell.currency', 'USD')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Section Description */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('sell.description', 'Description')}
              </Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    {t('sell.detailedDescription', 'Description détaillée')}
                  </Text>
                  <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                </View>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: colors.background,
                    borderColor: Theme.light.borderInput,
                    color: colors.text 
                  }]}
                  placeholder={t('sell.descriptionPlaceholder', 'Décrivez votre produit en détail... (minimum 50 caractères)')}
                  placeholderTextColor={colors.textSecondary}
                  value={formData.description}
                  onChangeText={(value) => handleInputChange('description', value)}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  maxLength={1000}
                />
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {formData.description.length}/1000 {t('sell.characters', 'caractères')}
                </Text>
              </View>
            </View>

            {/* Section État et Localisation */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('sell.conditionAndLocation', 'État et localisation')}
              </Text>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {t('sell.productCondition', 'État du produit')}
                    </Text>
                    <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.selectButton, { 
                      backgroundColor: colors.background,
                      borderColor: Theme.light.borderInput,
                    }]}
                    onPress={() => setShowConditionModal(true)}
                  >
                    <Text style={[
                      styles.selectButtonText, 
                      { color: formData.condition ? colors.text : colors.textSecondary }
                    ]}>
                      {formData.condition ? getConditionLabel(formData.condition) : t('sell.chooseCondition', 'État du produit')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {t('sell.location', 'Localisation')}
                    </Text>
                    <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.selectButton, { 
                      backgroundColor: colors.background,
                      borderColor: Theme.light.borderInput,
                    }]}
                    onPress={() => setShowLocationModal(true)}
                  >
                    <Text style={[
                      styles.selectButtonText, 
                      { color: formData.location ? colors.text : colors.textSecondary }
                    ]}>
                      {formData.location || t('sell.chooseLocation', 'Ville')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Message d'information sur la validation admin */}
            <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.tint} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {t('sell.adminValidationInfo', 'Votre annonce sera examinée par notre équipe avant d\'être publiée. Vous serez notifié une fois validée.')}
              </Text>
            </View>

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
        <Modal
          visible={showCategoryModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('sell.chooseCategory', 'Choisir une catégorie')}
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              style={styles.modalList}
            />
          </View>
        </Modal>

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
  section: {
    padding: 20,
    borderRadius: 12,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
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
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 120,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
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
  // Styles pour la prévisualisation des images
  mainImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 12,
  },
  nextButton: {
    right: 12,
  },
  imageCounter: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    marginTop: 12,
  },
  thumbnailsScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
});