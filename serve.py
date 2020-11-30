from flask import Flask

app = Flask(__name__)

@app.route('/')
@app.route('/index.html')
def index():
    return file("index.html")

@app.route('/<file>')
def file(file):
    with open(file) as f:
        return f.read()

app.run("0.0.0.0", 80)
