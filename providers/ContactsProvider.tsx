import React, { createContext, useContext, useEffect } from 'react';
import { useContacts } from '@/hooks/useContacts';

const ContactsContext = createContext<any>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { syncContacts } = useContacts();

  useEffect(() => {
    syncContacts();
  }, []);

  return (
    <ContactsContext.Provider value={{}}>
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