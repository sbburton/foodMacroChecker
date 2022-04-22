
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
      console.log('all API data.product', data.product) // <- all data
      const item = new ProductInfo(data.product)

      // healthy grades and leves
      console.log(data.product.nutriscore_grade)
      console.log(data.product.nutrient_levels)

      // calories per serving
      console.log(data.product.nutriments.energy_serving)

      // macros per serving
      console.log(data.product.nutriments.carbohydrates_serving)
      console.log(data.product.nutriments.carbohydrates_unit)
      console.log(data.product.nutriments.fat_serving)
      console.log(data.product.nutriments.fat_unit)
      console.log(data.product.nutriments.proteins_serving)
      console.log(data.product.nutriments.proteins_unit)
      
      // call additional stuff if ingredients found
      if (data.status === 1) {
        
        // display image and name
        item.showInfo()
        
        // self check
        // console.log('item.ingredients', item.ingredients)

        item.showMacros()

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

    this.carbs = productData.nutriments.carbohydrates_serving
    this.carbsUnit = productData.nutriments.carbohydrates_unit

    this.fats = productData.nutriments.fat_serving
    this.fatsUnit = productData.nutriments.fat_unit

    this.proteins = productData.nutriments.proteins_serving
    this.proteinsUnit = productData.nutriments.proteins_unit

    this.calories =productData.nutriments.energy_serving
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

        // get ingredients and vegetarian statuses (stati?)
        let newIText = document.createTextNode(this.ingredients[key].text)
        let vegStatus = this.ingredients[key].vegetarian || "unknown"
        let newVText = document.createTextNode(vegStatus)

        newICell.appendChild(newIText)
        newVCell.appendChild(newVText)
      }
    }
  }
  // DISPLAY MACROS FUNCTION
  showMacros() {
    let tableRef = document.querySelector('#macros-table')

    // delete (potential) rows from previous searches
    for (let i = 1; i < tableRef.rows.length;) {
      tableRef.deleteRow(i)
    }

    // ADD FATS, CARBS, PROTEISN & UNITS PER SERVING
    if (this.fats !== null) {
      let newRow = tableRef.insertRow(1)
      let newFCell = newRow.insertCell(0)
      let newFText = document.createTextNode(this.fats + " " + this.fatsUnit)
      newFCell.appendChild(newFText)
      
      // ADD CARBS G PER SERVING
      if (this.carbs !== null) {
        let newCCell = newRow.insertCell(1)
        let newCText = document.createTextNode(this.carbs + " " + this.carbsUnit)
        newCCell.appendChild(newCText)
      }

      // ADD PROTEINS G PER SERVING
      if (this.proteins !== null) {
        let newPCell = newRow.insertCell(2)
        let newPText = document.createTextNode(this.proteins + " " + this.proteinsUnit)
        newPCell.appendChild(newPText)
      }

    }
  }


}
