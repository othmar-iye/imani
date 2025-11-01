// lib/i18n.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {

        // CATEGORIE FILE
        categories: {
        clothing: "Vêtements",
        shoes: "Chaussures",
        accessories: "Accessoires",
        brands: "Marques & Créateurs",
        beauty: "Beauté & Parfums",
        home: "Maison & Déco",
        others: "Autres",
        sub: {
            women: "Femmes",
            men: "Hommes",
            children: "Enfants & Bébés",
            maternity: "Maternité",
            plusSize: "Grandes Tailles",
            sneakers: "Baskets & Sneakers",
            sandals: "Sandales & Tongs",
            boots: "Bottes & Bottines",
            heels: "Escarpins",
            flats: "Chaussures plates",
            bags: "Sacs",
            jewelry: "Bijoux",
            watches: "Montres",
            glasses: "Lunettes",
            scarves: "Écharpes & Foulards",
            hats: "Chapeaux & Casquettes",
            belts: "Ceintures",
            trendingBrands: "Marques Tendances",
            luxuryBrands: "Luxe & Créateurs",
            vintageBrands: "Marques Vintage",
            smallBrands: "Petites Marques",
            fragrances: "Parfums",
            makeup: "Maquillage",
            skincare: "Soins de la peau",
            haircare: "Soins des cheveux",
            hygiene: "Hygiène & Bien-être",
            decoration: "Décoration",
            homeLinens: "Linge de maison",
            art: "Art & Posters",
            lighting: "Luminaires",
            sports: "Sports & Loisirs",
            tech: "High-Tech",
            books: "Livres & Médias",
            toys: "Jouets & Jeux",
            creative: "Matériel Créatif"
        }
        },

        // Home Screen
        home: {
        welcome: "Bienvenue",
        searchPlaceholder: "Rechercher des produits...",
        cancel: "Annuler",
        summerSales: "Soldes d'Été",
        upToDiscount: "Jusqu'à 50% de réduction",
        discover: "Découvrir",
        categories: "Catégories",
        popularProducts: "Produits populaires",
        seeAll: "Tout voir",
        loading: "Chargement...",
        errorLoading: "Erreur de chargement",
        retry: "Réessayer",
        },

        // Profile Settings
        photoRequired: "Photo de profil requise",
        photoRequiredMessage: "Veuillez ajouter une photo de profil",
        saveError: "Erreur lors de la sauvegarde",
        profileUpdated: "Profil mis à jour avec succès",
        imageNotLoaded: "Image non chargée",
        saving: "Enregistrement...",
        noChanges: "Aucun changement",
        noChangesMessage: "Vous n'avez modifié aucune information. Aucune sauvegarde nécessaire.",

        // NOUVELLES TRADUCTIONS POUR CONDITIONS D'UTILISATION
        termsTitle: "Conditions d'utilisation",
        welcomeTerms: "Bienvenue sur {{appName}}. En utilisant notre application, vous acceptez les présentes conditions d'utilisation. Veuillez les lire attentivement.",
        acceptanceTitle: "Acceptation des conditions",
        acceptanceText: "En accédant et en utilisant {{appName}}, vous acceptez d'être lié par ces conditions d'utilisation et par notre politique de confidentialité. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.",
        userAccountTitle: "Compte utilisateur",
        userAccountText1: "Pour utiliser certaines fonctionnalités de {{appName}}, vous devez créer un compte. Vous êtes responsable de :",
        userAccountItem1: "Maintenir la confidentialité de vos identifiants",
        userAccountItem2: "Toutes les activités effectuées via votre compte",
        userAccountItem3: "Fournir des informations exactes et à jour",
        allowedUseTitle: "Utilisation autorisée",
        allowedUseText1: "Vous vous engagez à utiliser {{appName}} uniquement à des fins légales et conformément à ces conditions. Vous ne devez pas :",
        allowedUseItem1: "Violer les droits de propriété intellectuelle",
        allowedUseItem2: "Publier du contenu illégal ou nuisible",
        allowedUseItem3: "Perturber le fonctionnement de l'application",
        allowedUseItem4: "Tenter d'accéder à des comptes non autorisés",
        userContentTitle: "Contenu des utilisateurs",
        userContentText: "Vous conservez tous les droits sur le contenu que vous publiez sur {{appName}}. En publiant du contenu, vous nous accordez une licence mondiale pour l'utiliser, le reproduire et l'afficher dans le cadre du fonctionnement de l'application.",
        transactionsTitle: "Transactions et paiements",
        transactionsText: "{{appName}} facilite les transactions entre acheteurs et vendeurs. Nous ne sommes pas responsables des litiges entre utilisateurs. Les paiements sont traités par des prestataires tiers sécurisés.",
        intellectualPropertyTitle: "Propriété intellectuelle",
        intellectualPropertyText: "Tous les droits de propriété intellectuelle relatifs à l'application {{appName}}, y compris le code source, le design, et le contenu, sont la propriété exclusive de {{appName}} ou de ses concédants de licence.",
        liabilityTitle: "Limitation de responsabilité",
        liabilityText: "{{appName}} est fourni \"tel quel\". Nous ne garantissons pas que l'application sera ininterrompue ou exempte d'erreurs. Dans la mesure permise par la loi, notre responsabilité est limitée.",
        terminationTitle: "Résiliation",
        terminationText: "Nous pouvons résilier ou suspendre votre accès à {{appName}} à tout moment, sans préavis, si vous violez ces conditions d'utilisation.",
        modificationsTitle: "Modifications des conditions",
        modificationsText: "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication dans l'application. Votre utilisation continue de {{appName}} constitue votre acceptation des modifications.",
        governingLawTitle: "Loi applicable",
        governingLawText: "Ces conditions sont régies et interprétées conformément aux lois de la République Démocratique du Congo. Tout litige sera soumis à la juridiction compétente des tribunaux de Lubumbashi.",
        contactUsTitle: "Nous contacter",
        contactUsText1: "Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à :",
        termsFooter: "En utilisant {{appName}}, vous reconnaissez avoir lu, compris et accepté ces conditions d'utilisation.",

      // NOUVELLES TRADUCTIONS POUR POLITIQUE DE CONFIDENTIALITÉ
        privacyTitle: "Politique de confidentialité",
        lastUpdated: "Dernière mise à jour : Décembre 2025",
        privacyIntro: "{{appName}} (\"nous\", \"notre\", \"nos\") s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.",
        infoCollectionTitle: "Informations que nous collectons",
        infoCollectionText: "Nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse e-mail, numéro de téléphone, et les informations de votre profil lorsque vous créez un compte sur {{appName}}.",
        infoUsageTitle: "Utilisation des informations",
        infoUsageText1: "Nous utilisons vos informations pour :",
        infoUsageItem1: "Fournir et améliorer nos services",
        infoUsageItem2: "Personnaliser votre expérience utilisateur",
        infoUsageItem3: "Communiquer avec vous concernant votre compte",
        infoUsageItem4: "Assurer la sécurité de notre plateforme",
        infoSharingTitle: "Partage des informations",
        infoSharingText: "Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles à des tiers sans votre consentement, sauf dans les cas prévus par la loi ou pour fournir nos services.",
        dataProtectionTitle: "Protection des données",
        dataProtectionText: "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations personnelles contre tout accès non autorisé, modification, divulgation ou destruction.",
        yourRightsTitle: "Vos droits",
        yourRightsText: "Vous avez le droit d'accéder à vos informations personnelles, de les rectifier, de les supprimer, ou de vous opposer à leur traitement. Vous pouvez exercer ces droits en nous contactant à privacy@imani.com.",
        cookiesTitle: "Cookies et technologies similaires",
        cookiesText: "Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser l'utilisation de notre application et personnaliser le contenu.",
        dataRetentionTitle: "Conservation des données",
        dataRetentionText: "Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales.",
        policyChangesTitle: "Modifications de la politique",
        policyChangesText: "Nous pouvons modifier cette politique de confidentialité. Nous vous informerons de tout changement important en publiant la nouvelle politique sur cette page.",
        contactPrivacyTitle: "Nous contacter",
        contactPrivacyText1: "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :",
        email: "Email",
        website: "Site web",
        privacyFooter: "En utilisant {{appName}}, vous acceptez les termes de cette politique de confidentialité.",

      // NOUVELLES TRADUCTIONS POUR LES ONGLETS
      tabs: {
        home: "Accueil",
        favorites: "Favoris", 
        sell: "Vendre",
        chat: "Messages",
        profile: "Profil",
      },

      // NOUVELLES TRADUCTIONS POUR ABOUT SCREEN
      appTagline: "Votre marketplace de confiance",
      ourMission: "Notre Mission",
      missionDescription: "{{appName}} connecte acheteurs et vendeurs dans une expérience sécurisée et intuitive. Nous simplifions le commerce en ligne avec une plateforme fiable et performante.",
      ourStrengths: "Nos Atouts",
      secure: "Sécurisé",
      secureDesc: "Transactions protégées",
      fast: "Rapide", 
      fastDesc: "Interface fluide",
      reliable: "Fiable",
      reliableDesc: "Communauté de confiance",
      quality: "Qualité",
      qualityDesc: "Expérience optimale",
      contact: "Contact",
      location: "Lubumbashi, RDC",
      madeWithLove: "Fait avec ❤️",

      // États généraux
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      retry: "Réessayer",
      save: "Enregistrer",
      okText: "OK",
      
      // Navigation et menus
      logoutTitle: "Déconnexion",
      logoutMessage: "Êtes-vous sûr de vouloir vous déconnecter ?",
      logout: "Se déconnecter",
      logoutMenu: "Se déconnecter",
      settings: "Paramètres",
      about: "À propos",
      version: "Version",
      
      // Profil utilisateur
      member: "Membre",
      verifiedSeller: "Vendeur vérifié",
      editProfile: "Modifier profil",
      editProfileTitle: "Modifier le profil",
      fullName: "Nom Complet",
      enterFullName: "Votre nom complet",
      
      // Sections du profil
      myItems: "Mes articles",
      myWallet: "Mon portefeuille",
      myOrders: "Mes commandes",
      myConversations: "Mes discussions",
      termsOfService: "Conditions d'utilisation",
      privacyPolicy: "Politique de confidentialité",
      
      // Informations personnelles
      personalInfo: "Informations personnelles",
      phoneNumber: "Numéro de téléphone",
      birthDate: "Date de naissance",
      locationInfo: "Localisation",
      address: "Adresse",
      enterAddress: "Votre adresse complète",
      city: "Ville",
      
      // Vérification d'identité
      identityVerification: "Vérification d'identité",
      identityType: "Type de pièce d'identité",
      voterCard: "Carte d'électeur",
      passport: "Passeport",
      drivingLicense: "Permis de conduire",
      identityNumber: "Numéro de la pièce",
      enterIdentityNumber: "Numéro de la pièce",
      uploadIdentityDocument: "Photo de la pièce d'identité",
      uploadProfilePicture: "Photo de profil",
      profilePicture: "Photo de profil",
      
      // Sélecteurs
      selectCity: "Choisir une ville",
      selectIdentityType: "Type de pièce d'identité",
      notSelected: "Non sélectionné",
      
      // États de vérification
      verificationPending: "Profil en cours de vérification",
      verificationRejected: "Profil rejeté",
      verificationInProgress: "Vérification en cours",
      verificationTimeMessage: "Votre demande de vérification est en cours de traitement. Cela peut prendre 24 à 48 heures. Vous serez notifié dès que votre profil sera vérifié.",
      verificationRejectedMessage: "Votre demande de vérification a été rejetée. Veuillez vérifier vos documents et soumettre à nouveau votre profil.",
      resubmitProfile: "Soumettre à nouveau",
      verificationInfo: "La vérification de votre identité est nécessaire pour devenir vendeur sur {{appName}}. Le traitement peut prendre 24-48h.",
      
      // Statistiques
      items: "Articles",
      sales: "Ventes",
      ratings: "Évaluations",
      
      // Upload d'images
      tapToUpload: "Appuyez pour ajouter",
      addPhoto: "Ajouter une photo",
      takePhoto: "Prendre une photo",
      chooseFromGallery: "Choisir depuis la galerie",
      chooseSource: "Choisir la source de la photo",
      uploaded: "✓",
      upload: "+",
      
      // Validation et erreurs
      invalidPhone: "Numéro invalide",
      invalidPhoneMessage: "Le numéro doit commencer par +243 et avoir 13 caractères au total (ex: +243 81 234 5678)",
      invalidDate: "Date invalide",
      invalidDateMessage: "Veuillez entrer une date complète (JJ/MM/AAAA)",
      phoneFormat: "Format: +243 XX XXX XXXX (13 caractères)",
      dateFormat: "Format: JJ/MM/AAAA",
      incompleteProfile: "Profil incomplet",
      missingFields: "Veuillez remplir les champs suivants: {{fields}}",
      errorLoadingProfile: "Erreur lors du chargement du profil",
      
      // Champs d'édition
      editFullName: "Modifier le nom complet",
      editPhoneNumber: "Modifier le numéro de téléphone",
      editBirthDate: "Modifier la date de naissance",
      editAddress: "Modifier l'adresse",
      editIdentityNumber: "Modifier le numéro de pièce",
      phonePlaceholder: "+243 XX XXX XXXX",
      datePlaceholder: "JJ/MM/AAAA",
      
      // Permissions
      permissionRequired: "Permission requise",
      cameraPermissionMessage: "Nous avons besoin de votre permission pour utiliser la caméra.",
      galleryPermissionMessage: "Nous avons besoin de votre permission pour accéder à vos photos.",
      cameraError: "Impossible d'accéder à la caméra.",
      galleryError: "Impossible d'accéder à la galerie photos.",
      
      // Wallet
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

        // CATEGORIE FILE
        categories: {
        clothing: "Clothing",
        shoes: "Shoes",
        accessories: "Accessories",
        brands: "Brands & Designers",
        beauty: "Beauty & Fragrances",
        home: "Home & Decor",
        others: "Others",
        sub: {
            women: "Women",
            men: "Men",
            children: "Children & Babies",
            maternity: "Maternity",
            plusSize: "Plus Size",
            sneakers: "Sneakers & Athletic",
            sandals: "Sandals & Flip Flops",
            boots: "Boots & Booties",
            heels: "Heels",
            flats: "Flats",
            bags: "Bags",
            jewelry: "Jewelry",
            watches: "Watches",
            glasses: "Glasses",
            scarves: "Scarves & Shawls",
            hats: "Hats & Caps",
            belts: "Belts",
            trendingBrands: "Trending Brands",
            luxuryBrands: "Luxury & Designers",
            vintageBrands: "Vintage Brands",
            smallBrands: "Small Brands",
            fragrances: "Fragrances",
            makeup: "Makeup",
            skincare: "Skincare",
            haircare: "Hair Care",
            hygiene: "Hygiene & Wellness",
            decoration: "Decoration",
            homeLinens: "Home Linens",
            art: "Art & Posters",
            lighting: "Lighting",
            sports: "Sports & Leisure",
            tech: "High-Tech",
            books: "Books & Media",
            toys: "Toys & Games",
            creative: "Creative Materials"
        }
        },

        // Home Screen
        home: {
        welcome: "Welcome",
        searchPlaceholder: "Search products...",
        cancel: "Cancel",
        summerSales: "Summer Sales",
        upToDiscount: "Up to 50% off",
        discover: "Discover",
        categories: "Categories",
        popularProducts: "Popular Products",
        seeAll: "See All",
        loading: "Loading...",
        errorLoading: "Error loading",
        retry: "Retry",
        },

        // Profile Settings
        photoRequired: "Profile Photo Required",
        photoRequiredMessage: "Please add a profile photo",
        saveError: "Error saving profile",
        profileUpdated: "Profile updated successfully",
        imageNotLoaded: "Image not loaded",
        saving: "Saving...",
        noChanges: "No changes",
        noChangesMessage: "You haven't made any changes. No save needed.",

        // NEW TRANSLATIONS FOR TERMS OF SERVICE
        termsTitle: "Terms of Service",
        welcomeTerms: "Welcome to {{appName}}. By using our application, you agree to these terms of service. Please read them carefully.",
        acceptanceTitle: "Acceptance of Terms",
        acceptanceText: "By accessing and using {{appName}}, you agree to be bound by these terms of service and our privacy policy. If you do not accept these terms, please do not use our application.",
        userAccountTitle: "User Account",
        userAccountText1: "To use certain features of {{appName}}, you must create an account. You are responsible for:",
        userAccountItem1: "Maintaining the confidentiality of your credentials",
        userAccountItem2: "All activities conducted through your account",
        userAccountItem3: "Providing accurate and up-to-date information",
        allowedUseTitle: "Permitted Use",
        allowedUseText1: "You agree to use {{appName}} only for lawful purposes and in accordance with these terms. You must not:",
        allowedUseItem1: "Violate intellectual property rights",
        allowedUseItem2: "Post illegal or harmful content",
        allowedUseItem3: "Disrupt the application's operation",
        allowedUseItem4: "Attempt to access unauthorized accounts",
        userContentTitle: "User Content",
        userContentText: "You retain all rights to the content you post on {{appName}}. By posting content, you grant us a worldwide license to use, reproduce, and display it as part of the application's operation.",
        transactionsTitle: "Transactions and Payments",
        transactionsText: "{{appName}} facilitates transactions between buyers and sellers. We are not responsible for disputes between users. Payments are processed by secure third-party providers.",
        intellectualPropertyTitle: "Intellectual Property",
        intellectualPropertyText: "All intellectual property rights related to the {{appName}} application, including source code, design, and content, are the exclusive property of {{appName}} or its licensors.",
        liabilityTitle: "Limitation of Liability",
        liabilityText: "{{appName}} is provided \"as is\". We do not guarantee that the application will be uninterrupted or error-free. To the extent permitted by law, our liability is limited.",
        terminationTitle: "Termination",
        terminationText: "We may terminate or suspend your access to {{appName}} at any time, without notice, if you violate these terms of service.",
        modificationsTitle: "Modifications to Terms",
        modificationsText: "We reserve the right to modify these terms at any time. Changes will take effect upon their publication in the application. Your continued use of {{appName}} constitutes your acceptance of the changes.",
        governingLawTitle: "Governing Law",
        governingLawText: "These terms are governed and interpreted in accordance with the laws of the Democratic Republic of Congo. Any dispute will be submitted to the competent jurisdiction of the courts of Lubumbashi.",
        contactUsTitle: "Contact Us",
        contactUsText1: "For any questions regarding these terms of service, please contact us at:",
        termsFooter: "By using {{appName}}, you acknowledge that you have read, understood, and accepted these terms of service.",

        // NEW TRANSLATIONS FOR PRIVACY POLICY
        privacyTitle: "Privacy Policy",
        lastUpdated: "Last updated: December 2025",
        privacyIntro: "{{appName}} (\"we\", \"our\", \"us\") is committed to protecting your privacy. This privacy policy explains how we collect, use, and protect your personal information.",
        infoCollectionTitle: "Information We Collect",
        infoCollectionText: "We collect information you provide directly to us, such as your name, email address, phone number, and profile information when you create an account on {{appName}}.",
        infoUsageTitle: "How We Use Information",
        infoUsageText1: "We use your information to:",
        infoUsageItem1: "Provide and improve our services",
        infoUsageItem2: "Personalize your user experience",
        infoUsageItem3: "Communicate with you about your account",
        infoUsageItem4: "Ensure the security of our platform",
        infoSharingTitle: "Information Sharing",
        infoSharingText: "We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law or to provide our services.",
        dataProtectionTitle: "Data Protection",
        dataProtectionText: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        yourRightsTitle: "Your Rights",
        yourRightsText: "You have the right to access, correct, delete, or object to the processing of your personal information. You can exercise these rights by contacting us at privacy@imani.com.",
        cookiesTitle: "Cookies and Similar Technologies",
        cookiesText: "We use cookies and similar technologies to enhance your experience, analyze our app usage, and personalize content.",
        dataRetentionTitle: "Data Retention",
        dataRetentionText: "We retain your personal information for as long as necessary to provide our services and comply with our legal obligations.",
        policyChangesTitle: "Policy Changes",
        policyChangesText: "We may modify this privacy policy. We will notify you of any significant changes by posting the new policy on this page.",
        contactPrivacyTitle: "Contact Us",
        contactPrivacyText1: "If you have questions about this privacy policy, please contact us at:",
        email: "Email",
        website: "Website",
        privacyFooter: "By using {{appName}}, you agree to the terms of this privacy policy.",

      // NEW TRANSLATIONS FOR TABS
      tabs: {
        home: "Home",
        favorites: "Favorites",
        sell: "Sell", 
        chat: "Messages",
        profile: "Profile",
      },

      // NEW TRANSLATIONS FOR ABOUT SCREEN
      appTagline: "Your trusted marketplace",
      ourMission: "Our Mission",
      missionDescription: "{{appName}} connects buyers and sellers in a secure and intuitive experience. We simplify online commerce with a reliable and high-performing platform.",
      ourStrengths: "Our Strengths",
      secure: "Secure",
      secureDesc: "Protected transactions",
      fast: "Fast",
      fastDesc: "Smooth interface", 
      reliable: "Reliable",
      reliableDesc: "Trusted community",
      quality: "Quality",
      qualityDesc: "Optimal experience",
      contact: "Contact",
      location: "Lubumbashi, DRC",
      madeWithLove: "Made with ❤️",

      // General states
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      retry: "Retry",
      save: "Save",
      okText: "OK",
      
      // Navigation and menus
      logoutTitle: "Logout",
      logoutMessage: "Are you sure you want to log out?",
      logout: "Log out",
      logoutMenu: "Log out",
      settings: "Settings",
      about: "About",
      version: "Version",
      
      // User profile
      member: "Member",
      verifiedSeller: "Verified Seller",
      editProfile: "Edit Profile",
      editProfileTitle: "Edit Profile",
      fullName: "Full Name",
      enterFullName: "Your full name",
      
      // Profile sections
      myItems: "My Items",
      myWallet: "My Wallet",
      myOrders: "My Orders",
      myConversations: "My Conversations",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      
      // Personal information
      personalInfo: "Personal Information",
      phoneNumber: "Phone Number",
      birthDate: "Birth Date",
      locationInfo: "Location",
      address: "Address",
      enterAddress: "Your complete address",
      city: "City",
      
      // Identity verification
      identityVerification: "Identity Verification",
      identityType: "Identity Document Type",
      voterCard: "Voter Card",
      passport: "Passport",
      drivingLicense: "Driving License",
      identityNumber: "Document Number",
      enterIdentityNumber: "Document number",
      uploadIdentityDocument: "Identity Document Photo",
      uploadProfilePicture: "Profile Picture",
      profilePicture: "Profile Picture",
      
      // Selectors
      selectCity: "Select City",
      selectIdentityType: "Identity Document Type",
      notSelected: "Not selected",
      
      // Verification states
      verificationPending: "Profile under review",
      verificationRejected: "Profile rejected",
      verificationInProgress: "Verification in progress",
      verificationTimeMessage: "Your verification request is being processed. This may take 24 to 48 hours. You will be notified once your profile is verified.",
      verificationRejectedMessage: "Your verification request has been rejected. Please check your documents and resubmit your profile.",
      resubmitProfile: "Resubmit",
      verificationInfo: "Identity verification is required to become a seller on {{appName}}. Processing may take 24-48 hours.",
      
      // Statistics
      items: "Items",
      sales: "Sales",
      ratings: "Ratings",
      
      // Image upload
      tapToUpload: "Tap to upload",
      addPhoto: "Add Photo",
      takePhoto: "Take Photo",
      chooseFromGallery: "Choose from Gallery",
      chooseSource: "Choose photo source",
      uploaded: "✓",
      upload: "+",
      
      // Validation and errors
      invalidPhone: "Invalid number",
      invalidPhoneMessage: "The number must start with +243 and have 13 characters total (ex: +243 81 234 5678)",
      invalidDate: "Invalid date",
      invalidDateMessage: "Please enter a complete date (DD/MM/YYYY)",
      phoneFormat: "Format: +243 XX XXX XXXX (13 characters)",
      dateFormat: "Format: DD/MM/YYYY",
      incompleteProfile: "Incomplete Profile",
      missingFields: "Please fill in the following fields: {{fields}}",
      errorLoadingProfile: "Error loading profile",
      
      // Edit fields
      editFullName: "Edit full name",
      editPhoneNumber: "Edit phone number",
      editBirthDate: "Edit birth date",
      editAddress: "Edit address",
      editIdentityNumber: "Edit document number",
      phonePlaceholder: "+243 XX XXX XXXX",
      datePlaceholder: "DD/MM/YYYY",
      
      // Permissions
      permissionRequired: "Permission required",
      cameraPermissionMessage: "We need your permission to use the camera.",
      galleryPermissionMessage: "We need your permission to access your photos.",
      cameraError: "Unable to access camera.",
      galleryError: "Unable to access photo gallery.",
      
      // Wallet
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