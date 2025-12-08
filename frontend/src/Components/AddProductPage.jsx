import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; 
import ProductForm from "./ProductForm";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const emptyProduct = { 
    productName: "",
    brand: "",
    image: "",
    price: "",
    _id: "" 
};

export default function EditProductPage() {
    //navigate and location
    const navigate = useNavigate();
    const location = useLocation(); 

    //states
    const [formData, setFormData] = useState(location.state || emptyProduct);
    const [postResponse, setPostResponse] = useState("");

    //user state
    const [currentUser] = useState(() => {
        // checking if user is authrozied to be here by checking for the jwt authroization token 
        const token = Cookies.get("jwt-authorization");
        if (!token) navigate("/not-authorized");;
        try { 
            return jwtDecode(token).username; 
        } catch { 
            navigate("/not-authorized");
        }
    });

    //authorization check
    useEffect(() => {
        //redirect if not admin or if no data was passed in the navigation state
        if (currentUser !== "admin") {
            navigate("/not-authorized");
        }
        
    }, [currentUser]); 

    //handlers
    const handleOnChange = (e) => {
        setFormData((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        });
    };

    // TODO: recheck this
    const handleAddProduct = async () =>{
        try {
            const token = Cookies.get("jwt-authorization");
            const response = await axios.post("http://localhost:3000/add-product", formData, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            setPostResponse("Product added with success");
            setFormData(emptyProduct); //product  added so we clear the form
        } catch (error) {
            console.error(error);
            setPostResponse(error?.response?.data || "Something went wrong while adding product.");
        }
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleAddProduct();
    };


    return (
        <div className="form-page-container">
            <ProductForm
                handleOnSubmit={handleOnSubmit}
                handleOnChange={handleOnChange}
                formData={formData}
                postResponse={postResponse}
                isEditing={false}
            />
            <a href="/main">Click here to go back to main page</a>
        </div>
    );
}