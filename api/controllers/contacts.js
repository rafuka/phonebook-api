const mongoose = require('mongoose');
const Contact = require('../models/Contact');

const FULL_URL = `${process.env.API_URL}:${process.env.API_PORT}`;

module.exports = {
  getAllContacts: (req, res, next) => {
    const userId = req.userData.id;
  
    Contact.find({ user_id: userId }).exec()
      .then(contacts => {
        if (contacts) {
          const response = {
            count: contacts.length,
            contacts: contacts.map(contact => {
              return {
                id: contact._id,
                name: contact.name,
                phone: contact.phone,
                address: contact.address,
                requests: [
                  {
                    method: 'GET',
                    description: 'Fetch contact data',
                    url: `${FULL_URL}/contacts/${contact._id}`
                  },
                  {
                    method: 'PATCH',
                    description: 'Update/modify contact',
                    url: `${FULL_URL}/contacts/${contact._id}`
                  },
                  {
                    method: 'DELETE',
                    description: 'Delete contact',
                    url: `${FULL_URL}/contacts/${contact._id}`
                  }
                ]
              }
            }),
            requests: [
              {
                method: 'POST',
                description: 'Create new contact',
                url: `${FULL_URL}/contacts/`
              }
            ]
          }
  
          res.status(200).json(response);
        }
        else {
          const error = new Error('No contacts found');
          error.status = 404;
          next(error);
        }
      })
      .catch(err => {
        const error = new Error('Could not fetch contacts from database');
        error.status = 500;
        error.server = err;
        next(error);
      });
  },
  getContact: (req, res, next) => {
    const id = req.params.contactId;
  
    Contact.findById(id).exec()
      .then(contact => {
        if (contact) {
          const response = {
            id: contact._id,
            name: contact.name,
            phone: contact.phone,
            address: contact.address,
            requests: {
              get: {
                method: 'GET',
                description: 'Fetch contact data',
                url: `${FULL_URL}/contacts/${contact._id}`
              },
              patch: {
                method: 'PATCH',
                description: 'Update/modify contact',
                url: `${FULL_URL}/contacts/${contact._id}`
              },
              delete: {
                method: 'DELETE',
                description: 'Delete contact',
                url: `${FULL_URL}/contacts/${contact._id}`
              }
            }
          }
  
          res.status(200).json(response);
        }
        else {
          const error = new Error('Contact not found');
          error.status = 404;
          next(error);
        }
      })
      .catch(err => {
        const error = new Error('Could not fetch contact from database');
        error.status = 500;
        error.server = err;
        next(error);
      });
  },
  createContact: (req, res, next) => {
    const contactData = req.body;
  
    const contact = new Contact({
      _id: new mongoose.Types.ObjectId(),
      name: contactData.name,
      phone: contactData.phone,
      address: contactData.address,
      user_id: req.userData.id
    });
  
    contact.save()
      .then(contact => {
        const response = {
          createdContact: {
            id: contact._id,
            name: contact.name,
            phone: contact.phone,
            address: contact.address,
            requests: {
              get: {
                method: 'GET',
                description: 'Fetch contact data',
                url: `${FULL_URL}/contacts/${contact._id}`
              },
              patch: {
                method: 'PATCH',
                description: 'Update/modify contact',
                url: `${FULL_URL}/contacts/${contact._id}`
              },
              delete: {
                method: 'DELETE',
                description: 'Delete contact',
                url: `${FULL_URL}/contacts/${contact._id}`
              }
            }
          }
        }
  
        res.status(201).json(response);
      })
      .catch(err => {
        const error = new Error('Could not save contact to database');
        error.status = 500;
        error.server = err;
        next(error);
      });
  },
  updateContact: (req, res, next) => {
    const id = req.params.contactId;
    const toUpdate = {};
  
    for (let ops of req.body) {
      toUpdate[ops.prop] = ops.value;
    }
  
    Contact.update({ _id: id }, { $set: toUpdate }).exec()
      .then(contact => {
        const response = {
          message: 'Contact updated successfully',
          requests: [
            {
              method: 'GET',
              description: 'Fetch contact data',
              url: `${FULL_URL}/contacts/${id}`
            },
            {
              method: 'PATCH',
              description: 'Update/modify contact',
              url: `${FULL_URL}/contacts/${id}`
            },
            {
              method: 'DELETE',
              description: 'Delete contact',
              url: `${FULL_URL}/contacts/${id}`
            }
          ]
        }
  
        res.status(200).json(response);
      })
      .catch(err => {
        const error = new Error('Could not update contact info.');
        error.status = 500;
        error.server = err;
        next(error);
      });
  },
  deleteContact: (req, res, next) => {
    const id = req.params.contactId;
  
    Contact.remove({ _id: id }).exec()
      .then(result => {
        const response = {
          message: 'Contact deleted',
          requests: [
            {
              method: 'GET',
              description: 'Fetch all contacts\' data',
              url: `${FULL_URL}/contacts/`
            },
            {
              method: 'POST',
              description: 'Create new contact',
              url: `${FULL_URL}/contacts/`
            },
          ]
        }
  
        res.status(200).json(response);
      })
      .catch(err => {
        const error = new Error('Could not delete contact from database');
        error.status = 500;
        error.server = err;
        next(error);
      });
  }
}