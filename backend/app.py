from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.contact import (
    create_contact,
    list_contacts,
    get_contact,
    update_contact,
    search_contacts
)

app = Flask(__name__)
CORS(app)



# Creating a new contact
@app.post("/contacts")
def create():
    new_id, error = create_contact(request.json)
    if error:
        return {"error": error}, 400
    return {"message": "created", "id": new_id}, 201



#getting all the contacts
@app.get("/contacts")
def list_all():
    return jsonify(list_contacts())



#getting one contact
@app.get("/contacts/<id>")
def one_contact(id):
    row = get_contact(id)
    if not row:
        return {"error": "not found"}, 404
    return jsonify(row)



#updating a contact
@app.put("/contacts/<id>")
def update(id):
    data, ok, error = update_contact(id, request.json)
    print(ok)
    if error:
        return {"error": error}, 400
    if not ok:
        return {"error": "not found"}, 404
    return {"message": "Updated Successfully", "data": data}, 200

#searching a contact
@app.get("/contacts/search/<name>")
def search(name):
    print(name)
    return jsonify(search_contacts(name))

if __name__ == "__main__":
    app.run(debug=True)