import "./App.css";
import products from "./data/products";
import GroceriesAppContainer from "./Components/GroceriesAppContainer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import CreatePage from "./Components/CreatePage";
import AddProductPage from "./Components/AddProductPage"
import EditProductPage from "./Components/EditProductPage";

function App() {
  return (
    // <>
    //   <GroceriesAppContainer products={products} />
    // </>

    <>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-user" element={<CreatePage />} />
        <Route path="/main" element={<GroceriesAppContainer products={products} />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/edit-product" element={<EditProductPage />} />
      </Routes>
    </Router>
  </>
  );
}

export default App;
