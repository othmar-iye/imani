// screens/WalletScreen.tsx
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

// Types pour les transactions
interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  category: 'purchase' | 'refund' | 'withdrawal' | 'deposit' | 'transfer';
}

export default function WalletScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
    success: isDark ? '#34C759' : '#30D158',
    warning: isDark ? '#FFD60A' : '#FFD60A',
    error: isDark ? '#FF453A' : '#FF3B30',
  };

  // États du portefeuille
  const [balance, setBalance] = useState(50000); // 50,000 CDF
  const [pendingBalance, setPendingBalance] = useState(15000); // 15,000 CDF en attente

  // Données des transactions (simulées)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'credit',
      amount: 80000,
      description: t('wallet.transactions.sale') + ' iPhone 13',
      date: '24 Oct. 2025',
      status: 'completed',
      category: 'purchase'
    },
    {
      id: '2',
      type: 'debit',
      amount: 10000,
      description: t('wallet.transactions.purchase') + ' accessoire téléphone',
      date: '24 Oct. 2025',
      status: 'completed',
      category: 'purchase'
    },
    {
      id: '3',
      type: 'credit',
      amount: 10000,
      description: t('wallet.transactions.refund') + ' commande annulée',
      date: '24 Oct. 2025',
      status: 'pending',
      category: 'refund'
    },
    {
      id: '4',
      type: 'credit',
      amount: 25000,
      description: t('wallet.transactions.sale') + ' casque audio',
      date: '23 Oct. 2025',
      status: 'completed',
      category: 'purchase'
    },
    {
      id: '5',
      type: 'debit',
      amount: 15000,
      description: t('wallet.transactions.withdrawal') + ' vers compte bancaire',
      date: '22 Oct. 2025',
      status: 'completed',
      category: 'withdrawal'
    }
  ]);

  // Fonctions de navigation
  const navigateToDeposit = () => {
    // router.push('/screens/DepositScreen');
  };

  const navigateToWithdraw = () => {
    // router.push('/screens/WithdrawScreen');
  };

  const navigateToHistory = () => {
    // router.push('/screens/TransactionHistoryScreen');
  };

  const navigateToTransfer = () => {
    // router.push('/screens/TransferScreen');
  };

  // Actions principales du portefeuille - CORRIGÉ avec les bonnes clés
  const walletActions = [
    {
      icon: 'add-circle',
      label: t('wallet.actions.deposit'),
      description: t('wallet.actions.addMoney'),
      color: colors.success,
      onPress: navigateToDeposit,
    },
    {
      icon: 'remove-circle',
      label: t('wallet.actions.withdraw'),
      description: t('wallet.actions.withdrawMoney'),
      color: colors.tint,
      onPress: navigateToWithdraw,
    },
    {
      icon: 'swap-horizontal',
      label: t('wallet.actions.transfer'),
      description: t('wallet.actions.transferMoney'),
      color: colors.warning,
      onPress: navigateToTransfer,
    },
    {
      icon: 'time',
      label: t('wallet.actions.history'),
      description: t('wallet.actions.viewHistory'),
      color: colors.textSecondary,
      onPress: navigateToHistory,
    },
  ];

  // Fonction pour formater le montant
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fonction pour obtenir l'icône de transaction
  const getTransactionIcon = (category: string, type: string) => {
    switch (category) {
      case 'purchase':
        return type === 'credit' ? 'cart' : 'cart-outline';
      case 'refund':
        return 'refresh';
      case 'withdrawal':
        return 'cash-outline';
      case 'deposit':
        return 'cash';
      case 'transfer':
        return 'swap-horizontal';
      default:
        return 'card';
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  // Fonction pour obtenir le texte du statut - CORRIGÉ
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('wallet.status.completed');
      case 'pending':
        return t('wallet.status.pending');
      case 'failed':
        return t('wallet.status.failed');
      default:
        return status;
    }
  };

  // Rendu d'une transaction
  const renderTransactionItem = (transaction: Transaction, index: number) => (
    <TouchableOpacity
      key={transaction.id}
      style={[
        styles.transactionItem,
        { 
          backgroundColor: colors.card,
          marginBottom: index === transactions.length - 1 ? 0 : 12,
        }
      ]}
      onPress={() => console.log('Détails transaction:', transaction.id)}
    >
      <View style={styles.transactionLeft}>
        <View 
          style={[
            styles.transactionIcon,
            { 
              backgroundColor: transaction.type === 'credit' 
                ? 'rgba(52, 199, 89, 0.1)' 
                : 'rgba(255, 59, 48, 0.1)'
            }
          ]}
        >
          <Ionicons 
            name={getTransactionIcon(transaction.category, transaction.type) as any}
            size={20}
            color={transaction.type === 'credit' ? colors.success : colors.error}
          />
        </View>
        
        <View style={styles.transactionInfo}>
          <Text style={[styles.transactionDescription, { color: colors.text }]}>
            {transaction.description}
          </Text>
          <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
            {transaction.date} • <Text style={{ color: getStatusColor(transaction.status) }}>
              {getStatusText(transaction.status)}
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.transactionRight}>
        <Text 
          style={[
            styles.transactionAmount,
            { 
              color: transaction.type === 'credit' ? colors.success : colors.error 
            }
          ]}
        >
          {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header - CORRIGÉ */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
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
          {t('wallet.myWallet')}
        </Text>
        <TouchableOpacity 
          style={styles.helpButton}
        //   onPress={() => router.push('/screens/WalletHelpScreen')}
        >
          <Ionicons 
            name="help-circle-outline" 
            size={24} 
            color={colors.tint} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte de solde principale - CORRIGÉ */}
        <View style={[styles.balanceCard, { backgroundColor: colors.tint }]}>
          <Text style={styles.balanceTitle}>
            {t('wallet.availableBalance')}
          </Text>
          <Text style={styles.balanceAmount}>
            {formatAmount(balance)}
          </Text>
          
          <View style={styles.pendingBalance}>
            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.pendingText}>
              {t('wallet.pendingBalance')} {formatAmount(pendingBalance)}
            </Text>
          </View>
        </View>

        {/* Actions rapides - CORRIGÉ */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('wallet.quickActions')}
          </Text>
          
          <View style={styles.actionsGrid}>
            {walletActions.map((action, index) => (
              <TouchableOpacity
                key={action.label}
                style={[
                  styles.actionCard,
                  { backgroundColor: colors.card }
                ]}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons 
                    name={action.icon as any} 
                    size={24} 
                    color={action.color} 
                  />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
                <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dernières transactions - CORRIGÉ */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('wallet.recentTransactions')}
            </Text>
            <TouchableOpacity onPress={navigateToHistory}>
              <Text style={[styles.seeAllText, { color: colors.tint }]}>
                {t('wallet.seeAll')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {transactions.slice(0, 5).map((transaction, index) => 
              renderTransactionItem(transaction, index)
            )}
            
            {transactions.length === 0 && (
              <View style={styles.emptyTransactions}>
                <Ionicons 
                  name="wallet-outline" 
                  size={48} 
                  color={colors.textSecondary} 
                />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {t('wallet.noTransactions')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Informations de sécurité - CORRIGÉ */}
        <View style={[styles.securityInfo, { backgroundColor: colors.card }]}>
          <Ionicons name="shield-checkmark" size={20} color={colors.tint} />
          <Text style={[styles.securityText, { color: colors.textSecondary }]}>
            {t('wallet.securityInfo')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
  },
  helpButton: {
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
    overflow: 'hidden',
  },
  balanceTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  pendingBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
    overflow: 'hidden',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  transactionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
    overflow: 'hidden',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyTransactions: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
});