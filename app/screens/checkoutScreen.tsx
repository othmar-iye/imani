import CustomButton from '@/components/CustomButton';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Types pour les méthodes de paiement
type PaymentMethod = 'visa' | 'mastercard' | 'airtel' | 'mpesa' | 'orange';

export default function CheckoutScreen() {
  const { 
    productId,
    productName, 
    productPrice, 
    productImage,
    productDescription,
    sellerName,
  } = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  // Utiliser les données reçues du produit
  const cartItems = [
    {
      id: productId as string || '1',
      name: productName as string || t('productDetail.conditionTypes.new'),
      seller: sellerName as string || 'Pellipilk',
      price: parseInt(productPrice as string) || 4590,
      currency: '$',
      description: productDescription as string || t('productDetail.description'),
      image: productImage as string || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'
    }
  ];

  const paymentMethods = [
    {
      id: 'airtel',
      name: 'Airtel Money',
      icon: 'phone-portrait-outline',
      type: 'mobile' as const,
      logo: require('@/assets/images/payment/airtelmoney.png'),
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: 'phone-portrait-outline',
      type: 'mobile' as const,
      logo: require('@/assets/images/payment/mpesa.png'),
    },
    {
      id: 'orange',
      name: 'Orange Money',
      icon: 'phone-portrait-outline',
      type: 'mobile' as const,
      logo: require('@/assets/images/payment/orangemoney.png'),
    },
    {
      id: 'visa',
      name: 'Visa',
      icon: 'card-outline',
      type: 'card' as const,
      logo: require('@/assets/images/payment/visa.png'),
    },
    {
      id: 'mastercard',
      name: 'MasterCard',
      icon: 'card-outline',
      type: 'card' as const,
      logo: require('@/assets/images/payment/mastercard.png'),
    }
  ];

  // Calculer les totaux basés sur le prix réel du produit
  const subtotal = parseInt(productPrice as string) || 4590;
  const deliveryFee = 1000;
  const platformFee = 45;
  const total = subtotal + deliveryFee + platformFee;

  const handlePayment = () => {
    console.log('Processing payment with:', selectedMethod);
    // Logique de paiement ici
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-CD') + ' $';
  };

  const renderCardForm = () => (
    <View style={[styles.paymentForm, { backgroundColor: colors.card }]}>
      <Text style={[styles.formTitle, { color: colors.text }]}>
        {t('checkout.cardInformation')}
      </Text>
      
      <View style={[styles.inputContainer, { borderColor: colors.border }]}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          {t('checkout.cardName')} *
        </Text>
        <TextInput
          style={[styles.input, { 
            borderColor: colors.border, 
            backgroundColor: colors.background,
            color: colors.text 
          }]}
          value={cardName}
          onChangeText={setCardName}
          placeholder={t('checkout.cardNamePlaceholder')}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={[styles.inputContainer, { borderColor: colors.border }]}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          {t('checkout.cardNumber')} *
        </Text>
        <TextInput
          style={[styles.input, { 
            borderColor: colors.border, 
            backgroundColor: colors.background,
            color: colors.text 
          }]}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder={t('checkout.cardNumberPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10, borderColor: colors.border }]}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            {t('checkout.expiryDate')} *
          </Text>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              backgroundColor: colors.background,
              color: colors.text 
            }]}
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder={t('checkout.expiryDatePlaceholder')}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1, borderColor: colors.border }]}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            {t('checkout.cvv')} *
          </Text>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              backgroundColor: colors.background,
              color: colors.text 
            }]}
            value={cvv}
            onChangeText={setCvv}
            placeholder={t('checkout.cvvPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
      </View>
    </View>
  );

  const renderMobileForm = () => (
    <View style={[styles.paymentForm, { backgroundColor: colors.card }]}>
      <Text style={[styles.formTitle, { color: colors.text }]}>
        {t('checkout.phoneNumber')}
      </Text>
      
      <View style={[styles.inputContainer, { borderColor: colors.border }]}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          {t('checkout.yourNumber')} *
        </Text>
        <TextInput
          style={[styles.input, { 
            borderColor: colors.border, 
            backgroundColor: colors.background,
            color: colors.text 
          }]}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder={t('checkout.phonePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={[styles.note, { color: colors.textSecondary }]}>
        {t('checkout.mobileConfirmation')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header identique à Filters */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={colors.tint} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('checkout.title')}
          </Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Résumé de la commande avec photo */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('checkout.yourOrder')}
          </Text>
          
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image 
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
                <Text style={[styles.itemSeller, { color: colors.textSecondary }]}>
                  {t('checkout.seller')}: {item.seller}
                </Text>
              </View>
              <Text style={[styles.itemPrice, { color: colors.tint }]}>
                {formatCurrency(item.price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Détails de la facture */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('checkout.invoiceDetails')}
          </Text>
          
          <View style={styles.invoiceRow}>
            <Text style={[styles.invoiceLabel, { color: colors.textSecondary }]}>
              {t('checkout.subtotal')}
            </Text>
            <Text style={[styles.invoiceValue, { color: colors.text }]}>
              {formatCurrency(subtotal)}
            </Text>
          </View>
          
          <View style={styles.invoiceRow}>
            <Text style={[styles.invoiceLabel, { color: colors.textSecondary }]}>
              {t('checkout.deliveryFee')}
            </Text>
            <Text style={[styles.invoiceValue, { color: colors.text }]}>
              {formatCurrency(deliveryFee)}
            </Text>
          </View>
          
          <View style={styles.invoiceRow}>
            <Text style={[styles.invoiceLabel, { color: colors.textSecondary }]}>
              {t('checkout.platformFee')}
            </Text>
            <Text style={[styles.invoiceValue, { color: colors.text }]}>
              {formatCurrency(platformFee)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              {t('checkout.toPay')}
            </Text>
            <Text style={[styles.totalValue, { color: colors.tint }]}>
              {formatCurrency(total)}
            </Text>
          </View>

          <View style={[styles.noteCard, { backgroundColor: colors.background }]}>
            <Ionicons name="information-circle-outline" size={16} color={colors.tint} />
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              {t('checkout.avoidCancellation')}
            </Text>
          </View>
        </View>

        {/* Méthodes de paiement avec vrais logos */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('checkout.paymentMethod')}
          </Text>
          
          {paymentMethods.map((method) => (
            <View key={method.id}>
              <TouchableOpacity
                style={[
                  styles.paymentMethod,
                  { 
                    backgroundColor: colors.background,
                    borderColor: selectedMethod === method.id ? colors.tint : colors.border 
                  }
                ]}
                onPress={() => setSelectedMethod(method.id as PaymentMethod)}
              >
                <View style={styles.methodLeft}>
                  <Image 
                    source={typeof method.logo === 'string' ? { uri: method.logo } : method.logo}
                    style={styles.methodLogo}
                    resizeMode="contain"
                  />
                  <Text style={[styles.methodName, { color: colors.text }]}>
                    {method.name}
                  </Text>
                </View>
                <View style={[
                  styles.radio,
                  { 
                    borderColor: selectedMethod === method.id ? colors.tint : colors.border,
                    backgroundColor: selectedMethod === method.id ? colors.tint : 'transparent'
                  }
                ]}>
                  {selectedMethod === method.id && (
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Formulaires conditionnels */}
              <Collapsible 
                collapsed={selectedMethod !== method.id}
                duration={300}
              >
                {method.type === 'card' && renderCardForm()}
                {method.type === 'mobile' && renderMobileForm()}
              </Collapsible>
            </View>
          ))}
        </View>

        {/* Espace pour le bouton */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton de paiement fixe */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <CustomButton
          title={`${t('checkout.pay')} ${formatCurrency(total)}`}
          onPress={handlePayment}
          variant="primary"
          size="large"
          disabled={!selectedMethod}
        />
      </View>
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
  headerRight: {
    width: 60,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemSeller: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceLabel: {
    fontSize: 14,
  },
  invoiceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  noteText: {
    fontSize: 12,
    flex: 1,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodLogo: {
    width: 30,
    height: 20,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentForm: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 48,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'android' ? 30 : 20,
    borderTopWidth: 1,
  },
});