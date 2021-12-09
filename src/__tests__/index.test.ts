import { app } from "../app";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const request = supertest(app);

describe("Testing the testing environment", () => {
  it("should check that true is true", () => {
    expect(true).toBe(true);
  });
});

describe("Testing the app endpoints", () => {
  beforeAll((done) => {
    mongoose.connect(process.env.MONGO_URL_TEST!).then(() => {
      console.log("Connected to the test database");
      done();
    });
  });

  it("should check that the GET /test endpoint returns a success message", async () => {
    const response = await request.get("/test");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Test successful");
  });

  const validProduct = {
    name: "Test Product",
    price: 200,
  };

  let _id: string;

  it("should check that the POST /products endpoint creates a new product", async () => {
    const response = await request.post("/products").send(validProduct);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBeDefined();
    expect(response.body.price).toBeDefined();
    _id = response.body._id;
  });

  it("should check that the GET /products endpoint returns a list of products", async () => {
    const response = await request.get("/products");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should check that the GET /products with id endpoint returns a specific product", async () => {
    const response = await request.get("/products/" + _id);

    expect(response.status).toBe(200);
  });

  it("should check that the PUT /products with id endpoint updates a specific product", async () => {
    const response = await request
      .put("/products/" + _id)
      .send({ name: "Test Product", price: 200 });

    expect(response.status).toBe(201);
  });

  it("should check that the DELETE /products with id endpoint updates a specific product", async () => {
    const response = await request.delete("/products/" + _id);
    expect(response.status).toBe(204);
  });

  /* afterAll((done) => {
    mongoose.connection.dropDatabase().then(() => {
      console.log("DB dropped");

      mongoose.connection.close().then(() => {
        done();
      });
    });
  });
 */
  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        mongoose.connection.close();
      })
      .then(() => {
        done();
      });
  });

  // it("should test that the GET /products endpoint returns a list of products", async () => {})
});
