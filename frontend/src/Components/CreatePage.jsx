import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormComponent from "./FormComponent";
import "../App.css";


export default function CreatePage() {
  //States
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [postResponse, setPostResponse] = useState("");

  //Navigate
  const navigate = useNavigate();

  //Handlers
  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };

  const handleLogup = async () => {
    try {
      const response = await axios.post("http://localhost:3000/create-user", {
        ...formData,
      });
      setPostResponse(response.data);
    } catch (error) {
      console.log(error);
      setPostResponse(error.response.data.message || "Login Failed!");
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    handleLogup();
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="FormComponentContainer">
      <FormComponent
        formData={formData}
        postResponse={postResponse}
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
        nextPage="login"
      />
    </div>
  );
}
