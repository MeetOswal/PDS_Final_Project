from flask import Blueprint, jsonify, session
from app.utils import get_db_connection
from pymysql import MySQLError as datababaseError
from itertools import groupby
getOrderHistory = Blueprint('orderHistory', __name__)

'''
API to get Information for user Order History

Input:
None

Output:
1. Orders Infromation / No History Message- 200
    All Order Detials
    Item In Order Details

3. Database Connection -500
4. Server Error - 500
5. Database Error - 500
6. Session Error - 404
'''
@getOrderHistory.route('/api/orderhistory', methods = ['GET'])
def getOrderHistory_function():
    try:
        if 'username' not in session:
            response = {
                'error' : 'User not logined'
            }
            return jsonify(response), 404
        
        username = session['username']
        connection = get_db_connection()
        if not connection:
            response = {
                "error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
        
        """
        (select distinct orderID
        from `ordered` natural join itemin natural join delivered
        where client = 'meetoswal' or supervisor = 'meetoswal' or userName = 'meetoswal')

        select orderID, ItemID, iDescription
        from orderIDs natural join (itemin natural join item)
        """
        
        with connection.cursor() as cursor:
            query = '''
            with orderIDs as
            (select distinct orderID, orderDate
            from `ordered` natural join itemin natural join delivered
            where client = %s or supervisor = %s or userName = %s)

            select orderID, orderDate, ItemID, iDescription
            from (orderIDs natural join itemin) natural join item
            order by orderDate desc
            '''
            cursor.execute(query, (username, username, username))
            result = cursor.fetchall()
        
        connection.close()
        if not result:
            return jsonify({'message' : 'No Order History Found'}), 200
        else:
            # Formating the Rsponse
            '''
            Remove duplicates cilent names
            Group BY Order ID's
            Aggregate Items in Orders.
            '''
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
    
    except Exception as e:
        return jsonify({'error' : str(e)}), 500

