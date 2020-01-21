// Autocomplete text field returning results from Nutritionix Instant Endpoint API
// https://www.w3schools.com/howto/howto_js_autocomplete.asp
function foodList(){

    // Select the text input field in the autocomplete div and add input function
    var foodInput = $("div.autocomplete :text");
    foodInput.on("input", function(){

        // Call to backend to return and list of foods matching user input
        $.get("/food_array", {item : foodInput.val()}, function(data){

            //  Remove any previous lists
            $("div.autocomplete-items").remove();

            // Create div container within input for autocomplete list
            divName = foodInput.attr('name');
            divClass = "autocomplete-items";
            divId = divName + "-autocomplete-list";
            div = $("<div></div>").addClass(divClass).attr('id', divId);
            foodInput.after(div);

            // Iterate through list of foods and populate autocomplete list
            data.forEach(function(item){
                itemDiv = $("<div></div>").text(item);
                div.append(itemDiv);

                // Replace the input field value when item clicked
                itemDiv.on("click", function itemClicked(){
                    itemSelected = $(this).text();
                    foodInput.prop('value', itemSelected);
                    div.empty();
                });
            });
        });
    });
}

// Call Nutritionix: Natural Language for Nutrients API
function getNutrients(displayFunction){

    // Select the button in the autocomplete div and asign a click function
    var formButton = $("div.autocomplete :button");
    formButton.click(function(event){
        event.preventDefault();

        // Ensure user provided a food name value
        formInput = $("div.autocomplete :text");
        if (formInput.val() == "") {return;}

        // User provided a food name value
        else {

            // Call to backend to request nutrition information
            $.get("/nutrient_array", {foodName : formInput.val()}, function(data){

                // If no nutrition information is available, do nothing
                if (data.length == 0) {return;}

                // Call function to display nutrients
                else {
                    displayFunction(data);
                }
            });

            // Reset the form input
            formInput.val("");
        }
    });
}

// Display nutrition information container for food lookup page
function showNutrients(foodData){

    // Store in browser session
    sessionStorage.setItem('foodLookupData', JSON.stringify(foodData));

    // Select the div container for the nutrients and ensure it is clear of previous lists
    container = $("div.nutrient-list");
    container.empty();

    // Create a container for Bootstrap grid layout
    title = $("<div></div>").addClass("center-green");
    container.append(title);

    // Create row 1 to include food picture and name, and add to container
    row1 = $("<div></div>").addClass("row");
    title.append(row1);
    col1a = $("<div></div>").addClass("col-sm-6")
        .append($("<img src= "+ foodData[0]['value'] + " alt='Food Item Picture'>"));
    col1b = $("<div></div>").addClass("col-sm-6 big").text(foodData[1]['value']);
    row1.append(col1a, col1b);

    // Create row 2 and include serving size and add to container
    row2 = $("<div></div>").addClass("row medium");
    title.append(row2);
    col2a = $("<div></div>").addClass("col-sm-6").text("Serving Size:");
    col2b = $("<div></div>").addClass("col-sm-6")
        .text(`${foodData[2]['value']} ${foodData[3]['value']} (${foodData[4]['value']}g)`);
    row2.append(col2a, col2b);

    // Create a new container for a Bootstrap table to display
    table = $("<table>").addClass("table table-striped").append($("<tbody></tbody>"));
    container.append(table);

    // Add macro-nutrients to the table
    for (let i = 5, l = foodData.length; i < l; i++){
        row = $("<tr></tr>");
        table.append(row);
        col1 = $("<td></td>").text(foodData[i]['label']);
        col2 = $("<td></td>").text(foodData[i]['value'].toFixed(1) + foodData[i]['unit']);
        row.append(col1, col2);
    }
}

// Display basic nutrition information for food in meal planner page
function showShortNutrients(foodInput){

    // Select the div container for the food item
    container = $("div.food-item");

    // Create a container with one row for food item using Bootstrap grid layout
    foodDiv = $("<div></div>").addClass("border-food");
    container.append(foodDiv);
    row = $("<div></div>").addClass("row text-center");
    foodDiv.append(row);

    // Add 6 columns to the row
    col1 = $("<div></div>").addClass("col-sm-2");
    col2 = $("<div></div>").addClass("col-sm-2");
    col3 = $("<div></div>").addClass("col-sm-2");
    col4 = $("<div></div>").addClass("col-sm-2");
    col5 = $("<div></div>").addClass("col-sm-2");
    col6 = $("<div></div>").addClass("col-sm-2");
    row.append(col1, col2, col3, col4, col5, col6);

    // Parse the full nutrition data object for only requierd fields
    selectName = $("<div></div>").addClass("col-sm-12 small").text(foodInput[1]['value']);
    protein = $("<div></div>").addClass("col-sm-12 small")
        .text(foodInput[19]['value'].toFixed(1) + foodInput[19]['unit']);
    carb = $("<div></div>").addClass("col-sm-12 small")
        .text(foodInput[15]['value'].toFixed(1) + foodInput[15]['unit']);
    fat = $("<div></div>").addClass("col-sm-12 small")
        .text(foodInput[7]['value'].toFixed(1) + foodInput[7]['unit']);
    cal = $("<div></div>").addClass("col-sm-12 small")
        .text(foodInput[5]['value'].toFixed(1) + foodInput[5]['unit']);
    btn = $("<div></div>").addClass("col-sm-12 small")
        .html($("<button></button>").attr('type', 'button').addClass("close").text("x"));

    // Add text labels for nutrients
    b = $("<div></div>").addClass("col-sm-12 xsmall").text("Protein");
    c = $("<div></div>").addClass("col-sm-12 xsmall").text("Carbs");
    d = $("<div></div>").addClass("col-sm-12 xsmall").text("Fat");
    e = $("<div></div>").addClass("col-sm-12 xsmall").text("Cal");

    // Add nutrition data and labels to the grid columns
    col1.append(selectName);
    col2.append(protein, b);
    col3.append(carb, c);
    col4.append(fat, d);
    col5.append(cal, e);
    col6.append(btn);
}

// Submit form values from target page and return target nutrients
function getTarget(){

    // Select the calculate button and assign a click button
    var formButton = $("form :button.calculate");
    formButton.click(function(event){
        event.preventDefault();

        // Select "weight" input field and "goal" drop down menu
        var weight = formButton.siblings("div").children("input");
        var goal = formButton.siblings("div").children("select");

        // Call to backend to calculate calorie and nutrient targets
        $.get("/target_array", {weight : weight.val(), goal : goal.val()}, function(data){

            // If user submited invalid values, do nothing
            if (data == 0) {return;}

            else {
                // Call function to display targets and store in browser session
                showTarget(data);
                sessionStorage.setItem('targetData', JSON.stringify(data));
            }
        });
    });
}

// Display target nutrients for the target nutrient page
function showTarget(targetInput){

    // Set values for calories and macro nutrients
    $("#calorie").text(targetInput.Calories);
    $("#pGram").text(targetInput.pGram + "g");
    $("#cGram").text(targetInput.cGram + "g");
    $("#fGram").text(targetInput.fGram + "g");
    $("#pCal").text(targetInput.pCal + " Cal");
    $("#cCal").text(targetInput.cCal + " Cal");
    $("#fCal").text(targetInput.fCal + " Cal");

    // Set values for micro nutrients
    micro = targetInput.micro;
    microDiv = $("#micro");
    microDiv.empty();
    table = $("<table>").addClass("table table-striped").append($("<tbody></tbody>"));
    microDiv.append(table);
    for(const item of micro) {
        row = $("<tr></tr>");
        table.append(row);
        col1 = $("<td></td>").text(item.label);
        col2 = $("<td></td>").text(item.value + item.unit);
        row.append(col1, col2);
    }

    // Show the target nutrient div
    $("div.targets").show();

}

// Meal builder modal
// https://www.w3schools.com/bootstrap/bootstrap_ref_js_modal.asp
function modal(){
    $("#launchModal").click(function(){
        $("#mealModal").modal();
    });
}

// Compile foods from the Meal Builder modal and store as a browser session varible
function addMeal(){

    // Select the add meal button and add a click function
    btn = $("#addMeal");
    btn.click(function(){

        // Select all food items and place in a meal div
        food = $("#food-item").children();
        mealDiv = $("<div></div").addClass("meal border-meal");
        mealDiv.append(food);

        // Check if previous meals have been stored in the browser session
        if (sessionStorage.getItem('mealPlannerData')) {

            // Store the previous meals
            let data = sessionStorage.getItem('mealPlannerData');

            // Create a container for the previous meals and add the new meal
            let newData = $("<div></div>").append(data);
            newData.append(mealDiv);

            // Store the updated data in the browser session and call the display function
            sessionStorage.setItem('mealPlannerData', newData.html());
            showMeal(newData.html());
        }

        // First meal is stored in the browser session and the display function is called
        else {
            containerDiv = $("<div></div>");
            submitDiv = containerDiv.append(mealDiv);
            sessionStorage.setItem('mealPlannerData', submitDiv.html());
            showMeal(submitDiv.html());
        }
    });
}

// Clear any previous data and display the updated meals
function showMeal(foodDiv){
    $("#meal").empty();
    $("#meal").append(foodDiv);
}