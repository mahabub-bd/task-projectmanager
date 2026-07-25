import CryptoJS from 'crypto-js';
import { decrypt, encrypt } from 'crypto-js/aes';

// Secret key for encryption (in production, this should be from env or more secure)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-key-change-in-production-min-32-chars';

export const secureStorage = {
  getItem: (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        const encryptedData = localStorage.getItem(key);
        if (!encryptedData) {
          resolve(null);
          return;
        }

        const decryptedBytes = decrypt(encryptedData, SECRET_KEY);
        const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        resolve(decryptedData);
      } catch (error) {
        console.error('Error decrypting data:', error);
        resolve(null);
      }
    });
  },

  setItem: (key: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      try {
        const encryptedData = encrypt(value, SECRET_KEY);
        localStorage.setItem(key, encryptedData.toString());
        resolve();
      } catch (error) {
        console.error('Error encrypting data:', error);
        resolve();
      }
    });
  },

  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      resolve();
    });
  },

  clear: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.clear();
      resolve();
    });
  },
};
