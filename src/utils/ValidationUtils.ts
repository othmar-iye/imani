// utils/ValidationUtils.ts

// Fonction pour valider la date
export const isValidDate = (dateString: string): boolean => {
  if (!dateString || dateString.length !== 10) return false;
  
  const [day, month, year] = dateString.split('/').map(Number);
  
  // Validation basique
  if (!day || !month || !year) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  // Validation des jours par mois
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) return false;
  
  return true;
};

// Fonction pour valider le numéro de téléphone
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('243') && cleaned.length === 12;
};

// Fonction pour formater la date
export const formatDate = (input: string): string => {
  const numbers = input.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }
};

// Fonction pour formater le numéro de téléphone
export const formatPhoneNumber = (input: string): string => {
  if (input.startsWith('+243')) {
    const numbers = input.replace(/\D/g, '');
    const formatted = `+${numbers.slice(0, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6, 9)} ${numbers.slice(9, 12)}`;
    return formatted.trim();
  }
  else if (input.startsWith('243')) {
    const numbers = input.replace(/\D/g, '');
    const formatted = `+${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 11)}`;
    return formatted.trim();
  }
  else {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length > 9) {
      const formatted = `+243 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)}`;
      return formatted.trim();
    } else {
      const formatted = `+243 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5)}`;
      return formatted.trim();
    }
  }
};