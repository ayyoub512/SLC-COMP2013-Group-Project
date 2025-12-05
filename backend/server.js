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

// Function used to verify if the passed in token is valid or not
// https://medium.com/@diego.coder/protect-your-routes-in-node-js-with-jwt-and-express-authentication-75ab80acf43a
function verifyToken(req, res, next) {
	const header = req.header("Authorization") || "";
	const token = header.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Token not provied" });
	}
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		req.username = payload.username;
		next();
	} catch (error) {
		return res.status(403).json({ message: "Token not valid" });
	}
}

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
server.post("/add-product", verifyToken, async (request, response) => {
	try {
		// Checking if it's the admin.. req.username is a thing because fo the verifyToken function
		if (request?.username !== "admin") {
			return response.status(403).end("Only admin user can perform this action");
		}
		const { productName, brand, image, price } = request.body;
		const id = crypto.randomUUID();
		const product = new Product({
			productName,
			brand,
			price,
			image,
			id
		});

		await product.save();
		response.status(201).send(`${productName} added\nwith id: ${id}`);
	} catch (error) {
		console.log("Error: ", error.message);
		response.status(500).end("Error while adding product");
	}
});

// Deleting a product by given :id
server.delete("/products/:id", verifyToken, async (request, response) => {
	try {
		// Checking if it's the admin.. req.username is a thing because fo the verifyToken function
		if (request?.username !== "admin") {
			return response.status(403).end("Only admin user can perform this action");
		}

		const { id } = request.params;
		const result = await Product.findByIdAndDelete(id);
		console.log(result);
		response.status(200).send(result);
	} catch (error) {
		console.log(error.message);
		response.status(500).end("Error while deleting product");
	}
});

// Upadting product by ID
server.patch("/products/:id", verifyToken, async (request, response) => {
	try {
		// Checking if it's the admin.. req.username is a thing because fo the verifyToken function
		if (request?.username !== "admin") {
			return response.status(403).end("Only admin user can perform this action");
		}

		const prodId = request.params.id;
		const { productName, brand, image, price, id } = request.body;

		await Product.findByIdAndUpdate(prodId, {
			productName,
			brand,
			image,
			price,
			id
		});
		response.status(200).send(`${productName} edited\nwith id: ${prodId}`);
	} catch (error) {
		console.log(error.message);
		response.status(500).end("Error while updating product");
	}
});

// Creating a new user route
server.post("/create-user", async (request, response) => {
	const { username, password } = request.body;
	console.log(username, password);
	try {
		//Hashing a password need bcrypt and salt rounds as an int
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			username,
			password: hashedPassword
		});
		await newUser.save();
		response.send({ message: `Congrats! created username ${username}` });
	} catch (error) {
		console.log(error);
		response.status(500).send({ message: `The username is already taken. Please try another!` });
	}
});

// Login route
server.post("/login", async (request, response) => {
	const { username, password } = request.body;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return response.status(404).send({ message: "Username doesnot exist" });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return response.status(403).send({ message: "Bad username or password" });
		}

		const jwtToken = jwt.sign({ id: user._id, username }, JWT_SECRET);
		return response.status(201).send({ message: "User Authenticated", token: jwtToken });
	} catch (error) {
		response.status(500).send({ message: error.message });
	}
});
