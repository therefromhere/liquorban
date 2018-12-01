#!/usr/bin/env python3

# based on https://gist.github.com/rozifus/c529caf170699f117c53#file-local-ssl-server-py
# taken from http://www.piware.de/2011/01/creating-an-https-server-in-python/
# generate server.xml with the following command:
#    openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
# run as follows:
#    python simple-https-server.py
# then in your browser, visit:
#    https://localhost:4443

from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler
import os
import ssl

host = 'localhost'
port = 4433

httpd = HTTPServer((host, port), SimpleHTTPRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket, certfile='server.pem', server_side=True)

# cd to ./docs
os.chdir("docs")

print("now serving from https://{}:{}".format(host, port))

httpd.serve_forever()
