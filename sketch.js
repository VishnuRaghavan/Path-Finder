// creating grids 
const cols = 100;
const rows = 100;
const grid = new Array();
const openSet = [];
const closedSet = [];
let start;
let end;
let w,h;

function removeFromArray(arr, elt){
	for(let i = arr.length - 1; i >= 0; i--){
		if(arr[i] == elt){
			arr.splice(i,1);
		}
	}
}

function heuristic(a, b){
	let d = abs(a.i - b.i) + abs(a.j - b.j);
	return d;
}

function spot(i,j) {
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbours = [];
	this.previous = undefined;
	this.wall = false;

	if(random(1) < 0.5){
		this.wall = true;
	}

	this.show = function(col) {
		fill(col);
		if(this.wall){
			fill(0);
		}
		noStroke();
		rect(this.i * w, this.j * h, w - 1, h - 1);
	}
	this.addNeighbours = function(grid){
		let i = this.i;
		let j = this.j;

		if(i < cols -1 ) {
			this.neighbours.push(grid[i + 1][j]);
		}
		if(i > 0){
			this.neighbours.push(grid[i - 1][j]);
		}
		if(j < rows - 1) {
			this.neighbours.push(grid[i][j + 1]);
		}
		if(j > 0) {
			this.neighbours.push(grid[i][j - 1]);
		}
		if(i > 0 && j > 0){
			this.neighbours.push(grid[i - 1][j - 1]);
		}
		if(i < cols -1 && j > 0){
			this.neighbours.push(grid[i + 1][ j - 1]);
		}
		if(i > 0 &&  j < rows - 1){
			this.neighbours.push(grid[i - 1][j + 1]);
		}if(i < cols -1 && j < rows - 1){
			this.neighbours.push(grid[i + 1][j + 1]);
		}
	}

}


function setup(){
	createCanvas(800, 800);
// setting up width and. height
	w = width / cols;
	h = height / rows;	
// making 2D array
	for(let i = 0; i < cols; i++){
		grid[i] = new Array(rows);
	}
// creating spots 
	for(let i = 0; i < cols; i++){
		for(let j = 0; j < rows; j++){
			grid[i][j]	= new spot(i,j);
		}
	}

// adding neighbours of   spots 
	for(let i = 0; i < cols; i++){
		for(let j = 0; j < rows; j++){
			grid[i][j].addNeighbours(grid);
		}
	}

	start = grid[0][0];
	end = grid[cols - 1][rows - 1];
	start.wall = false;
	end.wall = false;

	openSet.push(start);

	console.log(grid);


}


function draw(){
	background(0);
	let path = [];
	if(openSet.length > 0){
		let winner = 0;
		for(let i = 0; i < openSet.length; i++){
			if(openSet[i].f < openSet[winner].f){
				winner = i;
			}
		}

		 let current = openSet[winner];

		if( current === end){
			noLoop();
			console.log('DONE');
		}

		removeFromArray(openSet, current);
		closedSet.push(current);

		let neighbours = current.neighbours; 
		let neighbour;
		for(let i = 0; i < neighbours.length; i++){
			  neighbour = neighbours[i];

			if(!closedSet.includes(neighbour) && !neighbour.wall){
			let tempG = current.g + 1;
			let newPath = false;
			if(openSet.includes(neighbour)){
				if(tempG < neighbour.g){
					neighbour.g = tempG;
					newPath = true;
				}
			}else {
				neighbour.g = tempG;
				newPath = true;
				openSet.push(neighbour);
			}

			if(newPath){
				neighbour.h = heuristic(neighbour, end);
				neighbour.f = neighbour.g + neighbour.h;
				neighbour.previous = current;
			}
 			}
		}

		// creating path 
		let temp = current;
			path.push(temp);
			while(temp.previous){
				path.push(temp.previous);
				temp = temp.previous;
			}

	}else{
		console.log("no solution reasons can be of walls surrounding");
		noLoop();
	}

	// drawing the grid on to canvas 
	for(let i = 0; i < cols; i++){
		for(let j = 0; j < rows; j++){
			grid[i][j].show(color(255));
		}
	}

	// setting colors for openset and closedsets

	// for(let i = 0; i < openSet.length; i++){
	// 	openSet[i].show(color(0,255,0));
	// }

	// for(let i = 0; i < closedSet.length; i++){
	// 	closedSet[i].show(color(255,0,0));
	// }

	for(let i = 0; i < path.length; i++){
		path[i].show(color(0,0,255));
	}

}













