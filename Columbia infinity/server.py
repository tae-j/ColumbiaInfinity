from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)


current_id = 4
sales = [ 
    {"id": 1,
    "salesperson": "James D. Halpert",
    "client": "Shake Shack",
    "reams": 1000
    },

    {
    "id": 2,
    "salesperson": "Stanley Hudson",
    "client": "Toast",
    "reams": 4000
    },

    {"id": 3,
    "salesperson": "Michael G. Scott",
    "client": "Computer Science Department",
    "reams": 1000
    }
]

clients = [
    "Shake Shack",
    "Toast",
    "Computer Science Department",
    "Teacher's College",
    "Starbucks",
    "Subsconsious",
    "Flat Top",
    "Joe's Coffee",
    "Max Caffe",
    "Nussbaum & Wu",
    "Taco Bell",
]


# ROUTES

@app.route('/')
def hello():
   return render_template("welcome.html")


@app.route('/infinity')
def log_sales():
    return render_template('log_sales.html', sales=sales, clients=clients)


# AJAX FUNCTIONS
@app.route('/save_sale', methods=['POST'])
def save_sale(): 
    global current_id 
    global sales 
    global clients

    try: 
        data = request.get_json()

        #if data is None: print("no data recieved")

        if not data or 'salesperson' not in data or 'client' not in data or 'reams' not in data: 
            return jsonify({"error": "Missing required fields"}), 400
        
        
        new_sale = {
            "id": current_id + 1,
            "salesperson": data['salesperson'],
            "client": data['client'],
            "reams": data['reams'],
        }

        sales.insert(0, new_sale)
        current_id += 1
        
        if data['client'] not in clients:
            clients.append(data['client'])

        return jsonify(new_sale)  

    except Exception as e: 
        return jsonify({"error": str(e)}), 400 


@app.route('/delete_sale/<int:id>', methods=['DELETE'])
def delete_sale(id): 
    global sales 

    try:
        sales = [sale for sale in sales if sale['id'] != id]
        return jsonify(sales)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
   app.run(debug = True, port=5001)