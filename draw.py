import smtplib
import sys
import json
import urllib2
import random

from pymongo import MongoClient
from bson.json_util import loads, dumps
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

arg = sys.argv[1]

# Log error in file
# file = open("text.txt","w")
# file.write(arg)
# file.close()

# pymongo
client = MongoClient('localhost',27017)
db = client[arg]
collection = db.userlist.find()
data = []
for i in collection:
    print(i)
    str = dumps(i, encoding='utf8')
    data.append(loads(str, encoding='utf8'))

# parameters
message = MIMEMultipart();
message['From'] = "***********@gmail.com"
message['Subject'] = "Christmas present"

# connection tls server
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login("**********@gmail.com", "*********")

# random paramter
length = len(data)
# necessary for res.data !!!
print length

if length <= 1:
    sys.exit(0)
elif length == 2:
    k = 1
else:
    k = random.randint(1,length-1)

# send emails => loop through Participants
for i in range(length):
    j = (i+k) % length
    msg = "You offer to: " + data[j]['username'] + " ."
    message = MIMEText(msg, 'plain')
    message['To'] = data[i]['email']
    server.sendmail(message['From'], message['To'] , message.as_string())

# close server
server.quit()
sys.exit(0)
