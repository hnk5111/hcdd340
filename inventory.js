// horizontal version
function addItem() {
    // let list = document.querySelector("#inventoryList")
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

    inventorySection.append(newCheckbox)
    inventorySection.append(newCheckboxLabel)

    // list.append(newCheckbox)
    // newCheckbox.append(newCheckboxLabel)

    // sample code for a checkbox input
    // <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
    /* <label for="vehicle1"> I have a bike</label><br></br> */
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