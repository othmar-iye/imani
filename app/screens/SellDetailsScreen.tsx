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

const LOCATIONS = ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kananga', 'Kisangani', 'Bukavu', 'Goma', 'Matadi', 'Autre'];

export default function SellDetailsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
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
    handleInputChange('condition', condition.value); // Stocker la valeur (new, like-new, etc.)
    setShowConditionModal(false);
  };

  const handleLocationSelect = (location: string) => {
    handleInputChange('location', location);
    setShowLocationModal(false);
  };

  const uploadImages = async (productId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    try {
      for (const image of images) {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        
        const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      }
    } catch (error) {
      console.error('Erreur upload images:', error);
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

    setIsSubmitting(true);

    try {
      // 1. Créer le produit dans la base de données
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name.trim(),
            category: formData.category,
            sub_category: formData.subCategory,
            price: parseFloat(formData.price),
            description: formData.description.trim(),
            condition: formData.condition, // Stocke new, like-new, good, fair
            location: formData.location,
            seller_id: user.id,
            views: 0,
            is_available: true,
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (productError) throw productError;

      // 2. Uploader les images
      const imageUrls = await uploadImages(product.id);

      // 3. Mettre à jour le produit avec les URLs des images
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: imageUrls })
        .eq('id', product.id);

      if (updateError) throw updateError;

      // Succès
      Alert.alert(
        t('sell.publicationSuccess', 'Annonce publiée !'),
        t('sell.productPublished', 'Votre produit a été publié avec succès.'),
        [
          {
            text: t('common.ok', 'OK'),
            onPress: () => {
              router.replace('/(tabs)/home');
            }
          }
        ]
      );

    } catch (error) {
      console.error('Erreur publication:', error);
      Alert.alert(
        t('common.error', 'Erreur'),
        t('sell.publicationError', 'Impossible de publier l\'annonce. Veuillez réessayer.')
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
                    borderColor: colors.border,
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
                      borderColor: colors.border,
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
                      borderColor: colors.border,
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
                      borderColor: colors.border,
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
                    borderColor: colors.border,
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
                      borderColor: colors.border,
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
                      borderColor: colors.border,
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

            {/* Bouton de publication */}
            <CustomButton
              title={isSubmitting ? t('sell.publishing', 'Publication...') : t('sell.publishAd', 'Publier l\'annonce')}
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
});