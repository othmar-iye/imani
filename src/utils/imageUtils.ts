// utils/imageUtils.ts
import { supabase } from '@/supabase';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'react-native';

// Fonction pour créer la miniature (réutilisée depuis SellDetailsScreen)
export const createThumbnail = async (
  imageUri: string, 
  quality: number = 0.6,
  maxWidth: number = 300,
  maxHeight: number = 300
): Promise<string> => {
  try {
    const getImageSize = (uri: string): Promise<{width: number, height: number}> => {
      return new Promise((resolve, reject) => {
        Image.getSize(uri, (width, height) => {
          resolve({width, height});
        }, reject);
      });
    };

    const originalSize = await getImageSize(imageUri);
    
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
    console.error('❌ Erreur création thumbnail:', error);
    return imageUri;
  }
};

// Fonction de compression d'image principale
export const compressImage = async (
  imageUri: string, 
  quality: number = 0.7,
  maxWidth: number = 800, // Plus petit que pour les produits
  maxHeight: number = 800
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
    console.error('❌ Erreur compression image:', error);
    return imageUri;
  }
};

// Fonction pour uploader vers Supabase (adaptée pour les photos de profil)
export const uploadProfileImageToSupabase = async (
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
      .from('user-documents') // Même bucket que vos documents
      .upload(fileName, uint8Array, {
        contentType: 'image/jpeg',
        upsert: true // IMPORTANT: Permet de remplacer si existe déjà
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('user-documents')
      .getPublicUrl(fileName);

    if (urlData?.publicUrl) {
      return urlData.publicUrl;
    } else {
      throw new Error('Impossible d\'obtenir l\'URL publique');
    }
  } catch (error) {
    console.error('❌ Erreur upload Supabase:', error);
    throw error;
  }
};