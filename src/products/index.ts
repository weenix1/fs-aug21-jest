import express from "express";
import { ProductModel } from "./model";

const productsRouter = express.Router();

productsRouter
  .get("/", async (req, res) => {
    const products = await ProductModel.find({});
    res.send(products);
  })
  .post("/", async (req, res) => {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).send(product);
  });

productsRouter
  .get("/:id", async (req, res) => {
    try {
      const product = await ProductModel.findById(req.params.id);
      res.status(200).send({ product });
    } catch (error) {
      console.log(error);
    }
  })
  .put("/:id", async (req, res) => {
    try {
      const editedProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(201).send({ editedProduct });
    } catch (error) {
      console.log(error);
    }
  })
  .delete("/:id", async (req, res) => {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(
        req.params.id
      );
      // const deletedReviews = reviews.deleteMany({})
      res.status(204).send({});
    } catch (error) {
      console.log(error);
    }
  });

export default productsRouter;
