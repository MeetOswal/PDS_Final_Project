from flask import Blueprint, jsonify, session
from app.utils import get_db_connection
from pymysql import MySQLError as datababaseError
from itertools import groupby
getOrder = Blueprint('getorder', __name__)

@getOrder.route('/api/order/<int:order_id>', methods = ['GET'])
def getOrder_function(order_id):
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
            select ItemID, iDescription, mainCategory, 
            pieceNum, pDescription, roomNum, shelfNum, orderDate, client
            from `ordered` natural join
            (itemin natural join item) natural join
            piece
            where orderID = %s
            '''
            cursor.execute(query, (order_id))
            result = cursor.fetchall()
        
        connection.close()
        if not result:
            response = {
                'error': 'order not found'
            }
            return jsonify(response), 404
        else:
            order_data = {
                'client' : result[0]['client'],
                'orderDate' : result[0]['orderDate'],
                'item' : []
            }
            for key, group in groupby(result, key = lambda x:(x['ItemID'], x['iDescription'])):
                item_data = {
                    'ItemID' : key[0],
                    'iDescription' : key[1],
                    'piece' : []
                }

                for piece in group:
                    item_data['piece'].append({
                        'pieceNum' : piece['pieceNum'],
                        'pDescription' : piece['pDescription'],
                        'roomNum' : piece['roomNum'],
                        'shelfNum' : piece['shelfNum']
                    })
                
                order_data['item'].append(item_data)
                
            return jsonify(order_data), 200
        
    except datababaseError as e:
        response = {
            'error' : str(e)
        }
        return jsonify(response), 500
        
    except KeyError as e:
        response = {
            'error' : 'User Not Found'
        }
        return jsonify(response), 500
    except Exception:
        response = {
            'error' : str(e)
        }
        return jsonify(response), 500
