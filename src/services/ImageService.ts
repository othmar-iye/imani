// services/ImageService.ts
import { supabase } from '@/supabase';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Fonction pour créer une thumbnail (150x150px, carrée)
export const createProfileThumbnail = async (
  imageUri: string, 
  quality: number = 0.6
): Promise<string> => {
  try {
    // Créer une thumbnail carrée de 150x150px
    const result = await manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: 150,
            height: 150,
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
    console.log('❌ Erreur création thumbnail:', error);
    return imageUri; // Fallback sur l'image originale
  }
};

// Fonction pour uploader la photo de profil AVEC thumbnail
export const uploadProfilePictureWithThumbnail = async (
  imageUri: string, 
  userId: string
): Promise<{ originalUrl: string | null; thumbnailUrl: string | null }> => {
  try {
    console.log('🟡 Début upload photo profil avec thumbnail...');
    
    if (imageUri.includes('supabase.co')) {
      console.log('✅ Image déjà sur Supabase');
      return { 
        originalUrl: imageUri, 
        thumbnailUrl: imageUri // Même URL pour les images existantes
      };
    }

    const timestamp = Date.now();
    
    // ÉTAPE 1: Créer la thumbnail
    console.log('🟡 Création thumbnail...');
    const thumbnailUri = await createProfileThumbnail(imageUri);
    const thumbnailFileName = `profiles/${userId}/thumbnail-${timestamp}.jpg`;
    const thumbnailUrl = await uploadImageToStorage(thumbnailUri, thumbnailFileName);
    
    // ÉTAPE 2: Uploader l'image originale compressée
    console.log('🟡 Upload image originale...');
    const compressedUri = await compressImage(imageUri, 0.7);
    const originalFileName = `profiles/${userId}/original-${timestamp}.jpg`;
    const originalUrl = await uploadImageToStorage(compressedUri, originalFileName);

    console.log('✅ Upload terminé - Original:', originalUrl, 'Thumbnail:', thumbnailUrl);
    
    return { originalUrl, thumbnailUrl };

  } catch (error) {
    console.error('❌ Erreur upload photo profil:', error);
    throw error;
  }
};

export const compressImage = async (imageUri: string, quality: number = 0.7): Promise<string> => {
  try {
    return imageUri;
  } catch (error) {
    console.log('Compression échouée, utilisation image originale');
    return imageUri;
  }
};

export const getSignedUrl = async (url: string): Promise<string | null> => {
  try {
    if (!url.includes('supabase.co')) return url;
    
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucket = 'user-documents';
    
    const publicIndex = pathParts.indexOf('public');
    if (publicIndex === -1) return url;
    
    const filePath = pathParts.slice(publicIndex + 2).join('/');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600);

    if (error) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      return publicUrlData.publicUrl;
    }

    return data?.signedUrl || url;
  } catch (error) {
    console.error('❌ Erreur getSignedUrl:', error);
    return url;
  }
};

export const uploadImageToStorage = async (imageUri: string, path: string): Promise<string | null> => {
  try {
    console.log('🟡 Début upload image:', path);
    
    if (imageUri.includes('supabase.co')) {
      console.log('✅ Image déjà sur Supabase');
      return imageUri;
    }

    // Vérifier que l'image existe
    const response = await fetch(imageUri);
    if (!response.ok) {
      console.log('🔴 Erreur fetch image');
      throw new Error('Impossible de charger l image');
    }

    const filename = imageUri.split('/').pop();
    const fileExtension = filename?.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueFileName = `${path}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

    const blob = await response.blob();

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return null;
    }

    const SUPABASE_URL = 'https://dxlbyqkrcfkwrtyidpsn.supabase.co';
    
    const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/user-documents/${uniqueFileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
      },
      body: blob,
    });

    if (!uploadResponse.ok) {
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('user-documents')
      .getPublicUrl(uniqueFileName);

    return publicUrl;

  } catch (error) {
    console.error('❌ Erreur upload image:', error);
    
    // Gestion sécurisée du type unknown
    if (error instanceof Error) {
      throw new Error(`Échec upload image: ${error.message}`);
    } else {
      throw new Error('Échec upload image: Erreur inconnue');
    }
  }
};