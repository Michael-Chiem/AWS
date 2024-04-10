const router = require('express').Router();
const { Product } = require('../../models');
const withAuth = require('../../utils/auth');
const { Op } = require("sequelize");
const path = require('path'); // Import path module for file path manipulation

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll();
    res.json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route to get a specific product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productDetails = {
      ...product.get({ plain: true })
    };

    res.json(productDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

// Route to create a new product (including file upload)
router.post('/', withAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.files.file;

    // Define the upload directory path
    const uploadDir = path.join(__dirname, '../../upload'); // Assuming 'upload' folder is in the root directory

    // Save file to disk in the 'upload' folder
    const filePath = path.join(uploadDir, file.name);
    file.mv(filePath);

    // Create product record in the database
    const newProduct = await Product.create({
      name,
      // Add other product properties here
      // For example:
      // location: req.body.location,
      // startTime: req.body.startTime,
      // stopTime: req.body.stopTime,
      // user_id: req.session.user_id,
      // file: filePath, // Save file path in database
    });

    res.status(200).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Route to update a product by ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.update(req.body, {
      where: { id }
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Route to delete a product by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProductCount = await Product.destroy({
      where: { id }
    });

    if (deletedProductCount === 0) {
      res.status(404).json({ message: 'No Product found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Route to search for products by name
router.get('/search', withAuth, async (req, res) => {
  try {
    const { search } = req.query;

    const productData = await Product.findAll({
      where: {
        name: {
          [Op.substring]: search
        }
      }
    });

    res.status(200).send(productData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
