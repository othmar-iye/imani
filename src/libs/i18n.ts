// lib/i18n.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
        // ... [TOUTES LES TRADUCTIONS EXISTANTES RESTENT IDENTIQUES] ...
        
        // Profile
        loading: "Chargement...",
        logoutTitle: "Déconnexion",
        logoutMessage: "Êtes-vous sûr de vouloir vous déconnecter ?",
        myItems: "Mes articles",
        myWallet: "Mon portefeuille", 
        myOrders: "Mes commandes",
        myConversations: "Mes discussions",
        termsOfService: "Conditions d'utilisation",
        privacyPolicy: "Politique de confidentialité",
        fullName: "Nom Complet",
        verifiedSeller: "Vendeur vérifié",
        editProfile: "Modifier profil",
        items: "Articles",
        sales: "Ventes", 
        ratings: "Évaluations",
        logoutMenu: "Se déconnecter",
        member: "Membre",

        // Profile Settings
        save: "Enregistrer",
        personalInfo: "Informations personnelles",
        enterFullName: "Votre nom complet",
        phoneNumber: "Numéro de téléphone",
        birthDate: "Date de naissance", 
        locationInfo: "Localisation",
        address: "Adresse",
        enterAddress: "Votre adresse complète",
        city: "Ville",
        identityVerification: "Vérification d'identité",
        identityType: "Type de pièce d'identité",
        voterCard: "Carte d'électeur",
        passport: "Passeport",
        drivingLicense: "Permis de conduire",
        identityNumber: "Numéro de la pièce",
        enterIdentityNumber: "Numéro de la pièce",
        uploadIdentityDocument: "Photo de la pièce d'identité",
        uploadProfilePicture: "Photo de profil",
        selectCity: "Choisir une ville",
        selectIdentityType: "Type de pièce d'identité", 
        notSelected: "Non sélectionné",
        uploaded: "✓",
        upload: "+",
        okText: "OK",
        success: "Succès",
        profileUpdated: "Profil mis à jour avec succès",
        verificationInfo: "La vérification de votre identité est nécessaire pour devenir vendeur sur {{appName}}. Le traitement peut prendre 24-48h.",
        profilePicture: "Photo de profil",
        tapToUpload: "Appuyez pour ajouter",
        addPhoto: "Ajouter une photo", 
        takePhoto: "Prendre une photo",
        chooseFromGallery: "Choisir depuis la galerie",
        chooseSource: "Choisir la source de la photo",
        incompleteProfile: "Profil incomplet",
        missingFields: "Veuillez remplir les champs suivants: {{fields}}",
        editProfileTitle: "Modifier le profil",

        // Nouvelles traductions pour la validation
        invalidPhone: "Numéro invalide",
        invalidPhoneMessage: "Le numéro doit commencer par +243 et avoir 13 caractères au total (ex: +243 81 234 5678)",
        invalidDate: "Date invalide",
        invalidDateMessage: "Veuillez entrer une date complète (JJ/MM/AAAA)",
        phoneFormat: "Format: +243 XX XXX XXXX (13 caractères)",
        dateFormat: "Format: JJ/MM/AAAA",

        // Traductions pour les champs d'édition
        editFullName: "Modifier le nom complet",
        editPhoneNumber: "Modifier le numéro de téléphone",
        editBirthDate: "Modifier la date de naissance",
        editAddress: "Modifier l'adresse",
        editIdentityNumber: "Modifier le numéro de pièce",
        phonePlaceholder: "+243 XX XXX XXXX",
        datePlaceholder: "JJ/MM/AAAA",
        permissionRequired: "Permission requise",
        cameraPermissionMessage: "Nous avons besoin de votre permission pour utiliser la caméra.",
        galleryPermissionMessage: "Nous avons besoin de votre permission pour accéder à vos photos.",
        error: "Erreur",
        cameraError: "Impossible d'accéder à la caméra.",
        galleryError: "Impossible d'accéder à la galerie photos.",

        // ==================== NOUVELLES TRADUCTIONS WALLET ====================
        wallet: {
          myWallet: "Mon Portefeuille",
          availableBalance: "Solde disponible",
          pendingBalance: "En attente",
          quickActions: "Actions rapides",
          recentTransactions: "Dernières transactions",
          seeAll: "Tout voir",
          noTransactions: "Aucune transaction pour le moment",
          securityInfo: "Votre argent est sécurisé et protégé. Les transactions sont cryptées.",
          
          actions: {
            deposit: "Recharger",
            withdraw: "Retirer", 
            transfer: "Transférer",
            history: "Historique",
            addMoney: "Ajouter de l'argent",
            withdrawMoney: "Retirer vers un compte",
            transferMoney: "Envoyer à un contact", 
            viewHistory: "Voir toutes les transactions"
          },
          
          status: {
            completed: "Terminé",
            pending: "En attente",
            failed: "Échoué"
          },
          
          transactions: {
            sale: "Vente produit",
            purchase: "Achat",
            refund: "Remboursement",
            withdrawal: "Retrait",
            deposit: "Dépôt",
            transfer: "Transfert"
          }
        }
    }
  },

  en: {
    translation: {
        // ... [TOUTES LES TRADUCTIONS EXISTANTES RESTENT IDENTIQUES] ...
        
        // Profile
        loading: "Loading...",
        logoutTitle: "Logout", 
        logoutMessage: "Are you sure you want to log out?",
        myItems: "My Items",
        myWallet: "My Wallet",
        myOrders: "My Orders",
        myConversations: "My Conversations", 
        termsOfService: "Terms of Service",
        privacyPolicy: "Privacy Policy",
        fullName: "Full Name",
        verifiedSeller: "Verified Seller",
        editProfile: "Edit Profile",
        items: "Items",
        sales: "Sales",
        ratings: "Ratings",
        logoutMenu: "Log out",
        member: "Member",

        // Profile Settings
        save: "Save",
        personalInfo: "Personal Information",
        enterFullName: "Your full name",
        phoneNumber: "Phone Number", 
        birthDate: "Birth Date",
        locationInfo: "Location",
        address: "Address",
        enterAddress: "Your complete address",
        city: "City",
        identityVerification: "Identity Verification",
        identityType: "Identity Document Type",
        voterCard: "Voter Card",
        passport: "Passport",
        drivingLicense: "Driving License",
        identityNumber: "Document Number",
        enterIdentityNumber: "Document number",
        uploadIdentityDocument: "Identity Document Photo",
        uploadProfilePicture: "Profile Picture",
        selectCity: "Select City", 
        selectIdentityType: "Identity Document Type",
        notSelected: "Not selected",
        uploaded: "✓",
        upload: "+",
        okText: "OK",
        success: "Success",
        profileUpdated: "Profile updated successfully",
        verificationInfo: "Identity verification is required to become a seller on {{appName}}. Processing may take 24-48 hours.",
        profilePicture: "Profile Picture",
        tapToUpload: "Tap to upload", 
        addPhoto: "Add Photo",
        takePhoto: "Take Photo",
        chooseFromGallery: "Choose from Gallery",
        chooseSource: "Choose photo source",
        incompleteProfile: "Incomplete Profile",
        missingFields: "Please fill in the following fields: {{fields}}",
        editProfileTitle: "Edit Profile",

        // New translations for validation
        invalidPhone: "Invalid number",
        invalidPhoneMessage: "The number must start with +243 and have 13 characters total (ex: +243 81 234 5678)",
        invalidDate: "Invalid date",
        invalidDateMessage: "Please enter a complete date (DD/MM/YYYY)",
        phoneFormat: "Format: +243 XX XXX XXXX (13 characters)",
        dateFormat: "Format: DD/MM/YYYY",

        // Translations for edit fields
        editFullName: "Edit full name",
        editPhoneNumber: "Edit phone number",
        editBirthDate: "Edit birth date",
        editAddress: "Edit address",
        editIdentityNumber: "Edit document number",
        phonePlaceholder: "+243 XX XXX XXXX",
        datePlaceholder: "DD/MM/YYYY",
        permissionRequired: "Permission required",
        cameraPermissionMessage: "We need your permission to use the camera.",
        galleryPermissionMessage: "We need your permission to access your photos.",
        error: "Error",
        cameraError: "Unable to access camera.",
        galleryError: "Unable to access photo gallery.",

        // ==================== NOUVELLES TRADUCTIONS WALLET ====================
        wallet: {
          myWallet: "My Wallet",
          availableBalance: "Available Balance", 
          pendingBalance: "Pending",
          quickActions: "Quick Actions",
          recentTransactions: "Recent Transactions",
          seeAll: "See All",
          noTransactions: "No transactions yet",
          securityInfo: "Your money is secure and protected. Transactions are encrypted.",
          
          actions: {
            deposit: "Deposit",
            withdraw: "Withdraw",
            transfer: "Transfer", 
            history: "History",
            addMoney: "Add money",
            withdrawMoney: "Withdraw to account",
            transferMoney: "Send to contact",
            viewHistory: "View all transactions"
          },
          
          status: {
            completed: "Completed", 
            pending: "Pending",
            failed: "Failed"
          },
          
          transactions: {
            sale: "Product sale",
            purchase: "Purchase",
            refund: "Refund",
            withdrawal: "Withdrawal",
            deposit: "Deposit",
            transfer: "Transfer"
          }
        }
        
    }
  }
};

// Clé pour AsyncStorage
const LANGUAGE_STORAGE_KEY = 'imani-app-language';

// Fonction pour récupérer la langue sauvegardée
const getSavedLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage || 'fr'; // Français par défaut si rien de sauvegardé
  } catch (error) {
    console.error('Erreur lecture langue:', error);
    return 'fr'; // Fallback en français
  }
};

// Fonction pour changer de langue ET sauvegarder
export const changeAppLanguage = async (lng: string): Promise<void> => {
  try {
    // Sauvegarder la nouvelle langue
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    // Changer la langue dans i18n
    await i18n.changeLanguage(lng);
    console.log('✅ Langue changée et sauvegardée:', lng);
  } catch (error) {
    console.error('❌ Erreur sauvegarde langue:', error);
  }
};

// Initialiser i18n avec la langue sauvegardée
const initI18n = async () => {
  const savedLanguage = await getSavedLanguage();
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage, // Utilise la langue sauvegardée
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
    });
};

// Démarrer l'initialisation
initI18n();

export default i18n;