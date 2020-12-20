import { useState, useEffect } from 'react';
import shortid from 'shortid';
import './App.css';
import Container from './components/Container/Container';
import ContactForm from './components/ContactForm/ContactForm';
import ContactsList from './components/ContactsList/ContactsList';
import Filter from './components/Filter/Filter';
import storage from './services/StorageServices';

// storage.save('Contacts', [
//   { id: shortid.generate(), name: 'Rosie Simpson', number: '459-12-56' },
//   { id: shortid.generate(), name: 'Hermione Kline', number: '443-89-12' },
//   { id: shortid.generate(), name: 'Eden Clements', number: '645-17-79' },
//   { id: shortid.generate(), name: 'Annie Copeland', number: '227-91-26' },
// ]);

function App() {
  const [contacts, setContacts] = useState(() => {
    return storage.load('Contacts');
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    storage.save('Contacts', contacts);
  }, [contacts]);

  const addContact = ({ name, number }) => {
    const contact = {
      id: shortid.generate(),
      name,
      number,
    };

    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      alert(`🤔 ${name} is already in contacts.`);
    } else if (contacts.find(contact => contact.number === number)) {
      alert(`🤔 ${number} is already in contacts.`);
    } else if (name.trim() === '' || number.trim() === '') {
      alert("😱 Enter the contact's name and number phone!");
    } else if (!/\d{3}[-]\d{2}[-]\d{2}/g.test(number)) {
      alert('💩 Enter the correct number phone!');
    } else {
      setContacts(() => [contact, ...contacts]);
    }
  };

  const deleteContact = id => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleChange = e => {
    setFilter(e.currentTarget.value);
  };

  const filterContacts = (filter, contacts) => {
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );
  };

  return (
    <Container>
      <h1>Phonebook</h1>
      <ContactForm onSubmit={addContact} />

      <h2>Contacts</h2>
      {contacts.length > 1 && <Filter value={filter} onChange={handleChange} />}
      {contacts.length > 0 ? (
        <ContactsList
          contacts={filterContacts(filter, contacts)}
          onDeleteContact={deleteContact}
        />
      ) : (
        <p>Your phonebook is empty. Please add contact.</p>
      )}
    </Container>
  );
}

export default App;
