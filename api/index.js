import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 4000;
const app = express()

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://alexanderbeaumierdev:Axbevd2023@cluster0.jrltrwi.mongodb.net/EmbroideryApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Database Connected'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Express App is Running');
}); 

// Image Storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({storage: storage});

// Create upload endpoint for img http://localhost:4000/images/   key = product  then enter file image
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for Product
const Product = mongoose.model("Product", {
    id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    new_price:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
});

//localhost:4000/addproduct
app.post("/addproduct", async (req, res) => { // include req and res here
    let products = await Product.find({});
    let id;
    if (products.length > 0) 
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
    });

    try {
        // Save the product to the database
        await product.save();
        console.log("Product Saved");

        // Send a success response
        res.json ({
            success: true,
            name: req.body.name,
        });

    } catch (error) {
        // Log the error and send an error response
        console.error("Error saving product:", error);
        res.status(500).json({
            success: false,
            message: "There was an error saving the product.",
        });
    }
});

// creating API to delete product http://localhost:4000/deleteproduct/66353ab978ca7efeed1f056a  you have to input the id of the product you want to delete from mongoDB

app.delete("/deleteproduct/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete product with id: ${id}`);

    Product.findOneAndDelete({ _id: id })
        .then(deletedProduct => {
            if (!deletedProduct) {
                console.log(`No product found for id: ${id}`);
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            console.log(`Product Deleted: ${deletedProduct}`);
            res.json({
                success: true,
                message: "Product successfully deleted",
                productId: id
            });
        })
        .catch(error => {
            console.error(`Error deleting product with id: ${id}`, error);
            res.status(500).json({
                success: false,
                message: "There was an error deleting the product.",
                error: error.message
            });
        });
});

// creating API to get all products 

app.get("/allproducts", async (req, res) => {
    try {
        const products = await Product.find({});
        
        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found",
            });
        }

        res.json({
            success: true,
            message: "Products retrieved successfully",
            products: products
        });
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({
            success: false,
            message: "There was an error retrieving the products.",
            error: error.message
        });
    }
});

const Users = mongoose.model("Users", {
    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now
    },
});

// http://localhost:4000/signup 
// creating API to registering user
app.post("/signup", async (req, res) => {

    let check = await Users.findOne({email: req.body.email});
    if(check){
        return res.json(400).json({success: false, errors: "Email already exists"});
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();

    const data = {
        user: {
            id: user.id,
        }
    }

    const token = jwt.sign(data, "secret_ecom")
    res.json({success: true, token});
});

// created endpoint for user ;pogin http://localhost:4000/login
app.post("/login", async (req, res) => {
    try {
        // Find user
        let user = await Users.findOne({email: req.body.email});
        if(!user){
            return res.status(400).json({success: false, errors: "Email not found"});
        }

        // Compare password
        const passCompare = req.body.password === user.password;
        if (!passCompare) {
            return res.status(400).json({success: false, errors: "Password is incorrect"});
        }

        // Create JWT
        const data = {
            user: {
                id: user._id,
            }
        };

        const token = jwt.sign(data, process.env.JWT_SECRET || "secret_ecom");

        // Send success response
        res.json({success: true, token});
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({success: false, message: "An error occurred during login."});
    }
});

app.listen(port, error => {
    if (!error) {
        console.log(`Server is running on port ${port}`);
    } else {
        console.log(error);
    }
})


