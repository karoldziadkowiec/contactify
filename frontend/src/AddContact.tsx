import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Group from './Group';
import './Styles.css';

const AddContact: React.FC = () => {
  // Hook do obsługi nawigacji
  const navigate = useNavigate();

  // Hook stanu komponentu przechowujący dane nowego kontaktu
  const [contact, setContact] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    address: '',
    groupID: '',
  });
  
  // Stan komponentu przechowujący listę grup
  const [groups, setGroups] = useState<Group[]>([]);

  // useEffect używany do wykonywania operacji asynchronicznych, pobierania danych i zaktualizowania stanu komponentu
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get<Group[]>('/api/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  // Funkcja obsługująca zmianę danych wejściowych
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: name === 'groupID' ? parseInt(value, 10) : value,
    }));
  };

  // Obsługa dodawania nowego kontaktu
  const handleAddContact = async () => {
    try {
      // Wysyłanie danych do backendu
      await axios.post('/api/contacts', contact);

      // Po dodaniu kontaktu przekierowanie do strony głównej
      navigate('/');
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  // Obsługa powrotu do strony głównej
  const handleGoBack = () => {
    navigate('/');
  };

  //  Renderowanie komponentu
  return (
    <div>
      <article className="article-header">
        <header>
          <h1>c o n t a c t i f y</h1>
        </header>
      </article>
      <article className="article-title">
        <footer>
          <h3>Add new contact</h3>
        </footer>
      </article>
      <form>
        <section className="section-content2">
          <div>
            <label>Name: </label>
            <input type="text" name="name" value={contact.name} onChange={handleInputChange} />
          </div>
          <div>
            <label>Surname: </label>
            <input type="text" name="surname" value={contact.surname} onChange={handleInputChange} />
          </div>
          <div>
            <label>Phone number: </label>
            <input type="text" name="phone" value={contact.phone} onChange={handleInputChange} />
          </div>
          <div>
            <label>Email: </label>
            <input type="text" name="email" value={contact.email} onChange={handleInputChange} />
          </div>
          <div>
            <label>Address: </label>
            <input type="text" name="address" value={contact.address} onChange={handleInputChange} />
          </div>
          <div>
            <label>Group: </label>
            <select name="groupID" value={contact.groupID} onChange={handleInputChange}>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </section>
      </form><button type="button" className="button-link2" onClick={handleAddContact}>
        Add contact
      </button>
      <button type="button" className="button-link2" onClick={handleGoBack}>
        Back
      </button>
      <article className="article-footer">
        <footer>
          <h2>© 2024</h2>
        </footer>
      </article>
    </div>
  );
};

export default AddContact;