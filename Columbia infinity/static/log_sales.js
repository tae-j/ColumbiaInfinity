function display_sales_list(sales){
    $("#sales-list").empty(); 
    console.log(sales); 
      sales.forEach((sale,index) => {
        let salesrecord = $(`<div class="sales-record" data-index="${sale.id}">
            <div>${sale.salesperson}</div>
            <div>${sale.client}</div>
            <div>${sale.reams}</div>
            <div>
            <button class="delete-btn">Delete</button>
            </div>
        </div>`);

        $("#sales-list").append(salesrecord);

        }); 

        $(".sales-record").draggable({
            revert: "invalid",
        });

}; 

function save_sale(new_sale){
    let client, reams;
    let valid = true; 

    if (new_sale) {
        client = new_sale.client;
        reams = new_sale.reams;
    } else {
        client = $("#client-name").val().trim();
        reams = $("#ream-count").val().trim();
    }


    $("#both").text("").removeClass("error"); 
    $("#client-error").text("").removeClass("error"); 
    $("#ream-error").text("").removeClass("error"); 
    
    
    if (!client && !reams) {
        $("#both").text("Input something in both fields.").addClass("error");
        $("#client-name").focus();
        valid = false;
    } else if (!client) {
        $("#client-error").text("Client name is missing").addClass("error");
        $("#client-name").focus();
        valid = false;
    } else if (!reams) {
        $("#ream-error").text("Number of reams is missing").addClass("error");
        $("#ream-count").focus();
        valid = false;
    } else if (isNaN(reams)) {
        $("#ream-error").text("Invalid type for reams").addClass("error"); 
        $("#ream-count").focus();
        valid = false;
    }

    if (!valid) return;

    let salesperson = "Themis C."; 

    if (!new_sale) {
        let salesperson = "Themis C.";
        new_sale = {
            salesperson: salesperson,
            client: client,
            reams: reams
        };
    }

    
    
    $.ajax({
        type: "POST", 
        url:"save_sale", 
        dataType: "json", 
        contentType: "application/json; charset=utf-8", 
        data: JSON.stringify(new_sale), 
        success: function(data) {

            if (data.error) {
                console.error("Error saving sale:", data.error);
                return;
            }

            sales.unshift(data);
            display_sales_list(sales);

            if (!clients.includes(client)) {
                clients.push(client);
                if ($("#client-name").data("ui-autocomplete")) {
                    $("#client-name").autocomplete("option", "source", clients);
                } else {
                    console.log("Autocomplete not initialized.");
                }
            }

            console.log("Sale saved successfully:", data);
            $("#client-name").val("").focus(); 
            $("#ream-count").val("");


        },

        error:function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }

    })
}

function delete_sale(id){
    $.ajax({
        type: "DELETE", 
        url:"/delete_sale/" + id, 
        success: function(data) {
            sales = data; 
            display_sales_list(sales); 
        }, 
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}
 
 $(document).ready(function() {

    $("#client-name").autocomplete({source:clients}); 

    $("#submit-sale").click(function() {
        save_sale();
    });

    $('#ream-count').on('keydown', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault(); 
            save_sale(); 
        }
    });

    $(document).on("click", ".delete-btn", function () {
        let id = $(this).closest(".sales-record").data("index");
        delete_sale(id); 

    });

    $("#trash").droppable({
        accept: ".sales-record",
        drop: function (event, ui) {
            let id = ui.draggable.data("index");
            delete_sale(id);
        }
    });
        display_sales_list(sales); 

}); 