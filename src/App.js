import React, { Component } from 'react';
import shortid from 'shortid';
import './App.css';
import Container from './components/Container/Container';
import ContactForm from './components/ContactForm/ContactForm';
import ContactsList from './components/ContactsList/ContactsList';
import Filter from './components/Filter/Filter';
import storage from './StorageServises';

// storage.save('Contacts', [
//   { id: shortid.generate(), name: 'Rosie Simpson', number: '459-12-56' },
//   { id: shortid.generate(), name: 'Hermione Kline', number: '443-89-12' },
//   { id: shortid.generate(), name: 'Eden Clements', number: '645-17-79' },
//   { id: shortid.generate(), name: 'Annie Copeland', number: '227-91-26' },
// ]);

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const storContacts = storage.load('Contacts');
    console.log('storContacts', storContacts);
    if (storContacts) {
      this.setState({ contacts: storContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const nextContacts = this.state.contacts;
    const prevContacts = prevState.contacts;

    if (nextContacts !== prevContacts) {
      storage.save('Contacts', nextContacts);
    }
  }

  addContact = ({ name, number }) => {
    const contact = {
      id: shortid.generate(),
      name,
      number,
    };

    const { contacts } = this.state;

    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      alert(`${name} is already in contacts.`);
    } else if (contacts.find(contact => contact.number === number)) {
      alert(`${number} is already in contacts.`);
    } else if (name.trim() === '' || number.trim() === '') {
      alert("Enter the contact's name and number phone!");
    } else if (!/\d{3}[-]\d{2}[-]\d{2}/g.test(number)) {
      alert('Enter the correct number phone!');
    } else {
      this.setState(({ contacts }) => ({
        contacts: [contact, ...contacts],
      }));
    }
  };

  deleteContact = id => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
  };

  handleChange = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  filterContacts = (filter, contacts) => {
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );
  };

  render() {
    const { contacts, filter } = this.state;
    const filteredContacts = this.filterContacts(filter, contacts);

    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.addContact} />

        <h2>Contacts</h2>
        {contacts.length > 1 && (
          <Filter value={filter} onChange={this.handleChange} />
        )}
        {contacts.length > 0 ? (
          <ContactsList
            contacts={filteredContacts}
            onDeleteContact={this.deleteContact}
          />
        ) : (
          <p>Your phonebook is empty. Please add contact.</p>
        )}
      </Container>
    );
  }
}

export default App;
