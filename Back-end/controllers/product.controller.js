import { compare } from "bcryptjs";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getAllProducts = async (req, res)=>{
 try {
    const products = await Product.find({});
    res.json(products);

    
 } catch (error) {
  console.log("Error getting products", error.message);
  res.status(500).json({message: "SERVER ERROR", error: error.message});
    
 }
};

export const getFeaturedProducts = async (req, res)=>{
    try {
        let featuredProducts = await Product.find("featured_products");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));
        }
         //lean is gonna return the data as an object instead of a mongodb document..
        featuredProducts = await Product.find({isFeatured : true}).lean(); 
        if (!featuredProducts) {
            return res.status(401).json({message : "No featured products found"});     
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error getting featured Products ", error.message);
        res.status(500).json({message: "server error", error: error.message});
    }
};

export const createProduct = async (req, res)=>{
    try {
        const {name, description, price, category, image}= req.body;

        let cloudinaryResponse = null;

        if(image){
         cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"products"});
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
        })

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};


export const deleteProduct = async (req, res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message : "Product not found"});
        }

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("image deleted");
            } catch (error) {
                console.log("error deleting image", error.message);
            }
        }
         await Product.findByIdAndDelete(req.params.id);
         res.json({message : "Product deleted successfully"});
    } catch (error) {

        console.log("Error deleting products", error,message);
        res.status(500).json({message:"server error", error: error.message});
        
    }
};

export const getRecomendedProducts = async (req, res)=>{
    try {
        const products = await Product.aggregate([
            {
                $sample : {size :3}
            },
            {
                $project :{
                    _id:1,
                    name: 1,
                    description:1,
                    image:1,
                    price:1,
                    
                }
            }
        ])
        res.json(products);

    } catch (error) {

        res.status(500).json({message: "server error", error: error,message});
        
    }
};


export const getProductsByCategory = async (req, res)=>{
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        res.json(products);
    } catch (error) {
         console.log("Error getting products by category", error.message);
        res.status(500).json({message: "server error", error: error,message});
    }
};


export const toggleFeatureProduct = async (req, res)=>{
    
    try {
        const products = await Product.findById(req.params.id);
        if(products){
            products.isFeatured = !products.isFeatured;
            const updatedProduct = await products.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        }
        else{
            res.status(404).json({message : "Product not found"});
        }
    } catch (error) {
         console.log("Error in toggling featured roducts ", error.message);
        res.status(500).json({message: "server error", error: error,message});
    }
};

async function updateFeaturedProductsCache(){
    try {
        const featuredProducts = await Product.find({isFeatured : true}).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {

        console.log("Error in update Cache", error.message);

        
    }
    
};
