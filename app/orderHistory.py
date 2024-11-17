from flask import Blueprint, jsonify, session
from app.utils import get_db_connection
from pymysql import MySQLError as datababaseError
from itertools import groupby
getOrderHistory = Blueprint('orderHistory', __name__)

@getOrderHistory.route('/api/orderhistory', methods = ['GET'])
def getOrderHistory_function():
    try:
        username = session['username']
        connection = get_db_connection()
        if not connection:
            response = {
                "database error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
        
        with connection.cursor() as cursor:
            query = '''
            select orderID, orderDate, ItemID, iDescription
            from (`ordered` natural join itemIn)
            natural join item
            where client = %s
            order by orderDate
            '''
            cursor.execute(query, (username))
            result = cursor.fetchall()
        
        connection.close()
        if not result:
            return jsonify({'message' : 'no order history found'}), 200
        else:
            order_data = {
                'client' : username,
                'orders' : []
            }
            for key, group in groupby(result, key = lambda x: (x['orderID'], x['orderDate'])):
                order_details = {
                    'orderId' : key[0],
                    'orderDate' : key[1],
                    'items' : []
                }
                for item in group:
                    order_details['items'].append({
                        'ItemID' : item['ItemID'],
                        'iDescription' : item['iDescription']
                    })
                    
                order_data['orders'].append(order_details)
            
            return jsonify(order_data), 200
        
    except datababaseError as e:
        return jsonify({'error' : str(e)}), 500
    
    except KeyError as e:
        return jsonify({'error' : 'User not Found'}),404
    
    except Exception as e:
        return jsonify({'error' : str(e)}), 500

