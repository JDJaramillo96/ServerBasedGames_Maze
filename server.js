//Modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var mazeFactory = require('@mitchallen/maze-generator-square');

//Properties
var jsonSpecs;
var xSize; var ySize;
//Port numbers
var portNumber = 8080;
var portNumberHeroku = process.env.PORT || 3000;

//JSON readFile
fs.readFile('maze-specs.json', function (err, data){
  if (err)
  {
    console.log(err);
  }

  jsonSpecs = JSON.parse(data);
  xSize = jsonSpecs.xSize;
  ySize = jsonSpecs.ySize;


  serverStart();
});

//Program
function serverStart(){

  http.createServer(function (request, response){ //Returns an instance of the Server

    var query = url.parse(request.url, true).query; //Query stuff

    if (query.width && query.height)
    {
      xSize = query.width;
      ySize = query.height;
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write("Input the dimensions of the maze on the URL in this way: /?width=heightValue&height=heightValue, and load the page");
    response.write("\n");

    var maze = mazeFactory.create({ x: xSize, y: ySize }); //Maze stuff
    let spec = { open:
      [ { border: "N", list: [0,2,xSize-1] } ]
    };

    maze.generate(spec); //Generate maze
    var rows = [];
    var bord = "";
    maze.printBoard(function (data1,data2){ //Print maze
      rows = data1;
      bord = data2;
    });

    response.write(bord + "\n");

    for (var i = 0; i < rows.length; i++)
    {
      response.write(rows[i] + "\n");
    }

    response.end();

  }).listen(portNumberHeroku);
}
