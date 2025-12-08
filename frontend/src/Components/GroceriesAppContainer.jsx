import { useState, useEffect } from "react";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import axios from "axios";
// ProductForm import 
// import FilterPricesForm from "./FilterPricesForm"; // for filter 
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


export default function GroceriesAppContainer() {
  // ADDED
  const navigate = useNavigate();

  /////////// States ///////////
  const [productQuantity, setProductQuantity] = useState();
  // two new lists: one main product list and one filtered list
  const [mainProductList, setMainProductList] = useState([]); // NEW main list
  const [productList, setProductList] = useState([]); // Filtered list displayed
  const [cartList, setCartList] = useState([]);
  const [postResponse, setPostResponse] = useState("");
  // DELETE formData and isEditing states (Maya handles form now)
  // const [formData, setFormData] = useState({ ... });
  // const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // Mariam's filter state
  
  // AADED: State for current user and admin status
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  //////////useEffect - Authentication and Data Fetching ////////

  // 1. Initial Data Fetch (runs on first load and after a successful add/edit/delete)
  useEffect(() => {
    handleProductsFromDB();
  }, [postResponse]);

  
  // 2. Auth Check and Token Decoding (runs on first load)
  useEffect(() => {
    const jwtToken = Cookies.get("jwt-authorization");
   
    if (!jwtToken) {
        navigate("/"); // Redirect to login if no token
        return;
    }
    
    try {
        const payload = jwtDecode(jwtToken);
        setCurrentUser(payload.username);
        setIsAdmin(payload.username === "admin");

        // We're sending the token with all axios requests to the backend
        // since we have configured the backend to check the request for the token..
        // we found the implementation for that here: 
        // https://axios-http.com/docs/config_defaults 
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } catch (e) {
        console.error("Error while decoding", e);
        Cookies.remove("jwt-authorization");
        navigate("/");
    }
  }, [navigate]);

  // 3. Filter Effect (Runs when activeFilter or mainProductList changes)
  useEffect(() => {
    if (activeFilter === "all") {
        setProductList(mainProductList);
        return;
    }

    const maxPrice = parseFloat(activeFilter);
    
    const filtered = mainProductList.filter((product) => {
        // Price is stored as "$X.XX" so remove the "$" and convert to number
        const priceValue = parseFloat(product.price.replace("$", ""));
        return priceValue < maxPrice;
    });

    setProductList(filtered);
  }, [activeFilter, mainProductList]);


  ////////Handlers//////////

  // Filter Handler (from Mariam's component)
  const handleFilterPrices = (e) => {
    setActiveFilter(e.target.value);
  };

  const initialProductQuantity = (prods) =>
    prods.map((prod) => {
      return { id: prod.id, quantity: 0 };
    });

  const handleProductsFromDB = async () => {
    try {
      const result = await axios.get("http://localhost:3000/products");
      setMainProductList(result.data);
      setProductList(result.data); 
      setProductQuantity(initialProductQuantity(result.data));
    } catch (e) {
      console.log(error.message);
    }
  };


  // DELETE handleOnChange (form is now in Add/Edit pages)
  // const handleOnChange = (e) => { ... }; 
  
  // DELETE handleOnSubmit (form is now in Add/Edit pages)
  // const handleOnSubmit = async (e) => { ... }; 

  // REDIRECT Handler for Edit
  const handleEditProduct = (product) => {
    // Navigate to Maya's EditPage, passing the product data via state
    navigate(`/edit-product`, { state: product });
  };
  
  // DELETE handleUpdateProduct (Maya's page now handles this) 
  // const handleUpdateProduct = async (productId) => { ... }; 
  
  // Handler for DELETE needs to be secured with the token
  const handleDeleteProduct = async (productId) => {      
    try {
      await axios
        .delete(`http://localhost:3000/products/${productId}`)
        .then((result) => {
          console.log(result);
          // Trigger useEffect to refresh product list
          setPostResponse(`Product ID ${productId} deleted.`); 
        });
    } catch (e) {
      console.log(error.message);
      alert(`Delete failed: ${error.response?.data || error.message}`);
    }
  };

  const handleAddQuantity = (productId, mode) => 
    {
       if (mode === "cart") {
            const newCartList = cartList.map((product) => {
                if (product.id === productId) {
                    return { ...product, quantity: product.quantity + 1 };
                }
                return product;
            });
            setCartList(newCartList);
        } else if (mode === "product") {
            const newProductQuantity = productQuantity.map((product) => {
                if (product.id === productId) {
                    return { ...product, quantity: product.quantity + 1 };
                }
                return product;
            });
            setProductQuantity(newProductQuantity);
        }

  }; 
  const handleRemoveQuantity = (productId, mode) =>  {
     if (mode === "cart") {
            const newCartList = cartList.map((product) => {
                if (product.id === productId && product.quantity > 1) {
                    return { ...product, quantity: product.quantity - 1 };
                }
                return product;
            });
            setCartList(newCartList);
        } else if (mode === "product") {
            const newProductQuantity = productQuantity.map((product) => {
                if (product.id === productId && product.quantity > 0) {
                    return { ...product, quantity: product.quantity - 1 };
                }
                return product;
            });
            setProductQuantity(newProductQuantity);
        }
   };
  const handleAddToCart = (productId) => { 
    const product = productList.find((product) => product.id === productId);
        const pQuantity = productQuantity.find(
            (product) => product.id === productId
        );
        const newCartList = [...cartList];
        const productInCart = newCartList.find(
            (product) => product.id === productId
        );
        if (productInCart) {
            productInCart.quantity += pQuantity.quantity;
        } else if (pQuantity.quantity === 0) {
            alert(`Please select quantity for ${product.productName}`);
        } else {
            newCartList.push({ ...product, quantity: pQuantity.quantity });
        }
        setCartList(newCartList); 
      };

  const handleRemoveFromCart = (productId) => {
     const newCartList = cartList.filter((product) => product.id !== productId);
        setCartList(newCartList);
       };

  const handleClearCart = () => {
    setCartList([]);
  };


  const handleUpdateProduct = async (productId, updatedFormData) => {
    try {
      await axios
        .patch(`http://localhost:3000/products/${productId}`, updatedFormData)
        .then((result) => {
          setPostResponse(result.data); 
        });
    } catch (e) {
      console.log(error.message);
      alert(`Update failed: ${error.response?.data || error.message}`);
    }
  };


  /////////Renderer
  // The ProductForm component is now completely gone from the main page
  return ( 
    <div>
      <NavBar 
        quantity={cartList.length}
        username={currentUser}
      />
      <div className="GroceriesApp-Container">

        <ProductsContainer
          products={productList} 
          handleEditProduct={handleEditProduct} // Now redirects to Maya's page
          handleDeleteProduct={handleDeleteProduct} // Secured delete handler
          // ADDED ADMIN PROP
          isAdmin={isAdmin}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}


