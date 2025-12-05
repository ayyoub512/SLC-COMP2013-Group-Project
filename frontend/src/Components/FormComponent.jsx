import "../App.css";


export default function FormComponent({
  formData,
  handleOnSubmit,
  handleOnChange,
  nextPage,
  postResponse,
}) {

  return (
    <div className="FormComponent">
      <h1>{nextPage === "login" ? "Create a new user" : "Groceries App"}</h1>
      <form onSubmit={handleOnSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleOnChange}
          />
        </div>
        <button>Submit</button>
      </form>
      <a href={nextPage === "login" ? "/" : "/create-user"}>
        {nextPage === "login" ? "Back to login page" : "Not a member yet? click here to join"}
      </a>
      <p className="responseForLogin">{postResponse}</p>
    </div>
  );
}
