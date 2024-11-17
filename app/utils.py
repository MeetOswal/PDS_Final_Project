import pymysql

host = 'localhost'
user = 'root'
password = '2912'
db_name = 'projectdb'

def get_db_connection():
    try:
        connection = pymysql.connect(
            host = host,
            user = user,
            password = password,
            database = db_name,
            cursorclass = pymysql.cursors.DictCursor
        )
        return connection
    except:
        return False