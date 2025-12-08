import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; 
import ProductForm from "./ProductForm"; 
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


export default function EditProduct() {
    //navigate and location
    const navigate = useNavigate(); 
    const location = useLocation(); 

    //states
    const [formData, setFormData] = useState(location.state);
    const [postResponse, setPostResponse] = useState("");

    //user state
    const [currentUser] = useState(() => {
        const token = Cookies.get("jwt-authorization");
        if (!token) navigate("/not-authorized");
        try { 
            return jwtDecode(token).username; 
        } catch { 
            navigate("/not-authorized");
        }
    });

    useEffect(() => {
        //redirect if not admin
        if (currentUser !== "admin") {
            navigate("/not-authorized");
            return;
        }

        //checking if req product data is passed
        if (!location.state || !location.state._id) {
             setPostResponse("Couldn't find product data for editing.");
        }
        
    }, [currentUser, navigate, location.state]); 

    //handlers
    const handleOnChange = (e) => {
        setFormData((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        });
    };


    const handleSaveEdits = async () =>{
        const productId = formData._id;

        try {
            const token = Cookies.get("jwt-authorization");
            //updating existing product by using its id
            const response = await axios.patch(`http://localhost:3000/products/${productId}`, formData, { 
                 headers: { Authorization: `Bearer ${token}` }
            });
            
            setPostResponse(`Product ${formData.productName} saved!`); 
        } catch (error) {
            console.error("Edit Error:", error);
            setPostResponse(error?.response?.data || "Something went wrong while saving product.");
        }
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleSaveEdits();
    };


    return (
        <div className="form-page-container">
            <ProductForm
                submitButtonText={`Save ${formData.productName} to Inventory`} 
                handleOnSubmit={handleOnSubmit}
                handleOnChange={handleOnChange}
                formData={formData}
                postResponse={postResponse}
                isEditing={true}
            />
            <a href="/main">Back to Main Page</a>
        </div>
    );
}