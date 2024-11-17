from flask import Blueprint, jsonify, session, request
from app.utils import get_db_connection
from pymysql import MySQLError as datababaseError
from datetime import datetime

createOrder = Blueprint('createorder', __name__)

@createOrder.route('/api/check/client/<username>', methods = ['GET'])
def ClientAuth(username):
    try:
        _ = session['username']
        connection = get_db_connection()
        if not connection:
            response = {
                "database error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
        with connection.cursor() as cursor:
            query = '''
            select *
            from act
            where userName = %s
            and roleID = 'Client'
            '''
            cursor.execute(query, (username))
            result = cursor.fetchone()
        connection.close()
        if result:
            return jsonify({'message' : 'OK'}), 200
        else:
            return jsonify({'error': 'Client not found'}), 401
        
    except datababaseError as e:
        return jsonify({'error': str(e)}), 500
    
    except KeyError as e:
        return jsonify({'error': 'User not found'}), 500
    
    except Exception as e:
        return jsonify({'error' : str(e)}), 500


@createOrder.route('/api/createorder', methods = ['POST'])
def createOrder_function():
    try:
        supervisor = session['username']
        username = request.form.get('username')
        orderNotes = request.form.get('orderNotes')
        orderDate = datetime.strptime(request.form.get('orderDate'), '%Y-%m-%d').date()
        itemID = request.form.get('itemID').split(',')
        deliveredBy = request.form.get('deliveredBy')
        deliveredDate = datetime.strptime(request.form.get('deliveredDate'), '%Y-%m-%d').date()
        deliveredStatus = request.form.get('deliveredStatus')

        connection = get_db_connection()
        if not connection:
            response = {
                "database error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
        
        with connection.cursor() as cursor:

            query_check = '''
                select *
                from act
                where username = %s
                and (roleID = 'Volunteer' or roleID = 'Staff')
            '''
            cursor.execute(query_check, (deliveredBy))
            result = cursor.fetchall()
            if not result:
                return jsonify({'error': 'Delivery Partner not found'}), 200

            query_check = '''
            select * 
            from item
            where ItemID = %s
            and ItemID not in (select ItemID 
            from itemin)
            '''
            for item in itemID:
                cursor.execute(query_check, int(item))
                result = cursor.fetchone()

                if not result:
                    return jsonify({'message' : f'Item {item} Not Found or already bought'},200)
            
            query = '''
            insert into ordered (orderDate, orderNotes, supervisor, client) values
            (%s, %s, %s, %s)
            '''
            cursor.execute(query, (orderDate, orderNotes, supervisor, username))
            connection.commit()
            
            last_order_id = cursor.lastrowid

            query = '''
            insert into itemin (ItemID, orderID, found) values
            (%s, %s, %s)
            '''
            for item in itemID:
                cursor.execute(query, (int(item), last_order_id, True))
                connection.commit()

            query = '''
            insert into delivered (userName, orderID, status, date) values
            (%s, %s, %s, %s)
            '''
            cursor.execute(query, (deliveredBy, last_order_id, deliveredStatus, deliveredDate))
            connection.commit()

        connection.close()
        return jsonify({'message' : 'order created'}) ,200  

    except datababaseError as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    
    except KeyError as e:
        print(e)
        return jsonify({'error': 'User not found'}), 500
    
    except Exception as e:
        print(e)
        return jsonify({'error' : str(e)}), 500