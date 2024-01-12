import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Group from './Group';
import './Styles.css';

interface Contact {
  name: string;
  surname: string;
  phone: string;
  email: string;
  address: string;
  groupID: number;
}

const EditContact: React.FC = () => {
  const { id } = useParams(); // Pobieramy ID z parametrów URL
  const navigate = useNavigate();

  // Stan komponentu przechowujący dane kontaktu do edycji
  const [contact, setContact] = useState<Contact>({
    name: '',
    surname: '',
    phone: '',
    email: '',
    address: '',
    groupID: 0,
  });

  // Stan komponentu przechowujący dostępne grupy
  const [groups, setGroups] = useState<Group[]>([]);

  // Hook useEffect używany do wykonywania operacji asynchronicznych, pobierania danych i zaktualizowania stanu komponentu
  useEffect(() => {
    // Pobieranie danych kontaktu do edycji
    const fetchContact = async () => {
      try {
        const response = await axios.get<Contact>(`/api/contacts/${id}`);
        setContact(response.data);
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };

    // Pobieranie grup 
    const fetchGroups = async () => {
      try {
        const response = await axios.get<Group[]>('/api/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchContact();
    fetchGroups();
  }, [id]);

  // Obsługa zmiany danych wejściowych
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: name === 'groupID' ? parseInt(value, 10) : value,
    }));
  };

  // Obsługa edycji kontaktu
  const handleEditContact = async () => {
    try {
      // Wysłanie danych do backendu
      await axios.put(`/api/contacts/${id}`, contact);

      // Po edycji kontaktu przekierowanie do strony głównej
      navigate('/');
    } catch (error) {
      console.error('Error editing contact:', error);
    }
  };

  // Powrót do strony głównej
  const handleGoBack = () => {
    navigate('/');
  };

  // Renderowanie komponentu
  return (
    <div>
      <article className="article-header">
        <header>
          <h1>c o n t a c t i f y</h1>
        </header>
      </article>
      <article className="article-title">
        <footer>
          <h3>Edit contact</h3>
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
        <button type="button" className="button-link2" onClick={handleEditContact}>
          Save
        </button>
        <button type="button" className="button-link2" onClick={handleGoBack}>
          Back
        </button>
        <article className="article-footer">
          <footer>
            <h2>© 2024</h2>
          </footer>
        </article>
      </form>
    </div>
  );
};

export default EditContact;