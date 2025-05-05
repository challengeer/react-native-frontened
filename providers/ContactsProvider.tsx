import api from '@/lib/api';
import React, { createContext, useContext, useEffect } from 'react';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import * as Contacts from 'expo-contacts';
import * as Localization from 'expo-localization';

interface Contact {
  contact_name: string;
  phone_number: string;
}

interface ContactsContextType {
  syncContacts: () => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const formatContacts = (contacts: Contacts.Contact[]): Contact[] => {
    const countryCode = (Localization.getLocales()[0].regionCode || 'US') as CountryCode;

    return contacts
      .map((contact) => {
        if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) return null;

        const phoneNumber = contact.phoneNumbers[0]?.number;
        if (!phoneNumber || phoneNumber.length < 8) return null;

        const parsedNumber = parsePhoneNumberFromString(phoneNumber.replace(/\s/g, ''), countryCode);
        if (!parsedNumber?.isValid()) return null;

        return {
          contact_name: contact.name,
          phone_number: parsedNumber.format('E.164').replace('+', ''),
        };
      })
      .filter((contact) => contact !== null) as Contact[];
  };

  const syncContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        return;
      }

      // Check if we need to upload contacts
      const response = await api.get("/contacts/needs-upload");
      const { needs_upload } = response.data;

      if (!needs_upload) {
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers
        ],
      });

      if (data.length > 0) {
        const formattedContacts = formatContacts(data);
        await api.post("/contacts/upload", {
          contacts: formattedContacts,
        });
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    }
  };

  useEffect(() => {
    syncContacts();
  }, []);

  return (
    <ContactsContext.Provider
      value={{
        syncContacts,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContactsContext = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContactsContext must be used within a ContactsProvider');
  }
  return context;
}; 