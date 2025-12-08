export default function FilterPricesForm({ handleFilterPrices }) {
  return (
    <div className="FilterPricesForm">
      <h2>Filter Price</h2>
      <form action="">
        <input
          type="radio"
          name="priceFilter"
          id="all"
          value="all"
          onChange={handleFilterPrices}
          defaultChecked
        />
        <label htmlFor="all">All Prices</label>
        <br />
        
        
        <input
          type="radio"
          name="priceFilter"
          id="100" 
          value={1.0} 
          onChange={handleFilterPrices}
        />
        <label htmlFor="100">{"< 1.00$"}</label>
        <br />
        
       
        <input
          type="radio"
          name="priceFilter"
          id="200" 
          value={2.0}
          onChange={handleFilterPrices}
        />
        <label htmlFor="200">{"< 2.00$"}</label>
        <br />
        
        
        <input
          type="radio"
          name="priceFilter"
          id="400" 
          value={4.0}
          onChange={handleFilterPrices}
        />
        <label htmlFor="400">{"< 4.00$"}</label>
        <br />
        
        
        <input
          type="radio"
          name="priceFilter"
          id="600" 
          value={6.0}
          onChange={handleFilterPrices}
        />
        <label htmlFor="600">{"< 6.00$"}</label>
        <br />
        
        <input
          type="radio"
          name="priceFilter"
          id="900" 
          value={9.0}
          onChange={handleFilterPrices}
        />
        <label htmlFor="900">{"< 9.00$"}</label>
      </form>
    </div>
  );
}