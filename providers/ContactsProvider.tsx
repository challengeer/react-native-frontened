import React, { createContext, useContext, useEffect, useState } from 'react';
import { useContacts } from '@/hooks/useContacts';

interface ContactsContextType {
  isContactsSynced: boolean;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isContactsSynced, setIsContactsSynced] = useState(false);
  const { syncContacts } = useContacts();

  useEffect(() => {
    const sync = async () => {
      await syncContacts();
      setIsContactsSynced(true);
    };
    sync();
  }, []);

  return (
    <ContactsContext.Provider value={{ isContactsSynced }}>
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