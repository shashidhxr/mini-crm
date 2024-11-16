import { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Contact } from './lib/types';
import ContactForm from './components/contactForm.tsx';
import ContactTable from './components/contactTable.tsx';

const theme = createTheme();

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/v1/contacts')
      .then((response) => response.json())
      .then((data: Contact[]) => setContacts(data))
      .catch((err) => console.error('Failed to fetch contacts:', err));
  }, []);

  const handleAddContact = async (newContact: Omit<Contact, 'id'>) => {
    try {
      const response = await fetch('http://localhost:9000/api/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      const createdContact: Contact = await response.json();
      setContacts((prevContacts) => [...prevContacts, createdContact]);
    } catch (err) {
      console.error('Failed to add contact:', err);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await fetch(`http://localhost:9000/api/v1/contacts/${id}`, { method: 'DELETE' });
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  const handleEditContact = async (updatedContact: Contact) => {
    try {
      const response = await fetch(`http://localhost:9000/api/v1/contacts/${updatedContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact),
      });
      const data: Contact = await response.json();
      setContacts((prevContacts) =>
        prevContacts.map((contact) => (contact.id === data.id ? data : contact)),
      );
    } catch (err) {
      console.error('Failed to update contact:', err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        width="100%" 
      >
        <Container
          maxWidth="lg"
          sx={{
              py: 4,
            }}
        >
                <Box 
                display='flex'
                justifyContent='center'
                pb='40px'
                fontSize={25}
                fontWeight='16px'
            >
                Customer Contacts Management
            </Box>
          <ContactForm onSubmit={handleAddContact} />
          <ContactTable
            contacts={contacts}
            onDelete={handleDeleteContact}
            onEdit={handleEditContact}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
  
}

export default App;
