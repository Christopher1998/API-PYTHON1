from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app import db

main = Blueprint('main', __name__)



#===================================================================================
#ENDPOINTS


#METODO GET(SOLICITAR INFORMACION DE USUARIOS(SOLO PARA ADMINISTRADORES))
@main.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()

    users = User.query.all()
    return jsonify([u.to_dict() for u in users])



#METODO POST(CREAR USUARIO)
@main.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    if not data or "name" not in data or "password" not in data:
        return jsonify({"error": "Nombre y contraseña requeridos"}), 400

    user = User(name=data["name"])
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201


#METODO GET(POR NOMBRE ID DE USUARIO, LO UTILIZACMOS PARA MOSTRAR DATOS EN EL DASHBOARD LUEGO DE LOGEARSE)
@main.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "No encontrado"}), 404

    return jsonify(user.to_dict())



#METODO PUT(LO UTILIZAMOS PARA ACTUALIZAR NOMBRE DE USUARIO)
@main.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "No encontrado"}), 404

    data = request.get_json()

    if not data or "name" not in data:
        return jsonify({"error": "Nombre requerido"}), 400

    user.name = data["name"]
    db.session.commit()

    return jsonify(user.to_dict())


#METODO DELETE LO UTILIZAMOS PARA BORRAR UN USUARIO, EL ADMINISTRADOR TIENE ACCESO DE BORRAR CUALQUIER USUARIO
@main.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "No encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Eliminado"})


#METODO POST LOGIN(VERIFICA  LAS CONTRASENIAS Y CREA TOKEN POR USUARIO)
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or "name" not in data or "password" not in data:
        return jsonify({"error": "Datos incompletos"}), 400

    user = User.query.filter_by(name=data["name"]).first()

    if not user:
        return jsonify({
        "error": "Credenciales incorrectas"
    }), 401

    if not user.is_active:
        return jsonify({
        "error": "Cuenta temporalmente desactivada"
    }), 403

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Credenciales incorrectas"
    }), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login exitoso",
        "token": token,
        "id": user.id,
        "role": user.role

    })

#METODO PARA ACTUALIZAR CONTRASENIA
@main.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()

    if not data or "current_password" not in data or "new_password" not in data:
        return jsonify({"error": "Datos incompletos"}), 400

    # 🔐 verificar contraseña actual
    if not user.check_password(data["current_password"]):
        return jsonify({"error": "Contraseña actual incorrecta"}), 401

    # 🔒 guardar nueva contraseña
    user.set_password(data["new_password"])
    db.session.commit()

    return jsonify({"message": "Contraseña actualizada"})



# DESACTIVAR USUARIO POR ID (ADMIN)
@main.route('/users/deactivate/<int:id>', methods=['PUT'])
@jwt_required()

def deactivate_user(id):

    # Buscar usuario por ID
    user = User.query.get(id)

    # Verificar si existe
    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    # Desactivar cuenta
    user.is_active = False

    # Guardar cambios
    db.session.commit()

    return jsonify({
        "message": "Cuenta desactivada correctamente",
        "user": user.to_dict()
    }), 200


# ACTIVAR USUARIO POR ID(ADMIN)
@main.route('/users/activate/<int:id>', methods=['PUT'])
@jwt_required()

def activate_user(id):
    #Buscar usuario por id
    user = User.query.get(id)

    #verificar si existe
    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404
    
    #activar la cuenta
    user.is_active = True

    #Guardar cambios en la bd
    db.session.commit()

    return jsonify({
        "message": "Cuenta activada correctamente",
        "user": user.to_dict()
    }), 200