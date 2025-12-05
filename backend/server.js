const express = require("express");
const server = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/product");
const User = require("./models/user");
const port = 3000;

require("dotenv").config();
const { DB_URI, JWT_SECRET } = process.env;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Connecting to Mongodb
mongoose
	.connect(DB_URI)
	.then(() => {
		server.listen(port, () => {
			console.log(`Connected to DB\nServer is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});

// It works
server.get("/", (request, response) => {
	response.send("LIVE!");
});

// Fetching all products
server.get("/products", async (request, response) => {
	try {
		await Product.find().then((result) => response.status(200).send(result));
	} catch (error) {
		console.log(error.message);
	}
});

// Adding a new product
server.post("/add-product", async (request, response) => {
	const { productName, brand, image, price } = request.body;
	const id = crypto.randomUUID();
	const product = new Product({
		productName,
		brand,
		price,
		image,
		id
	});

	try {
		await product.save().then((result) => response.status(201).send(`${productName} added\nwith id: ${id}`));
	} catch (error) {
		console.log(error.message);
	}
});

// Deleting a product by given :id
server.delete("/products/:id", async (request, response) => {
	const { id } = request.params;
	try {
		await Product.findByIdAndDelete(id).then((result) => {
			console.log(result);
			response.status(200).send(result);
		});
	} catch (error) {
		console.log(error.message);
	}
});

// Upadting product by ID
server.patch("/products/:id", async (request, response) => {
	const prodId = request.params.id;
	const { productName, brand, image, price, id } = request.body;

	try {
		await Product.findByIdAndUpdate(prodId, {
			productName,
			brand,
			image,
			price,
			id
		}).then((result) => response.status(200).send(`${productName} edited\nwith id: ${prodId}`));
	} catch (error) {
		console.log(error.message);
	}
});

// Creating a new user route
server.post("/create-user", async (request, response) => {
	const { username, password } = request.body;
	const hashedPassword = await bcrypt.hash(password, 12);

	const newUser = new User({
		username,
		password: hashedPassword
	});

	try {
		await newUser.save().then((result) => response.send(`${username} is created with success!`));
	} catch (error) {
		response.send(`create-user error: ${error.message}`);
	}
});

server.post("/login", async (request, response) => {
	try {
		const { username, password } = request.body;

		const user = await User.findOne({ username });
		if (!user) {
			return responses.tatus(400).send({ message: "Username doesn't exist" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return response.status(400).send({ message: "Bad username or password" });
		}

		const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

		return response.send({
			message: "User authenticated",
			token
		});
	} catch (error) {
		console.error(error);
		return response.status(500).send({ message: "Server error" });
	}
});
