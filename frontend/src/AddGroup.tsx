import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles.css';

const AddGroup: React.FC = () => {
  // Hook do obsługi nawigacji
  const navigate = useNavigate();

  // Stan komponentu przechowujący nazwę nowej grupy
  const [groupName, setGroupName] = useState('');

  // Funkcja obsługująca zmianę danych wejściowych
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  // Obsługa dodawania nowej grupy
  const handleAddGroup = async () => {
    try {
      // Wysłanie żądanie do backendu
      await axios.post('/api/groups', { name: groupName });

      // Po dodaniu grupy, przekierowanie do strony głównej
      navigate('/');
    } catch (error) {
      console.error('Error adding group:', error);
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
          <h3>Add new group</h3>
        </footer>
      </article>
      <form>
        <section className="section-content2">
          <div>
            <label>Group name: </label>
            <input type="text" name="groupName" value={groupName} onChange={handleInputChange} />
          </div>
        </section>
        <button type="button" className="button-link2" onClick={handleAddGroup}>
          Add group
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

export default AddGroup;