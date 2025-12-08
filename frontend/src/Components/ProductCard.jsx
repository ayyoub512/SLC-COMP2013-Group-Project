import QuantityCounter from "./QuantityCounter";
import { useNavigate } from "react-router-dom";
export default function ProductCard({
  productName,
  brand,
  image,
  price,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  isAdmin,
  id,
  // handleEditProduct,
  _id,
  handleDeleteProduct,
}) {
  const navigate = useNavigate();
  console.log("Admin", isAdmin);

  const handleEditClick = () => {
    const productData = {
      price,
      brand,
      productName,
      image,
      _id,
    };
    navigate("/edit-product", { state: productData });
  };
  return (
    <div className="ProductCard">
      <h3>{productName}</h3>
      <img src={image} alt="" />
      <h4>{brand}</h4>
      <QuantityCounter
        handleAddQuantity={handleAddQuantity}
        productQuantity={productQuantity}
        handleRemoveQuantity={handleRemoveQuantity}
        id={id}
        mode="product"
      />
      <h3>{price}</h3>
      <button onClick={() => handleAddToCart(id)}>Add to Cart</button>
      {isAdmin && (
        <div>
          <button id="edit-button" onClick={() => handleEditClick()}>
            Edit
          </button>
          <button
            className="RemoveButton"
            onClick={() => handleDeleteProduct(_id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
