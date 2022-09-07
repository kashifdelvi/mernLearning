function callSomething(event){
    console.log(event)
}
function deleteFood(_deleteId){
    const xhttp = new XMLHttpRequest();
    const bodyData = `deleteId=${_deleteId}`;

    xhttp.onload = function() {
       console.log("FOOD DELETED");
       loadFood();
    }
    xhttp.open("DELETE", "http://localhost:9191/deleteFood"); // NOT YET DONE THE END POINT 
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(bodyData);
}

function updateForm(updatedItemId){
    const newName = document.getElementById('updatedName').value;
    const updatedCuisine = document.getElementById('updatedCuisine').value;
    const updatedCost = document.getElementById('updatedCost').value;
    
    
    const xhttp = new XMLHttpRequest();
    const bodyData = `_id=${updatedItemId}&name=${newName}&cuisine=${updatedCuisine}&cost=${updatedCost}`;

    xhttp.onload = function() {
       console.log("FOOD updated");
       loadFood();
    }
    xhttp.open("PUT", "http://localhost:9191/updateFood"); // NOT YET DONE THE END POINT 
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(bodyData);
}

function addFood(){
    const name= document.getElementById('name').value;
    const foodObject = {
        'name':name.trim(),
        'cuisine':document.getElementById('cuisine').value.trim(),
        'cost':document.getElementById('cost').value.trim(),
        'imageURL': `http://127.0.0.1:5500/images/${name}.png`,
    }
    console.log(foodObject)
    const xhttp = new XMLHttpRequest();
    const bodyData = `name=${foodObject.name}&cuisine=${foodObject.cuisine}&cost=${foodObject.cost}&imageURL=${foodObject.imageURL}`;

    xhttp.onload = function() {
       console.log("FOOD item added");
       loadFood();
    }

    xhttp.open("POST", "http://localhost:9191/addFood");
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xhttp.send(bodyData);
}

function loadFood(){
    const baseURL = 'http://127.0.0.1:5501/pure-java-script/images/'
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(req,res) {
       const fromServer = JSON.parse(this.response);
       let foodItems = ''
       const itemsPerPage = 5;
       const pageButtons = fromServer.total / itemsPerPage;
       let pageButtonsHTML = '';
       console.log(pageButtons);
       for(let i =0;i<pageButtons;i++){
        pageButtonsHTML += ` <button type="button" class="btn btn-danger btn-outline-light" >
            ${i}
        </button>`
       }
       fromServer.data.forEach(element => {             
        foodItems+= `<div class="row rightColRow">
                <div class="row rowOne">
                    <div class="col-3 columnOne">
                        <img src='${baseURL}/${element.name}.png' alt="Food Image">
                    </div>
                    <div class="col-9 columnTwo">
                        <h3>${element.name || 'NO NAME'}</h3>
                        <h6>FORT</h6>
                        <p>Shop 1, Plot D, Samaruddhi Complex, Chincholi</p>
                    </div>
                </div>
                <hr>
                <div class="row rowTwo">
                    <div class="col-3 columnOne">
                        <p>CUISINE:</p>
                        <p class="costForTwo">COST FOR TWO:</p>
                    </div>
                    <div class="col-9 columnTwo">
                        <p>${element.cuisine}</p>
                        <p>₹${element.cost}</p>
                        <button onclick="deleteFood('${element._id.toString()}')">Delete</button>
                        <button 
                            onclick="openUpdateForm({_id:'${element._id}',name:'${element.name}',cuisine:'${element.cuisine}',cost: ${parseInt(element.cost)}})">
                            Update
                        </button>
                    </div>
                </div>
               
            </div>`
        });               
       document.querySelector('#itemContainer').innerHTML = `${foodItems}
                                                                <div class="row">
                                                                    ${pageButtonsHTML}
                                                                </div>`;
    }
    xhttp.open("GET", "http://localhost:9191/getFood");
    xhttp.send(); 
}

function openUpdateForm(element){
    console.log(element)
    //const element = {_id,name,cuisine,cost}
    console.log(element)
    const updateFormHTML = ` <div id='updateForm'>
        <h3>Update Data</h3>
        <div>
                        <label for="name">
                            Name
                        </label>
                        <input id="updatedName" type="text" name="name" value="${element.name || 'NO NAME'}"/>
</div>
                        <label for="cuisine">
                            Cuisine
                        </label>


                        <div>
                        <input id="updatedCuisine" type="text" name="cuisine" value="${element.cuisine}"/>

                        </div>

                        <div>
                            <label for="name">
                                Cost
                            </label>
                            <input 
                            id="updatedCost"
                                type="number" 
                                name="cost" 
                                value="${element.cost}"/>
                        </div>

                        <div>
                        <label for="image">
                            Image
                        </label>
                        <input type="file" name="image" />
                        </div>
                        <button onclick="updateForm('${element._id}')">Confirm Update</button>
                    </div>
    
    `
    document.querySelector('#updateFormContainer').innerHTML = updateFormHTML
}

(function () {
    loadFood();
})();

/*(function () {
    const xhttp = new XMLHttpRequest();
    var params = 'name=abc&cuisine=binny&cost=300';
    xhttp.onload = function() {
       console.log("FOOD ADDED");
    }
    xhttp.open("POST", "http://localhost:9191/addFood");
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);    
})();*/

/*const handleDelete = ()=>{
    const xhttp = new XMLHttpRequest();
    var params = 'id=62f8e2a1489d790f5f957573';
    xhttp.onload = function() {
       console.log("FOOD ADDED");
    }
    xhttp.open("DELETE", "http://localhost:9191/deleteFood");
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);  
}*/

