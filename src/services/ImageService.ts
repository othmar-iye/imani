// services/ImageService.ts
import { supabase } from '@/supabase';

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