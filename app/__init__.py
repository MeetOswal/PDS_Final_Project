from flask import Flask
from app.registerUser import RegisterUser
from app.login import login
from app.getItem import getItem
from app.getOrder import getOrder
from app.addDonations import addDonation
from app.orderHistory import getOrderHistory
from app.categoryFilter import CategoryFilter
from app.tasksPerformed import tasksPerformed
from app.getUser import user
from app.phone import phone
from app.createOrder import createOrder

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'meet_oswal'

    app.register_blueprint(RegisterUser)
    app.register_blueprint(login)
    app.register_blueprint(getItem)
    app.register_blueprint(getOrder)
    app.register_blueprint(addDonation)
    app.register_blueprint(getOrderHistory)
    app.register_blueprint(CategoryFilter)
    app.register_blueprint(tasksPerformed)
    app.register_blueprint(user)
    app.register_blueprint(phone)
    app.register_blueprint(createOrder)

    return app