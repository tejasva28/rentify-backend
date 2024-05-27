const fs = require('fs');
const path = require('path');
const Property = require('../models/Property');

const saveBase64Image = (base64String, fileName) => {
  const buffer = Buffer.from(base64String, 'base64');
  const filePath = path.join(__dirname, '../uploads', fileName);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProperty = async (req, res) => {
  console.log('Received request body:', req.body); // Log received data

  try {
    let imageUrl = '';

    if (req.body.imageBase64) {
      const fileName = `${Date.now()}.jpg`; // or any other extension based on the image type
      const filePath = saveBase64Image(req.body.imageBase64, fileName);
      imageUrl = `/uploads/${fileName}`;
    }

    const property = new Property({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      price: req.body.price,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      area: req.body.area,
      imageUrl
    });

    await property.save();
    console.log('Property saved:', property); // Log saved property
    res.status(201).json(property);
  } catch (error) {
    console.error('Error saving property:', error); // Log error details
    res.status(500).json({ message: 'Internal server error', error });
  }
};
