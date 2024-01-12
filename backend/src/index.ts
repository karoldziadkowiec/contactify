import express from 'express';
import { pool } from './db';
import { OkPacket } from 'mysql2';

// Inicjalizacja aplikacji Express na porcie, na którym będzie nasłuchiwać serwer.
const app = express();
const port = 3001;

// Middleware do obsługi danych w formacie JSON
app.use(express.json());

// Pobieranie wszystkich kontaktów
app.get('/api/contacts', async (req, res) => {
  try {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM contacts');
    res.json(rows); // zwraca wyniki w formie JSON
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Pobieranie grup
app.get('/api/groups', async (req, res) => {
  try {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM groups');
    res.json(rows); // zwraca wyniki w formie JSON
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Dodawanie nowego kontaktu
app.post('/api/contacts', async (req, res) => {
  try {
    const connection = await pool;
    const { name, surname, phone, email, address, groupID: rawGroupID } = req.body;
    const groupID = parseInt(rawGroupID, 10);

    const [result] = await connection.query<OkPacket>(
      'INSERT INTO contacts (name, surname, phone, email, address, groupID) VALUES (?, ?, ?, ?, ?, ?)',
      [name, surname, phone, email, address, groupID]
    );

    res.json({ message: 'Contact added successfully', contactId: result.insertId }); // zwraca wyniki w formie JSON
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Dodawanie nowej grupy
app.post('/api/groups', async (req, res) => {
  try {
    const connection = await pool;
    const { name } = req.body;

    const [result] = await connection.query<OkPacket>('INSERT INTO groups (name) VALUES (?)', [name]);

    res.json({ message: 'Group added successfully', groupId: result.insertId }); // zwraca wyniki w formie JSON
  } catch (error) {
    console.error('Error adding group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Aktualizacja kontaktu
app.put('/api/contacts/:id', async (req, res) => {
  const contactId = req.params.id;
  const { name, surname, phone, email, address, groupID: rawGroupID } = req.body;
  const groupID = parseInt(rawGroupID, 10);

  try {
    const connection = await pool;
    const [result] = await connection.query<OkPacket>(
      'UPDATE contacts SET name = ?, surname = ?, phone = ?, email = ?, address = ?, groupID = ? WHERE id = ?',
      [name, surname, phone, email, address, groupID, contactId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact updated successfully' }); // zwraca wyniki w formie JSON
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Usuwanie kontaktu
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const connection = await pool;
    const contactId = parseInt(req.params.id, 10);

    await connection.query('DELETE FROM contacts WHERE id = ?', [contactId]);

    res.json({ message: 'Contact deleted successfully' }); // zwraca wyniki w formie JSON
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Uruchamianie serwera
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});