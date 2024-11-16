import express from 'express';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json());

const prisma = new PrismaClient().$extends(withAccelerate());

app.get('/api/v1/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contacts.findMany();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/v1/contacts', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, company, jobTitle } = req.body;

  try {
    const newContact = await prisma.contacts.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        company,
        jobTitle,
      },
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.put('/api/v1/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, company, jobTitle } = req.body;

  try {
    const updatedContact = await prisma.contacts.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        company,
        jobTitle,
      },
    });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/api/v1/contacts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.contacts.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

const port = 9000;

app.listen(port, () => {
  console.log('Server is running at', port);
});
