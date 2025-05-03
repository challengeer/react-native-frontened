import api from '@/lib/api';
import { useState, useEffect } from 'react';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import * as Contacts from 'expo-contacts';
import * as Localization from 'expo-localization';

interface Contact {
  contact_name: string;
  phone_number: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContactsSynced, setIsContactsSynced] = useState(false);

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

  const getContacts = async () => {
    if (isContactsSynced) return; // Skip if already uploaded

    try {
      setIsLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.Name,
            Contacts.Fields.PhoneNumbers
          ],
        });

        if (data.length > 0) {
          const formattedContacts = formatContacts(data);
          setContacts(formattedContacts);

          await api.post("/contacts/upload", {
            contacts: formattedContacts,
          });
          setIsContactsSynced(true);
        }
      } else {
        throw new Error('Contacts permission denied');
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return { contacts, isLoading, error, getContacts, isContactsSynced };
}; 