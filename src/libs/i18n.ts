// lib/i18n.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {

        // Checkout
        checkout: {
            title: "Paiement",
            yourOrder: "Votre commande",
            invoiceDetails: "Détails de la facture",
            seller: "Vendeur",
            subtotal: "Sous-total",
            deliveryFee: "Frais de livraison",
            platformFee: "Frais de plateforme",
            toPay: "À Payer",
            avoidCancellation: "Évitez toute annulation de commande",
            paymentMethod: "Méthode de paiement",
            pay: "Payer",
            
            // Formulaires de paiement
            cardInformation: "Informations de carte",
            cardName: "Nom sur la carte",
            cardNamePlaceholder: "Maksudur Rhaman",
            cardNumber: "Numéro de carte",
            cardNumberPlaceholder: "2050 1950 2033 724",
            expiryDate: "Date d'expiration",
            expiryDatePlaceholder: "MM/AA",
            cvv: "CVV",
            cvvPlaceholder: "123",
            
            // Formulaire mobile
            phoneNumber: "Numéro de téléphone",
            yourNumber: "Votre numéro",
            phonePlaceholder: "+243 XX XXX XXXX",
            mobileConfirmation: "Vous recevrez une demande de confirmation sur votre mobile"
        },
        delete: "Supprimer",
        // ===== NOUVELLES TRADUCTIONS NOTIFICATIONS =====
        notifications: {

            deleteTitle: "Supprimer la notification",
            deleteMessage: "Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.",
            

            errorLoading: "Erreur lors du chargement des notifications",
            refreshError: "Impossible de rafraîchir les notifications",
            
            // Messages pour le banner de nouvelles notifications (si vous l'utilisez encore)
            newNotifications: {
                title: "Nouvelles notifications",
                message: "{{count}} nouvelle notification",
                message_plural: "{{count}} nouvelles notifications",
                view: "Voir",
            },

            newDataAvailable: "Nouvelles données disponibles",
            syncNewData: "Synchroniser les nouvelles données",
            ignore: "Ignorer",
            syncing: "Synchronisation en cours...",
            
            // Messages du banner de synchronisation
            syncBanner: {
                title: "Nouvelles notifications disponibles",
                message: "{{count}} nouvelle notification reçue",
                message_plural: "{{count}} nouvelles notifications reçues",
                syncButton: "Actualiser",
                ignoreButton: "Ignorer"
            },
            
            // États de synchronisation
            syncStates: {
                syncing: "Mise à jour des notifications...",
                success: "Notifications mises à jour",
                error: "Erreur de synchronisation",
            },

            title: "Notifications",
            lireTout: "Lire tout",
            markAllRead: "Tout marquer comme lu",
            // Statistiques
            total: "Total",
            unread: "Non lues",
            // États vides
            emptyTitle: "Aucune notification",
            emptySubtitle: "Vous serez notifié des nouvelles activités ici",
            
            // Types de notifications
            types: {
                system: "Système",
                seller: "Vendeur",
                product: "Produit", 
                message: "Message",
                promotion: "Promotion"
            },
            // Formatage du temps
            time: {
                justNow: "À l'instant",
                minutesAgo: "Il y a {{count}} min",
                hoursAgo: "Il y a {{count}}h",
                daysAgo: "Il y a {{count}} jour",
                daysAgo_plural: "Il y a {{count}} jours"
            },
            // Messages de notification (doivent correspondre à votre service)
            messages: {
                welcome: {
                    title: "🎉 Bienvenue sur Imani !",
                    message: "Votre compte a été créé avec succès. Commencez à explorer notre marketplace."
                },
                sellerSubmission: {
                    title: "📋 Demande de vendeur soumise",
                    message: "Votre demande pour devenir vendeur a été reçue. Notre équipe la traitera sous 24-48h."
                },
                sellerApproved: {
                    title: "✅ Félicitations ! Vous êtes maintenant vendeur",
                    message: "Votre demande a été approuvée. Vous pouvez maintenant publier des annonces."
                },
                sellerRejected: {
                    title: "❌ Demande de vendeur rejetée",
                    message: "Votre demande nécessite des modifications. Consultez vos emails pour plus de détails."
                },
                productPublished: {
                    title: "📦 Votre article a été publié !",
                    message: "\"{{productName}}\" est maintenant visible par tous les acheteurs."
                },
                profileCompleted: {
                    title: "✅ Profil complété avec succès !",
                    message: "Vos informations ont été sauvegardées. Votre profil est maintenant actif et visible."
                },
                passwordReset: {
                    title: "🔐 Mot de passe mis à jour",
                    message: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
                },
                productApproved: {
                    title: "✅ Votre article a été approuvé !",
                    message: "\"{{productName}}\" est maintenant publié et visible par tous les acheteurs."
                },
                productRejected: {
                    title: "❌ Article non approuvé",
                    message: "\"{{productName}}\" n'a pas été approuvé. Raison : {{rejectionReason}}"
                },
                productSubmitted: {
                    title: "📋 Article soumis pour validation",
                    message: "Votre article \"{{productName}}\" a été soumis avec succès. Notre équipe le vérifiera sous 24-48h."
                },
            }
        },

        // NETWORK CHECK
        network: {
            checkConnection: "📡 Vérifiez votre connexion internet",
            connectionRestored: "✅ Connexion rétablie",
        },

        languageChanged: "Langue changée",
        languageChangedMessage: "La langue de l'application a été modifiée",
        languageReset: "Langue réinitialisée",
        languageResetMessage: "La langue a été réinitialisée à la détection automatique",
        currentLanguage: "Langue actuelle",
        resetToAuto: "Détection automatique",

        // CONFIRMED PASSWORD
        passwordConfirmed: {
            titleLine1: "Mot de passe",
            titleLine2: "changé avec succès",
            subtitle: "Ton mot de passe a été mis à jour avec succès. Tu peux maintenant te connecter avec ton nouveau mot de passe.",
            loginButton: "Se connecter",
        },

        // NEW PASSWORD
        yourAccount: "votre compte",
        passwordNew: {
            title: "Nouveau mot de passe",
            subtitle: "Créez un nouveau mot de passe pour {{email}}.",
            newPasswordPlaceholder: "Nouveau mot de passe",
            confirmPasswordPlaceholder: "Confirmer le mot de passe",
            updateButton: "Mettre à jour le mot de passe",
            updating: "Mise à jour...",
            devMode: "Mode développement activé",
            errors: {
                requiredFields: "Veuillez remplir tous les champs",
                passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
                passwordsDontMatch: "Les mots de passe ne correspondent pas",
                genericError: "❌ Une erreur est survenue lors de la mise à jour du mot de passe",
            },
            success: {
                standard: "✅ Mot de passe mis à jour avec succès",
                dev: "✅ [DEV] Mot de passe mis à jour (simulation)",
            }
        },

        // FORGOT PASSWORD
        passwordForgot: {
            title: "Mot de passe oublié",
            subtitle: "Entrez votre adresse email pour réinitialiser votre mot de passe.",
            emailPlaceholder: "Votre adresse email",
            resetButton: "Réinitialiser le mot de passe",
            resetting: "Vérification...",
            backToLogin: "Retour à la connexion",
            devMode: "Mode développement : Redirection directe",
            errors: {
            requiredEmail: "Veuillez entrer votre adresse email",
            invalidEmail: "Veuillez entrer une adresse email valide",
            emailNotFound: "❌ Aucun compte trouvé avec cette adresse email",
            genericError: "Une erreur est survenue lors de la réinitialisation",
            }
        },

        // WELCOME
        welcome: {
            title: "Donne une nouvelle vie à tes objets",
            subtitle: "Achète et vends facilement, tout depuis ton téléphone.",
            registerButton: "Inscription",
            loginButton: "Connexion",
        },

        // REGISTER 
        register: {
            title: "Rejoins-nous",
            subtitle: "Crée ton compte et commence à donner une nouvelle vie à tes objets.",
            fullName: "Nom complet",
            fullNamePlaceholder: "Nom complet",
            email: "Email",
            emailPlaceholder: "Email",
            password: "Mot de passe",
            passwordPlaceholder: "Mot de passe",
            confirmPassword: "Confirmer le mot de passe",
            confirmPasswordPlaceholder: "Confirmer le mot de passe",
            registerButton: "S'inscrire",
            registering: "Inscription...",
            loginLink: "Déjà un compte ? Se connecter",
            errors: {
            requiredFields: "Veuillez remplir tous les champs",
            passwordsDontMatch: "Les mots de passe ne correspondent pas",
            passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
            accountExists: "Un compte avec cet email existe déjà. Veuillez vous connecter.",
            genericError: "Une erreur est survenue lors de l'inscription",
            registrationError: "Erreur d'inscription"
            },
            success: {
            title: "Inscription réussie !",
            message: "Votre compte a été créé avec succès."
            },
            validation: {
            passwordsMismatch: "❌ Les mots de passe ne correspondent pas",
            passwordMinLength: "⚠️ 6 caractères minimum"
            }
        },

        // LOGIN
        login: {
            title: "Heureux de te revoir",
            subtitle: "Accède à ton compte et reprends tes échanges en toute simplicité.",
            email: "Email",
            emailPlaceholder: "Email",
            password: "Mot de passe",
            passwordPlaceholder: "Mot de passe",
            forgotPassword: "Mot de passe oublié ?",
            loginButton: "Se connecter",
            loggingIn: "Connexion...",
            createAccount: "Créez un nouveau compte",
            errors: {
            requiredFields: "Veuillez remplir tous les champs",
            invalidCredentials: "❌ Email ou mot de passe incorrect",
            emailNotConfirmed: "❌ Veuillez confirmer votre email avant de vous connecter",
            genericError: "❌ Une erreur est survenue lors de la connexion",
            }
        },

        // NOUVELLES TRADUCTIONS POUR SETTINGS
        appearance: "Apparence",
        languageRegion: "Langue et région",
        language: 'Langue',
        theme: 'Thème',
        security: "Sécurité",
        privacy: "Confidentialité",
        support: "Support",
        
        // Thème
        chooseTheme: "Choisir un thème",
        selectTheme: "Sélectionnez votre thème préféré",
        system: "Système",
        light: "Clair", 
        dark: "Sombre",
        
        // Langue
        chooseLanguage: "Choisir la langue",
        selectLanguage: "Sélectionnez votre langue",
        french: "Français",
        english: "Anglais",
        
        // Notifications
        notificationsName: "Notifications",
        pushNotifications: "Notifications push",
        
        // Sécurité
        changePassword: "Changer le mot de passe",
        
        // Confidentialité
        deleteHistory: "Supprimer l'historique",
        downloadData: "Télécharger mes données",
        
        // Support
        helpCenter: "Centre d'aide",
        reportIssue: "Signaler un problème",
        rateApp: "Évaluer l'application",
        
        // Messages de confirmation
        deleteHistoryTitle: "Supprimer l'historique",
        deleteHistoryMessage: "Êtes-vous sûr de vouloir supprimer tout votre historique ? Cette action est irréversible.",
        
        // Changement de mot de passe
        currentPassword: "Ancien mot de passe",
        newPassword: "Nouveau mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        changing: "Changement en cours...",
        change: "Changer",
        passwordChanged: "Mot de passe changé avec succès",
        passwordChangeError: "Erreur lors du changement de mot de passe",
        passwordsDontMatch: "Les mots de passe ne correspondent pas",
        passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
        fillAllFields: "Veuillez remplir tous les champs",
        
        // Téléchargement données
        downloadDataMessage: "Cette fonctionnalité vous permettra de télécharger toutes vos données personnelles.",
        
        // Évaluation app
        rateAppMessage: "Merci de soutenir notre application en la notant sur le store.",
        
        // Messages généraux
        updateError: "Erreur lors de la mise à jour",
        historyDeleted: "Historique supprimé avec succès",
        

        // MY ITEMS
        myItems: {
        title: "Mes articles",
        searchPlaceholder: "Rechercher un article...",
        
        // Statuts des articles
        status: {
            active: "Actif",
            sold: "Vendu", 
            pending: "En attente",
            rejected: "Rejeté",
            draft: "Brouillon"
        },
        
        // Actions dans le modal
        actions: {
            view: "Voir",
            edit: "Modifier", 
            delete: "Supprimer"
        },
        
        // Messages de suppression
        deleteTitle: "Supprimer l'article",
        deleteMessage: "Êtes-vous sûr de vouloir supprimer \"{{productName}}\" ?",
        
        // État vide
        empty: {
            title: "Aucun article",
            subtitle: "Les articles que vous publiez apparaîtront ici",
            addButton: "Ajouter un article"
        }
        },

        // ===== NOUVELLES TRADUCTIONS POUR L'ÉCRAN DE VENTE =====
        exitConfirmation: "Quitter la publication ?",
        discard: "Abandonner",
        saveDraft: "Enregistrer en brouillon",
        draftSaved: "Brouillon enregistré",
        draftSavedMessage: "Vos photos ont été enregistrées en brouillon.",
        exitConfirmationMessage: "Si vous quittez maintenant, vous perdrez les modifications apportées à cette publication.",
        becomeSeller: "Devenir vendeur",
        continue: "Continuer",
        add: "Ajouter",
        sell: {

            publicationSuccess: "Annonce soumise !",
            pendingAdminValidation: "Votre annonce a été soumise avec succès. Elle sera visible après validation par notre équipe.",
            missingFields: "Champs manquants",
            fillAllFields: "Veuillez remplir tous les champs obligatoires.",
            submitting: "Soumission...",
            submitAd: "Soumettre l'annonce",

            adminValidationInfo: "Votre annonce a été soumise avec succès. Elle sera visible après validation par notre équipe.",
            photosPreview: "Aperçu des photos",
            photosInfo: "Ces photos seront affichées dans votre annonce. La première image sera la photo principale.",

            detailsTitle: "Détails de l'annonce",
            basicInfo: "Informations de base",
            productName: "Nom du produit",
            productNamePlaceholder: "Ex: Montre Rolex Submariner",
            category: "Catégorie",
            chooseCategory: "Choisir une catégorie",
            subCategory: "Sous-catégorie",
            chooseSubCategory: "Sous-catégorie",
            subCategories: "Sous-catégories",
            price: "Prix",
            pricePlaceholder: "0.00",
            currency: "USD",
            description: "Description",
            detailedDescription: "Description détaillée",
            descriptionPlaceholder: "Décrivez votre produit en détail... (minimum 50 caractères)",
            conditionAndLocation: "État et localisation",
            productCondition: "État du produit",
            chooseCondition: "État du produit",
            location: "Localisation",
            chooseLocation: "Ville",
            publishAd: "Publier l'annonce",
            publishing: "Publication...",
            requiredFields: "Champs obligatoires",
            characters: "caractères",
            userNotConnected: "Utilisateur non connecté.",
            productPublished: "Votre produit a été publié avec succès.",
            publicationError: "Impossible de publier l'annonce. Veuillez réessayer.",

            newSale: "Nouvelle vente",
            photos: "Photos",
            addPhotos: "Ajouter des photos",
            maxPhotos: "Maximum 5 photos",
            
            addPhoto: "Ajouter une photo",
            takePhoto: "Prendre une photo",
            chooseFromGallery: "Choisir depuis la galerie",
            verificationRequired: "Vérification requise",
            mustBeVerifiedSeller: "Vous devez être un vendeur vérifié pour publier des annonces.",
            
            becomeSellerAction: "Devenir vendeur",
            becomeSellerMessage: "Pour vendre des posters, vous devez d'abord devenir vendeur vérifié.",
            loginRequired: "Connexion requise",
            loginToSell: "Veuillez vous connecter pour vendre des articles.",
            verificationInProgress: "Vérification en cours",
            verificationPendingMessage: "Votre profil vendeur est en cours de vérification. Cette opération peut prendre 24 à 48 heures.",
            checkStatus: "Vérifier le statut",
            profileRejected: "Profil rejeté",
            profileRejectedMessage: "Votre demande de vendeur a été rejetée. Veuillez vérifier vos documents et soumettre à nouveau votre profil.",
            resubmit: "Soumettre à nouveau",
            verificationRequiredMessage: "Vous devez vérifier votre profil pour vendre des articles sur l'application.",
            verifyProfile: "Vérifier mon profil",
            checkingStatus: "Vérification du statut...",
            statusCheckError: "Impossible de vérifier votre statut vendeur. Veuillez réessayer.",
            photoPermissionMessage: "Nous avons besoin de votre permission pour accéder à vos photos.",
            cameraPermissionMessage: "Nous avons besoin de votre permission pour utiliser la caméra.",
            galleryAccessError: "Impossible d'accéder à la galerie photos.",
            cameraAccessError: "Impossible d'accéder à la caméra."
        },

        // CATEGORY SCREEN - NOUVELLES TRADUCTIONS
        category: {
            description: "Découvrez nos produits {{category}} - {{count}} articles disponibles",
            products: "produits",
            noProducts: "Aucun produit trouvé dans cette catégorie",
            allProducts: "Tous les produits",
            exploreCategory: "Explorer {{category}}",
            productCount: "{{count}} produit disponible",
            productCount_plural: "{{count}} produits disponibles",
            loadingProducts: "Chargement des produits...",
            errorLoading: "Erreur lors du chargement des produits"
        },

        // PRODUCT DETAIL
        productDetail: {
            productNotFound: "Produit non trouvé",
            back: "Retour",
            gallery: "Galerie",
            description: "Description",
            securePayment: "Paiement sécurisé",
            responseRate: "Taux de réponse",
            responseTime: "Temps de réponse",
            fixedPrice: "Prix ferme",
            sales: "ventes",
            views: "vues",
            condition: "Condition",
            seller: "Vendeur",
            chatWithSeller: "Discuter avec le vendeur",
            buy: "Acheter",
            itemsSold: "articles vendus",
            verified: "Vérifié",
            
            // Tags d'information
            tags: {
                securePayment: "Paiement sécurisé",
                location: "Localisation",
                condition: "Condition"
            },
            
            // États du produit
            conditionTypes: {
                new: "Neuf",
                likeNew: "Comme neuf", 
                good: "Bon état",
                fair: "État correct"
            },
            
            // Messages de statut
            loading: "Chargement du produit...",
            error: "Erreur lors du chargement",
            
            // Actions
            share: "Partager",
            favorite: "Favori",
            unfavorite: "Retirer des favoris",
            
            // Galerie
            photoCount: "{{current}}/{{total}}",
            closeGallery: "Fermer la galerie"
        },

        // SALES
        sales: {
            title: "Soldes",
            discountTitle: "Économisez jusqu'à 50%",
            description: "Découvrez nos meilleures offres et promotions exclusives. Des réductions exceptionnelles sur des produits de qualité.",
            productCount: "{{count}} produit en promotion",
            productCount_plural: "{{count}} produits en promotion",
        },

        // FAVORIS
        favorites: {
            emptyTitle: "Aucun favori",
            emptySubtitle: "Les produits que vous ajoutez à vos favoris apparaîtront ici",
            count: "{{count}} produit sauvegardé",
            count_plural: "{{count}} produits sauvegardés",
            "emptyDatabase": {
                "title": "Boutique vide",
                "subtitle": "Il n'y a encore aucun produit dans l'application. Soyez le premier à vendre !",
                "sellFirstItem": "Vendre mon premier article",
                "becomeSeller": "Devenir vendeur"
            },
            "exploreProducts": "Découvrir des produits",
        },

        // CATEGORIES
        categories: {
            'Électronique': 'Électronique',
            'Habillement': 'Habillement', 
            'Auto': 'Auto',
            'Maison & Déco': 'Maison & Déco',
            'Sports & Loisirs': 'Sports & Loisirs',
            'Livres & Médias': 'Livres & Médias',
            'Autres': 'Autres',
            'Tous': 'Tous'
        },

        // RECHERCHE
        searchResults: {
            results: "Résultats de recherche",
            noResults: "Aucun résultat trouvé",
            noResultsFor: 'Aucun produit ne correspond à "{{query}}"',
            modifySearch: "Modifier la recherche",
            productsFound: "produit(s) trouvé(s)",
            resultsFor: 'Résultats pour "{{query}}"'
        },

        // FILTER SCREEN
        filters: {

            allProducts: "Tous les produits",
            savings: "Économie",
            noProductsFound: "Aucun produit trouvé",
            noProductsMatch: "Aucun produit ne correspond à vos critères de filtrage",
            results: "Résultats des filtres",
            modify: "Modifier",
            productsMatch: "Produits correspondant à vos critères",
            noProductsMatchFilters: "Aucun produit ne correspond à vos filtres",
            productsFound: "produit(s) trouvé(s)",
            modifyFilters: "Modifier les filtres",
            title: "Filtres",
            reset: "Réinitialiser",
            clearAll: "Tout effacer",
            apply: "Appliquer",
            
            location: {
                title: "Localisation",
                subtitle: "RD Congo",
                description: "Recherchez votre ville pour voir les annonces locales",
                searchPlaceholder: "Rechercher une ville...",
                citiesFound: "{{count}} ville(s) trouvée(s)",
                selectedCity: "Ville sélectionnée: {{city}}",
                popularCities: "Villes populaires"
            },
            
            categories: {
                title: "Catégories"
            },
            
            sort: {
                title: "Trier par",
                popular: "Populaire",
                newest: "Plus récent",
                priceLow: "Prix croissant",
                priceHigh: "Prix décroissant"
            },
            
            price: {
                title: "Fourchette de prix",
                lessThan50: "Moins de $50",
                "50to100": "$50-$100",
                "100to500": "$100-$500",
                moreThan500: "Plus de $500"
            },
            
            condition: {
                title: "Condition",
                new: "Neuf",
                likeNew: "Comme neuf",
                good: "Bon état",
                fair: "État correct"
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
            noResults: "Aucun résultat trouvé",
            
            // MODE BASE VIDE
            emptyDatabase: {
                title: "Bienvenue sur notre marché ! 🎉",
                subtitle: "Soyez parmi les premiers à découvrir et vendre sur notre plateforme. Le marché est tout neuf, à vous de le construire !",
                sellFirstItem: "Vendre mon premier article",
                becomeSeller: "Devenir vendeur",
                howItWorks: "Comment ça marche ?",
                searchEmptyTitle: "Le marché est encore vide",
                searchEmptySubtitle: "Soyez le premier à vendre quelque chose !",

                marketplaceEmpty: "Place de marché vide",
                beTheFirstToSell: "Soyez le premier à vendre et démarrez la communauté !",
                loginRequired: "Connexion requise",
                loginToSell: "Veuillez vous connecter pour vendre des articles.",
                login: "Se connecter",
                verificationInfo: "La vérification de votre identité est nécessaire pour devenir vendeur sur Imani.",
                verificationInProgress: "Vérification en cours",
                verificationTimeMessage: "Votre demande de vérification est en cours de traitement. Cela peut prendre 24 à 48 heures.",
                youWillBeNotified: "Vous serez notifié dès que votre profil sera vérifié",
                verificationRejected: "Profil rejeté",
                verificationRejectedMessage: "Votre demande de vérification a été rejetée. Veuillez vérifier vos documents et soumettre à nouveau votre profil.",
                resubmitProfile: "Soumettre à nouveau",
                startSellingToday: "Commencez à vendre dès aujourd'hui et développez votre business !",
            }
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
      myItemsName: "Mes articles",
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
      salesStat: "Ventes",
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

        // CHECKOUT
        checkout: {
            title: "Checkout",
            yourOrder: "Your Order",
            invoiceDetails: "Invoice Details",
            seller: "Seller",
            subtotal: "Subtotal",
            deliveryFee: "Delivery Fee",
            platformFee: "Platform Fee",
            toPay: "To Pay",
            avoidCancellation: "Avoid order cancellation",
            paymentMethod: "Payment Method",
            pay: "Pay",
            
            // Payment forms
            cardInformation: "Card Information",
            cardName: "Name on Card",
            cardNamePlaceholder: "Maksudur Rhaman",
            cardNumber: "Card Number",
            cardNumberPlaceholder: "2050 1950 2033 724",
            expiryDate: "Expiry Date",
            expiryDatePlaceholder: "MM/YY",
            cvv: "CVV",
            cvvPlaceholder: "123",
            
            // Mobile form
            phoneNumber: "Phone Number",
            yourNumber: "Your Number",
            phonePlaceholder: "+243 XX XXX XXXX",
            mobileConfirmation: "You will receive a confirmation request on your mobile",
        },
        delete: "Delete",
        // NOTIFICATIONS  =====
        notifications: {

            deleteTitle: "Delete notification",
            deleteMessage: "Are you sure you want to delete this notification? This action is irreversible.",
            
            cancel: "Cancel",

            errorLoading: "Error loading notifications",
            refreshError: "Unable to refresh notifications",
            
            // Messages for new notifications banner (if you still use it)
            newNotifications: {
                title: "New notifications",
                message: "{{count}} new notification",
                message_plural: "{{count}} new notifications",
                view: "View",
            },

            newDataAvailable: "New data available",
            syncNewData: "Sync new data", 
            ignore: "Ignore",
            syncing: "Syncing...",
            
            // Sync banner messages
            syncBanner: {
                title: "New notifications available",
                message: "{{count}} new notification received",
                message_plural: "{{count}} new notifications received",
                syncButton: "Refresh",
                ignoreButton: "Ignore"
            },
            
            // Sync states
            syncStates: {
                syncing: "Updating notifications...",
                success: "Notifications updated", 
                error: "Sync error",
            },

            title: "Notifications",
            lireTout: "Read all", 
            markAllRead: "Mark all as read",
            
            // Statistics
            total: "Total",
            unread: "Unread",
            
            // Empty states
            emptyTitle: "No notifications",
            emptySubtitle: "You'll be notified of new activities here",
            
            // Notification types
            types: {
                system: "System",
                seller: "Seller",
                product: "Product",
                message: "Message", 
                promotion: "Promotion"
            },
            
            // Time formatting
            time: {
                justNow: "Just now",
                minutesAgo: "{{count}} min ago",
                hoursAgo: "{{count}}h ago", 
                daysAgo: "{{count}} day ago",
                daysAgo_plural: "{{count}} days ago"
            },
            
            // Notification messages (must match your service)
            messages: {
                welcome: {
                    title: "🎉 Welcome to Imani!",
                    message: "Your account has been created successfully. Start exploring our marketplace."
                },
                sellerSubmission: {
                    title: "📋 Seller request submitted",
                    message: "Your request to become a seller has been received. Our team will process it within 24-48h."
                },
                sellerApproved: {
                    title: "✅ Congratulations! You are now a seller",
                    message: "Your request has been approved. You can now publish listings."
                },
                sellerRejected: {
                    title: "❌ Seller request rejected", 
                    message: "Your request requires modifications. Check your emails for more details."
                },
                productPublished: {
                    title: "📦 Your item has been published!",
                    message: "\"{{productName}}\" is now visible to all buyers."
                },
                profileCompleted: {
                    title: "✅ Profile completed successfully!",
                    message: "Your information has been saved. Your profile is now active and visible."
                },
                passwordReset: {
                    title: "🔐 Password updated",
                    message: "Your password has been reset successfully. You can now log in with your new password."
                },
                productApproved: {
                    title: "✅ Your item has been approved!",
                    message: "\"{{productName}}\" is now published and visible to all buyers."
                },
                productRejected: {
                    title: "❌ Item not approved", 
                    message: "\"{{productName}}\" was not approved. Reason: {{rejectionReason}}"
                },
                productSubmitted: {
                    title: "📋 Item submitted for review", 
                    message: "Your item \"{{productName}}\" has been successfully submitted. Our team will review it within 24-48h."
                },
            }
        },

        // NETWORK CHECK
        network: {
            checkConnection: "📡 Check your internet connection",
            connectionRestored: "✅ Connection restored",
        },

        languageChanged: "Language changed",
        languageChangedMessage: "The app language has been changed",
        languageReset: "Language reset",
        languageResetMessage: "Language has been reset to auto-detection",
        currentLanguage: "Current language",
        resetToAuto: "Auto-detection",

        // CONFIRMED PASSWORD
        passwordConfirmed: {
            titleLine1: "Password",
            titleLine2: "changed successfully",
            subtitle: "Your password has been updated successfully. You can now log in with your new password.",
            loginButton: "Log in",
        },

        // NEW PASSWORD
        yourAccount: "your account",
        passwordNew: {
            title: "New password",
            subtitle: "Create a new password for {{email}}.",
            newPasswordPlaceholder: "New password",
            confirmPasswordPlaceholder: "Confirm password",
            updateButton: "Update password",
            updating: "Updating...",
            devMode: "Development mode activated",
            errors: {
                requiredFields: "Please fill all fields",
                passwordTooShort: "Password must be at least 6 characters",
                passwordsDontMatch: "Passwords don't match",
                genericError: "❌ An error occurred while updating password",
            },
            success: {
                standard: "✅ Password updated successfully",
                dev: "✅ [DEV] Password updated (simulation)",
            }
        },

        // FORGOT PASSWORD
        passwordForgot: {
            title: "Forgot password",
            subtitle: "Enter your email address to reset your password.",
            emailPlaceholder: "Your email address",
            resetButton: "Reset password",
            resetting: "Checking...",
            backToLogin: "Back to login",
            devMode: "Development mode: Direct redirect",
            errors: {
            requiredEmail: "Please enter your email address",
            invalidEmail: "Please enter a valid email address",
            emailNotFound: "❌ No account found with this email address",
            genericError: "An error occurred during reset",
            }
        },

        // WELCOME
        welcome: {
            title: "Give new life to your items",
            subtitle: "Buy and sell easily, all from your phone.",
            registerButton: "Sign up",
            loginButton: "Log in",
        },

        // REGISTER
        register: {
            title: "Join us",
            subtitle: "Create your account and start giving new life to your items.",
            fullName: "Full name",
            fullNamePlaceholder: "Full name",
            email: "Email",
            emailPlaceholder: "Email",
            password: "Password",
            passwordPlaceholder: "Password",
            confirmPassword: "Confirm password",
            confirmPasswordPlaceholder: "Confirm password",
            registerButton: "Sign up",
            registering: "Signing up...",
            loginLink: "Already have an account? Log in",
            errors: {
            requiredFields: "Please fill all fields",
            passwordsDontMatch: "Passwords don't match",
            passwordTooShort: "Password must be at least 6 characters",
            accountExists: "An account with this email already exists. Please log in.",
            genericError: "An error occurred during registration",
            registrationError: "Registration error"
            },
            success: {
            title: "Registration successful!",
            message: "Your account has been created successfully."
            },
            validation: {
            passwordsMismatch: "❌ Passwords don't match",
            passwordMinLength: "⚠️ Minimum 6 characters"
            }
        },

        // LOGIN
        login: {
            title: "Happy to see you again",
            subtitle: "Access your account and resume your exchanges with ease.",
            email: "Email",
            emailPlaceholder: "Email",
            password: "Password",
            passwordPlaceholder: "Password",
            forgotPassword: "Forgot password?",
            loginButton: "Log in",
            loggingIn: "Logging in...",
            createAccount: "Create a new account",
            errors: {
            requiredFields: "Please fill all fields",
            invalidCredentials: "❌ Incorrect email or password",
            emailNotConfirmed: "❌ Please confirm your email before logging in",
            genericError: "❌ An error occurred during login",
            }
        },

        // NEW TRANSLATIONS FOR SETTINGS
        appearance: "Appearance",
        languageRegion: "Language & Region", 
        language: 'Language',
        theme: 'Theme',
        security: "Security",
        privacy: "Privacy",
        support: "Support",
        
        // Theme
        chooseTheme: "Choose theme",
        selectTheme: "Select your preferred theme",
        system: "System",
        light: "Light",
        dark: "Dark",
        
        // Language
        chooseLanguage: "Choose language",
        selectLanguage: "Select your language",
        french: "French",
        english: "English",
        
        // Notifications
        notificationsName: "Notifications",
        pushNotifications: "Push notifications",
        
        // Security
        changePassword: "Change password",
        
        // Privacy
        deleteHistory: "Delete history", 
        downloadData: "Download my data",
        
        // Support
        helpCenter: "Help center",
        reportIssue: "Report issue",
        rateApp: "Rate app",
        
        // Confirmation messages
        deleteHistoryTitle: "Delete history",
        deleteHistoryMessage: "Are you sure you want to delete all your history? This action is irreversible.",
        
        // Password change
        currentPassword: "Current password",
        newPassword: "New password",
        confirmPassword: "Confirm password", 
        changing: "Changing...",
        change: "Change",
        passwordChanged: "Password changed successfully",
        passwordChangeError: "Error changing password",
        passwordsDontMatch: "Passwords don't match",
        passwordTooShort: "Password must be at least 6 characters",
        fillAllFields: "Please fill all fields",
        
        // Data download
        downloadDataMessage: "This feature will allow you to download all your personal data.",
        
        // App rating
        rateAppMessage: "Thank you for supporting our app by rating it on the store.",
        
        // General messages
        updateError: "Error updating",
        historyDeleted: "History deleted successfully",

        // MES ARTICLES
        myItems: {
        title: "My Items",
        searchPlaceholder: "Search an item...",
        
        // Item statuses
        status: {
            active: "Active",
            sold: "Sold",
            pending: "Pending", 
            rejected: "Rejected",
            draft: "Draft"
        },
        
        // Actions in modal
        actions: {
            view: "View",
            edit: "Edit",
            delete: "Delete"
        },
        
        // Delete messages
        deleteTitle: "Delete Item", 
        deleteMessage: "Are you sure you want to delete \"{{productName}}\"?",
        
        // Empty state
        empty: {
            title: "No Items",
            subtitle: "Items you publish will appear here",
            addButton: "Add Item"
        }
        },

        // ===== NEW TRANSLATIONS FOR SELL SCREEN =====
        exitConfirmation: "Leave publication?",
        discard: "Discard",
        saveDraft: "Save draft",
        draftSaved: "Draft saved",
        draftSavedMessage: "Your photos have been saved as draft.",
        exitConfirmationMessage: "If you leave now, you will lose the changes made to this publication.",
        becomeSeller: "Become seller",
        continue: "Continue",
        add: "Add",
        sell: {

            publicationSuccess: "Ad submitted!",
            pendingAdminValidation: "Your ad has been successfully submitted. It will be visible after validation by our team.",
            missingFields: "Missing fields", 
            fillAllFields: "Please fill in all required fields.",
            submitting: "Submitting...",
            submitAd: "Submit ad",

            adminValidationInfo: "Your listing has been submitted successfully. It will be visible after approval by our team.",
            photosPreview: "Preview of photos",
            photosInfo: "These photos will be displayed in your listing. The first image will be the main photo.",

            detailsTitle: "Ad Details",
            basicInfo: "Basic Information",
            productName: "Product Name",
            productNamePlaceholder: "Ex: Rolex Submariner Watch",
            category: "Category",
            chooseCategory: "Choose a category",
            subCategory: "Sub-category",
            chooseSubCategory: "Sub-category",
            subCategories: "Sub-categories",
            price: "Price",
            pricePlaceholder: "0.00",
            currency: "USD",
            description: "Description",
            detailedDescription: "Detailed Description",
            descriptionPlaceholder: "Describe your product in detail... (minimum 50 characters)",
            conditionAndLocation: "Condition and Location",
            productCondition: "Product Condition",
            chooseCondition: "Product Condition",
            location: "Location",
            chooseLocation: "City",
            publishAd: "Publish Ad",
            publishing: "Publishing...",
            requiredFields: "Required fields",
            characters: "characters",
            userNotConnected: "User not connected.",
            productPublished: "Your product has been successfully published.",
            publicationError: "Unable to publish the ad. Please try again.",

            newSale: "New sale",
            photos: "Photos",
            addPhotos: "Add photos",
            maxPhotos: "Maximum 5 photos",
            
            addPhoto: "Add photo",
            takePhoto: "Take photo",
            chooseFromGallery: "Choose from gallery",
            verificationRequired: "Verification required",
            mustBeVerifiedSeller: "You must be a verified seller to post listings.",
            
            becomeSellerAction: "Become seller",
            becomeSellerMessage: "To sell posters, you must first become a verified seller.",
            loginRequired: "Login required",
            loginToSell: "Please log in to sell items.",
            verificationInProgress: "Verification in progress",
            verificationPendingMessage: "Your seller profile is being verified. This process may take 24 to 48 hours.",
            checkStatus: "Check status",
            profileRejected: "Profile rejected",
            profileRejectedMessage: "Your seller request has been rejected. Please check your documents and resubmit your profile.",
            resubmit: "Resubmit",
            verificationRequiredMessage: "You need to verify your profile to sell items on the app.",
            verifyProfile: "Verify my profile",
            checkingStatus: "Checking status...",
            statusCheckError: "Unable to verify your seller status. Please try again.",
            photoPermissionMessage: "We need your permission to access your photos.",
            cameraPermissionMessage: "We need your permission to use the camera.",
            galleryAccessError: "Unable to access photo gallery.",
            cameraAccessError: "Unable to access camera."
        },

        // CATEGORY SCREEN - NEW TRANSLATIONS
        category: {
            description: "Discover our {{category}} products - {{count}} items available", 
            products: "products",
            noProducts: "No products found in this category",
            allProducts: "All products",
            exploreCategory: "Explore {{category}}",
            productCount: "{{count}} product available",
            productCount_plural: "{{count}} products available",
            loadingProducts: "Loading products...",
            errorLoading: "Error loading products"
        },

        // PRODUCT DETAIL
        productDetail: {
            productNotFound: "Product not found",
            back: "Back",
            gallery: "Gallery",
            description: "Description", 
            securePayment: "Secure payment",
            responseRate: "Response rate",
            responseTime: "Response time",
            fixedPrice: "Fixed price",
            sales: "sales",
            views: "views",
            condition: "Condition",
            seller: "Seller",
            chatWithSeller: "Chat with seller",
            buy: "Buy",
            itemsSold: "items sold",
            verified: "Verified",
        
            // Tags d'information
            tags: {
                securePayment: "Secure payment",
                location: "Location", 
                condition: "Condition"
            },
            
            // États du produit
            conditionTypes: {
                new: "New",
                likeNew: "Like new",
                good: "Good condition",
                fair: "Fair condition"
            },
            
            // Messages de statut
            loading: "Loading product...",
            error: "Error loading product",
            
            // Actions
            share: "Share",
            favorite: "Favorite",
            unfavorite: "Remove from favorites",
            
            // Galerie
            photoCount: "{{current}}/{{total}}",
            closeGallery: "Close gallery"
        },

        // SALES
        sales: {
            title: "Sales", 
            discountTitle: "Save up to 50%",
            description: "Discover our best offers and exclusive promotions. Exceptional discounts on quality products.",
            productCount: "{{count}} product on sale",
            productCount_plural: "{{count}} products on sale"
        },

        // FAVORIS
        favorites: {
            emptyTitle: "No favorites",
            emptySubtitle: "Products you add to your favorites will appear here",
            count: "{{count}} saved product",
            count_plural: "{{count}} saved products",
            "emptyDatabase": {
                "title": "Empty store",
                "subtitle": "There are no products in the app yet. Be the first to sell!",
                "sellFirstItem": "Sell my first item",
                "becomeSeller": "Become a seller",
            },
            "exploreProducts": "Explore products",
        },

        // CATEGORIE
        categories: {
            'Électronique': 'Electronics',
            'Habillement': 'Clothing',
            'Auto': 'Auto',
            'Maison & Déco': 'Home & Decor',
            'Sports & Loisirs': 'Sports & Leisure',
            'Livres & Médias': 'Books & Media',
            'Autres': 'Other',
            'Tous': 'All'
        },

        // RECHERCHE
        searchResults: {
            results: "Search Results", 
            noResults: "No results found",
            noResultsFor: 'No products match "{{query}}"',
            modifySearch: "Modify search",
            productsFound: "product(s) found",
            resultsFor: 'Results for "{{query}}"',
        },

        // FILTER SCREEN
        filters: {
            allProducts: "All products",
            savings: "Savings",
            noProductsFound: "No products found",
            noProductsMatch: "No products match your filtering criteria",
            results: "Filter results",
            modify: "Modify",
            productsMatch: "Products matching your criteria",
            noProductsMatchFilters: "No products match your filters",
            productsFound: "product(s) found",
            modifyFilters: "Modify filters",
            title: "Filters",
            reset: "Reset",
            clearAll: "Clear All",
            apply: "Apply",
            
            location: {
                title: "Location",
                subtitle: "DRC",
                description: "Search your city to see local listings",
                searchPlaceholder: "Search a city...",
                citiesFound: "{{count}} city(ies) found",
                selectedCity: "Selected city: {{city}}",
                popularCities: "Popular cities"
            },
            
            categories: {
                title: "Categories"
            },
            
            sort: {
                title: "Sort by",
                popular: "Popular",
                newest: "Newest",
                priceLow: "Price: Low to High",
                priceHigh: "Price: High to Low"
            },
            
            price: {
                title: "Price Range",
                lessThan50: "Less than $50",
                "50to100": "$50-$100",
                "100to500": "$100-$500",
                moreThan500: "More than $500"
            },
            
            condition: {
                title: "Condition",
                new: "New",
                likeNew: "Like New",
                good: "Good",
                fair: "Fair"
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
            noResults: "No results found",
            
            // EMPTY DATABASE MODE
            emptyDatabase: {
                title: "Welcome to our marketplace! 🎉",
                subtitle: "Be among the first to discover and sell on our platform. The market is brand new, it's up to you to build it!",
                sellFirstItem: "Sell my first item",
                becomeSeller: "Become a seller",
                howItWorks: "How it works?",
                searchEmptyTitle: "The market is still empty",
                searchEmptySubtitle: "Be the first to sell something!",
                marketplaceEmpty: "Marketplace empty",
                beTheFirstToSell: "Be the first to sell and start the community!",
                loginRequired: "Login required",
                loginToSell: "Please log in to sell items.",
                login: "Log in",
                verificationInfo: "Identity verification is required to become a seller on Imani.",
                verificationInProgress: "Verification in progress",
                verificationTimeMessage: "Your verification request is being processed. This may take 24 to 48 hours.",
                youWillBeNotified: "You will be notified once your profile is verified",
                verificationRejected: "Profile rejected",
                verificationRejectedMessage: "Your verification request has been rejected. Please check your documents and resubmit your profile.",
                resubmitProfile: "Resubmit",
                startSellingToday: "Start selling today and grow your business!",
            }
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
      myItemsName: "My Items",
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
      salesStat: "Sales",
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

// Fonction pour détecter la langue automatiquement
const detectLanguage = async (): Promise<string> => {
  try {
    // 1. Vérifier si l'utilisateur a déjà choisi une langue
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      console.log('✅ Langue sauvegardée trouvée:', savedLanguage);
      return savedLanguage;
    }

    // 2. Détection automatique avec expo-localization
    const deviceLocales = Localization.getLocales();
    const deviceLanguage = deviceLocales[0]?.languageCode || 'fr';
    
    console.log('🌍 Langues du téléphone:', deviceLocales.map(l => l.languageCode));
    console.log('🔍 Langue principale détectée:', deviceLanguage);

    // 3. Vérifier si la langue détectée est supportée
    const supportedLanguages = ['fr', 'en'];
    const detectedLanguage = supportedLanguages.includes(deviceLanguage) 
      ? deviceLanguage 
      : 'fr'; // Fallback en français

    console.log('🎯 Langue sélectionnée:', detectedLanguage);
    
    // Sauvegarder la langue détectée
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLanguage);
    
    return detectedLanguage;

  } catch (error) {
    console.error('❌ Erreur détection langue:', error);
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

// Fonction pour récupérer la langue actuelle
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// Fonction pour réinitialiser la détection automatique
export const resetToAutoLanguage = async (): Promise<void> => {
  try {
    // Supprimer la langue sauvegardée
    await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
    
    // Redétecter la langue automatiquement
    const autoLanguage = await detectLanguage();
    await i18n.changeLanguage(autoLanguage);
    
    console.log('🔄 Langue réinitialisée à la détection automatique:', autoLanguage);
  } catch (error) {
    console.error('❌ Erreur réinitialisation langue:', error);
  }
};

// Initialiser i18n avec la langue détectée
const initI18n = async () => {
  const detectedLanguage = await detectLanguage();
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: detectedLanguage,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
      debug: __DEV__, // Mode debug seulement en développement
    });

  console.log('🚀 i18n initialisé avec la langue:', detectedLanguage);
};

// Démarrer l'initialisation
initI18n();

export default i18n;