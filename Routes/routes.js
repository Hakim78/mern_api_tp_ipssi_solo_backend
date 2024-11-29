const express = require ("express");
const {
    registerUser, 
    loginUser,
    updateUser,
    deleteUser,
    getUser
} = require("../Controllers/userControllers");

const { 
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../Controllers/productsControllers");   

const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router();

// User routes 
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

// Product routes

router.post("/products", authMiddleware, createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/update/:id", authMiddleware, updateProduct);
router.delete("/delete/:id", authMiddleware, deleteProduct);

module.exports = router;