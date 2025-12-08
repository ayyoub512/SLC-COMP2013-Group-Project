import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function NavBar({ quantity, username, setCurrentUser }) { // pass the usernme parameter to this component
  const navigate = useNavigate();

  // handle logout button
  const handleLogout = () => {
    Cookies.remove("jwt-authorization");
    setCurrentUser(""); // reset the current user
    navigate("/");
  };

  // redirects to add-product
  const handleAddProduct = () => {
    navigate("/add-product");
  };

  return (
    <nav className="NavBar">
      <div className="NavDiv NavUser">
        <h3>Hello, {username}</h3>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
      <div className="NavDiv NavTitle"> 
        <h2>Groceries App 🍎</h2>
        {username == "admin" && <button onClick={() => handleAddProduct()}>Add New Product</button>  }
      </div>
      <div className="NavDiv NavCart">
        <img
          src={
            quantity > 0
              ? "src/assets/cart-full.png"
              : "src/assets/cart-empty.png"
          }
        />
      </div>
    </nav>
  );
}
