
// autofill input on load
document.querySelector("#barcode").value = '3017620429484'


function getFetch() {

  // input value from input on mainpage
  let inputVal = document.querySelector("#barcode").value
  
  // NOT ALL UPCs ARE 12 DIGITS ie NUTELLA
  // if (inputVal.length !== 12) {
  //   alert('Please ensure that barcode is 12 characters')
  //   return;
  // }
  
  // make API Call
  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

  fetch(url)
    .then(res => res.json())
    .then(data => {
      // console.log('all API data', data) // <- all data
      const item = new ProductInfo(data.product)
      
      // call additional stuff if ingredients found
      if (data.status === 1) {
        
        // display image and name
        item.showInfo()
        
        // self check
        // console.log('item.ingredients', item.ingredients)

        // show all ingredients of item
        item.showIngredients()

      } else if (data.status === 0) {
        alert(`Product ${inputVal} not found`)
      }
    })
    .catch(err => {
      console.log(`error: ${err}`)
    });
}

class ProductInfo {
  // passing in data.product
  constructor(productData) {
    this.name = productData.product_name
    this.ingredients = productData.ingredients
    this.image = productData.image_url
  }

  showInfo() {
    document.querySelector('#product-image').src = this.image
    document.querySelector('#product-name').innerHTML = this.name
  }

  showIngredients() {
    let tableRef = document.querySelector('#ingredient-table')
    
    // delete (potential) rows from previous searches
    for (let i = 1; i < tableRef.rows.length;) {
      tableRef.deleteRow(i)
    }

    if (this.ingredients !== null) {
     for (let key in this.ingredients) {
        // build ingredient table
        let newRow = tableRef.insertRow(-1)
        let newICell = newRow.insertCell(0)
        let newVCell = newRow.insertCell(1)

        // get ingredients and 
        let newIText = document.createTextNode(this.ingredients[key].text) 
        let vegStatus = this.ingredients[key].vegetarian
        let newVText = document.createTextNode(vegStatus)

        newICell.appendChild(newIText)
        newVCell.appendChild(newVText)
      }
    }
  }
}