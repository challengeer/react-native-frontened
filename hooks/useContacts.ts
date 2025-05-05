import api from '@/lib/api';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import * as Contacts from 'expo-contacts';
import * as Localization from 'expo-localization';
import UserInterface from '@/types/UserInterface';

interface Contact {
  contact_name: string;
  phone_number: string;
}

interface ContactRecommendation {
  contact_id: string;
  contact_name: string;
  phone_number: string;
}

export const useContacts = () => {
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
    } finally {
      setIsContactsSynced(true);
    }
  };

  const { data: contacts, isPending: isContactsLoading, isError: isContactsError } = useQuery<ContactRecommendation[]>({
    queryKey: ["contacts-by-interest"],
    queryFn: async () => {
      const response = await api.get("/contacts/sorted-by-interest");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    enabled: isContactsSynced,
  });

  const { data: recommendations, isPending: isRecommendationsLoading, isError: isRecommendationsError } = useQuery<UserInterface[]>({
    queryKey: ["contact-recommendations"],
    queryFn: async () => {
      const response = await api.get("/contacts/recommendations");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    enabled: isContactsSynced,
  });

  return {
    syncContacts,
    contacts,
    recommendations,
    isContactsLoading,
    isRecommendationsLoading,
    isContactsError,
    isRecommendationsError,
  };
}; 