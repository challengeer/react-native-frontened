import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import UserInterface from '@/types/UserInterface';

interface ContactRecommendation {
  contact_id: string;
  contact_name: string;
  phone_number: string;
}

export const useContacts = () => {
  const { data: contacts, isPending: isContactsLoading, isError: isContactsError } = useQuery<ContactRecommendation[]>({
    queryKey: ["contacts-by-interest"],
    queryFn: async () => {
      const response = await api.get("/contacts/sorted-by-interest");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const { data: recommendations, isPending: isRecommendationsLoading, isError: isRecommendationsError } = useQuery<UserInterface[]>({
    queryKey: ["contact-recommendations"],
    queryFn: async () => {
      const response = await api.get("/contacts/recommendations");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  return {
    contacts,
    recommendations,
    isContactsLoading,
    isRecommendationsLoading,
    isContactsError,
    isRecommendationsError,
  };
}; 