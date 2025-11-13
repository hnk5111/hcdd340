// horizontal version
function addItem() {
    // let list = document.querySelector("#inventoryList")
    let inventorySection = document.querySelector("#inventorySection")
    let itemText = document.querySelector("#addInventoryItemInput").value

    let newCheckbox = document.createElement("input")
    newCheckbox.setAttribute("type", "checkbox")
    newCheckbox.setAttribute("value", itemText)
    newCheckbox.setAttribute("id",itemText)
    newCheckbox.textContent = itemText
    let newCheckboxLabel = document.createElement("label")
    newCheckboxLabel.setAttribute("for","#"+itemText)
    newCheckboxLabel.textContent = itemText


    inventorySection.append(newCheckbox)
    inventorySection.append(newCheckboxLabel)

    // list.append(newCheckbox)
    // newCheckbox.append(newCheckboxLabel)
}


// vertical version
function addListItem() {
    let list = document.querySelector("#inventoryList")
    let inventorySection = document.querySelector("#inventorySection")
    let itemText = document.querySelector("#addInventoryItemInput").value

    let newCheckbox = document.createElement("input")
    newCheckbox.setAttribute("type", "checkbox")
    // .type = "checkbox"
    newCheckbox.setAttribute("value", itemText)
    // .value = itemText
    newCheckbox.setAttribute("id",itemText)
    newCheckbox.textContent = itemText
    // .id = itemText
    let newCheckboxLabel = document.createElement("label")
    newCheckboxLabel.setAttribute("for","#"+itemText)
    newCheckboxLabel.textContent = itemText
    // newCheckboxLabel.setAttribute("value",itemText)
    // .for = "#"+itemText

    let li = document.createElement("li")
    li.appendChild(newCheckbox)
    li.append(newCheckboxLabel)

    list.append(li)

    // list.append(newCheckbox)
    // newCheckbox.append(newCheckboxLabel)

    // sample code for a checkbox input
    // <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
    /* <label for="vehicle1"> I have a bike</label><br></br> */
}

// runs on startup
generateSuggestedInventory()
function generateSuggestedInventory() {
    // Hannah update this list if needed
    let suggestions = ["water","wrist straps", "lifting belt", "carbs"]
    let div = document.querySelector("#suggestedInventoryItems")

    for(let i = 0; i < suggestions.length; i++) {
        let button = document.createElement("button")
        button.textContent = suggestions[i]
        div.append(button)
    }
}