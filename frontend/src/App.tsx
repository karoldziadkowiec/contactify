import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddContact from './AddContact';
import EditContact from './EditContact';
import AddGroup from './AddGroup';
import './Styles.css';
import Contact from './Contact';
import Group from './Group';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [originalContacts, setOriginalContacts] = useState<Contact[]>([]); // Hook useState do inicjalizacji stanu komponentu.
  const navigate = useNavigate(); // Hook useNavigate do przekierowywania

  // Hook useEffect używany do wykonywania operacji asynchronicznych, pobierania danych i zaktualizowania stanu komponentu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactsResponse = await axios.get<Contact[]>('/api/contacts');
        const groupsResponse = await axios.get<Group[]>('/api/groups');

        setContacts(contactsResponse.data);
        setOriginalContacts(contactsResponse.data);
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getGroupNameById = (groupId: number): string => {
    const group = groups.find((group) => group.id === groupId);
    return group ? group.name : '';
  };

  const handleDeleteContact = async (contactId: number) => {
    try {
      // Wysłanie żądania do backendu w celu usunięcia kontaktu
      await axios.delete(`/api/contacts/${contactId}`);

      // Aktualizuj stan, aby odświeżyć widok
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEditContact = (contactId: number) => {
    // Przekierowanie do EditContact z wykorzystaniem hooka navigate
    navigate(`/edit-contact/${contactId}`);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = parseInt(e.target.value, 10);
    setSelectedGroup(groupId);
  };

  const handleSortByGroup = () => {
    // Filtrowanie kontakty według wybranej grupy lub przywracanie oryginalnej listy
    const filteredContacts = selectedGroup
      ? contacts.filter((contact) => contact.groupID === selectedGroup)
      : originalContacts;

    // Aktualizacja stanu z posortowaną listą
    setContacts(filteredContacts);
  };

  // Renderowanie komponentu
  return (
    <div>
      <article className="article-header">
        <header>
          <h1>c o n t a c t i f y</h1>
        </header>
      </article>
      <button className="button-link">
        <Link to="/add-contact">Add contact</Link>
      </button>{' '}
      <button className="button-link">
        <Link to="/add-group">New group</Link>
      </button>{' '}
      <select name="groupFilter" className="select-opt" value={selectedGroup || ''} onChange={handleGroupChange}>
        <option value="">All Groups</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <button type="button" className="sort-btn" onClick={handleSortByGroup}>
        Sort
      </button>
      <article className="article-title">
        <footer>
          <h3>Contacts</h3>
        </footer>
      </article>
      <section className="section-content">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Phone number</th>
            <th>Email</th>
            <th>Address</th>
            <th>Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.surname}</td>
              <td>{contact.phone}</td>
              <td>{contact.email}</td>
              <td>{contact.address}</td>
              <td>{getGroupNameById(contact.groupID)}</td>
              <td>
                <button onClick={() => handleEditContact(contact.id)} className="edit-btn">Edit</button>
                <button onClick={() => handleDeleteContact(contact.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </section>
      <article className="article-footer">
        <footer>
          <h2>© 2024</h2>
        </footer>
      </article>
    </div>
  );
};

// Routing
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/add-contact" element={<AddContact />} />
        <Route path="/add-group" element={<AddGroup />} />
        <Route path="/" element={<Contacts />} />
        <Route path="/edit-contact/:id" element={<EditContact />} />
      </Routes>
    </Router>
  );
};

export default App;