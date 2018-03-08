const express = require('express');
const fs = require('fs');
const app = express();
var jsonObj = [];

app.use((req, res, next) => {
    // write your logging code here
    var agent = req.headers["user-agent"].replace(/,/, '');
    var d = new Date();
    var time = d.toISOString();
    var method = req.method;
    var resource = req.url;
    var version = 'HTTP/' + req.httpVersion;
    var status = res.statusCode;

    var newObj = {};
    newObj.Agent = agent;
    newObj.Time = time;
    newObj.Method = method;
    newObj.Resource = resource;
    newObj.Version = version;
    newObj.Status = status;

    // var newObj = {
    //     Agent: agent,
    //     Time: time,
    //     Method: method,
    //     Resource: resource,
    //     Version: version,
    //     Status: status
    // }

    jsonObj.push(newObj);

    fs.appendFile('server/log.csv', '\n' + agent + ',' + time + ',' + method + ',' + resource + ',' + version + ',' + status, function () {
    });

    console.log(agent + ',' + time + ',' + method + ',' + resource + ',' + version + ',' + status)
    next();
});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.send('ok');
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile('server/log.csv', 'utf8', function (err, data) {
        var allLogs = [];

        //how to format data into json obj
        var rows = data.split('\n');

        rows.forEach(function (row) {
            var array = row.split(',');

            var obj = {
                Agent: array[0],
                Time: array[1],
                Method: array[2],
                Resource: array[3],
                Version: array[4],
                Status: array[5]
            }
            allLogs.push(obj);

        })
        console.log(allLogs);
        res.send(allLogs)
    })
});
module.exports = app;

