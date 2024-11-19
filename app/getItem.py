from flask import Blueprint, jsonify, session
from app.utils import get_db_connection
from pymysql import MySQLError as datababaseError
import base64

getItem = Blueprint('getitem', __name__)

@getItem.route('/api/getitem/<int:item_id>', methods = ['GET'])
def getItem_function(item_id):
    try:
        if 'username' not in session:
            response = {
                'error' : 'User not logined'
            }
            return jsonify(response), 404

        _ = session['username']

        connection = get_db_connection()
        if not connection:
            response = {
                "error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
        with connection.cursor() as cursor:
            query = '''
            select * 
            from item natural join piece
            where itemID = %s
            '''
            cursor.execute(query, (item_id))
            result = cursor.fetchall()
        connection.close()

        if not result:
            response = {
                'error' : 'Item not Found'
            }
            return jsonify(response), 404
        
        else:
            item_data = {
                'itemID' : result[0]['ItemID'],
                'iDescription' : result[0]['iDescription'],
                'photo' : base64.b64encode(result[0]['photo']).decode('utf-8'),
                'Category' : result[0]['mainCategory'],
                'pieces' : []
            }
            for i in result:
                item_data['pieces'].append({
                    'pieceNum' : i['pieceNum'],
                    'pDescription' : i['pDescription'],
                    'roomNum' : i['roomNum'],
                    'shelfNum' : i['shelfNum']

                })
            return jsonify(item_data), 200
        
    except datababaseError as e:
        print(e)
        response = {
            'error' : str(e)
        }
        return jsonify(response), 500
        
    except Exception as e:
            response = {
                'error' : str(e)
            }
            return jsonify(response), 500

