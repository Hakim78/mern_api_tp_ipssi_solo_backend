const Product = require("../Models/productsModels");

const createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            owner: req.user.id
        });

        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        let query = {};
        
        // Recherche par nom (bonus)
        if (req.query.search) {
            query = {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } }
                ]
            };
        }

        // Filtre par catégorie (bonus)
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filtre par prix (bonus)
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        const products = await Product.find(query).populate('owner', 'username email');
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('owner', 'username email');
        
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ 
            _id: req.params.id,
            owner: req.user.id 
        });

        if (!product) {
            return res.status(404).send({ error: 'Product not found or unauthorized' });
        }

        Object.assign(product, req.body);
        await product.save();
        
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!product) {
            return res.status(404).send({ error: 'Product not found or unauthorized' });
        }

        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};