renderInventory();

// generates the html elements of either default inventory items or the user's
function renderInventory() {
// JSON because it's easier to save in localStorage and to add stuff into
    let default_inventory = {
        // belt: {
        //     name: "lifting belt",
        //     is_default: true,
        //     color: "#DDDDDD",
        //     image_source: ""
        // },
        water_bottle: {
            name: "Water Bottle",
            is_default: true,
            color: "#DDDDDD",
            image_source: "default_inventory_images/water-bottle.png"
        },
        shoes: {
            name: "Powerlifting Shoes",
            is_default: true,
            color: "#DDDDDD",
            image_source: "default_inventory_images/shoes.png"
        },
        // straps: {
        //     name: "wrist straps",
        //     is_default: true,
        //     color: "#DDDDDD",
        //     image_source: ""
        // },
        // headphones: {
        //     name: "headphones",
        //     is_default: true,
        //     color: "#DDDDDD",
        //     image_source: ""
        // },
        // snack: {
        //     name: "snack",
        //     is_default: true,
        //     color: "#DDDDDD",
        //     image_source: ""
        // }
    };
    if(localStorage.getItem("my_inventory") == null) {
        localStorage.setItem("my_inventory", JSON.stringify(default_inventory))
        // localStorage.setItem("my_inventory", default_inventory)
    }

    // parsed version
    let my_inventory = JSON.parse(localStorage.getItem("my_inventory"))
    
    // number of elements in the JSON
    let length = Object.keys(my_inventory).length;
    let keys = Object.keys(my_inventory);
    for(let i = 0; i < length; i++) {
        let itemJSON = my_inventory[keys[i]]
        createCard(itemJSON)
    }
}

// actual html element-making
function createCard(itemJSON) {
    let card = document.createElement("div")
    // card.id = itemJSON;
    // if(document.querySelector(card.id) != null) {
    //     return
    // }
    
    let image = document.createElement("img")
    image.src = itemJSON.image_source;
    // image.setAttribute("style.color", "red")
    // card.style.backgroundColor = itemJSON.color;
    // image.setAttribute("src", itemJSON.image_source)
    card.appendChild(image)
    card.appendChild(document.createTextNode(itemJSON.name))
    // card.textContent = itemJSON.name;

    card.className = "inventory-card";

    let inventory_div = document.querySelector("#inventory-div");
    inventory_div.appendChild(card)
}


// adds an item to the inventory and the JSON
// also creates a new card for it
function addItem() {
    let newItem = window.prompt("What is the name of your item?")

    let my_inventory = JSON.parse(localStorage.getItem("my_inventory"));
    let newItemDetails = {
        name: newItem,
        is_default: false,
        color: "#DDDDDD",
        image_source: "default_inventory_images/dumbell.png"
    };

    
    my_inventory.newItem = newItemDetails;
    localStorage.setItem("my_inventory", JSON.stringify(my_inventory));
    createCard(my_inventory.newItem);


    //     shoes: {
    //     name: "Powerlifting Shoes",
    //     is_default: true,
    //     color: "#DDDDDD",
    //     image_source: "default_inventory_images/shoes.png"
    // },
}