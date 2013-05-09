SearchGrid = (function() {
	
	/**
		@private 
	*/
	var adjacencyNodes = {

		/**
			adjacent4 returns the following nodes marked X around the node O:

			 - | X | - 
			 X | O | X
			 - | X | -

			@private 
		*/
		adjacent4: function(id, totalCells, rowCount) {
			var ids = [];

			if (id > rowCount) {
				ids.push(id - rowCount);
			}

			if (id % rowCount > 0) {
				ids.push(id - 1);
			}

			if (id % rowCount < rowCount - 1) {
				ids.push(id + 1);
			}

			if (id < totalCells - rowCount) {
				ids.push(id + rowCount);
			}

			return ids;
		},

		/**
			adjacent8 returns the following nodes marked X around the node O:

			 X | X | X 
			 X | O | X
			 X | X | X

			@private 
		*/
		adjacent8: function(id, totalCells, rowCount) {
			var ids = [];

			if (id > rowCount) {
				ids.push(id - rowCount);
				
				if((id-1) % rowCount > 0) {
					ids.push(id - rowCount - 1);
				}

				if((id+1) % rowCount < rowCount - 1) {
					ids.push(id - rowCount + 1);
				}
			}

			if (id % rowCount > 0) {
				ids.push(id - 1);
			}

			if (id % rowCount < rowCount - 1) {
				ids.push(id + 1);
			}

			if (id < totalCells - rowCount) {
				ids.push(id + rowCount);

				if((id-1) % rowCount > 0) {
					ids.push(id + rowCount - 1);
				}
				
				if((id+1) % rowCount < rowCount - 1) {
					ids.push(id + rowCount + 1);
				}
			}

			return ids;
		}
	};

	/* 
		The SearchGrid, whichs allows the user to draw obstructions for the search algorithms 
		to overcome, as well as setting a start point and an endpoint.

		The constructor initializes the canvas by clearing it, drawing the grid, instantiating
		the grid cells and hooking up the mouse event handlers.

		@global SearchGrid
		@constructor
		@param {CanvasContext} context - the Canvas Context
		@param {HTMLCanvasElement} element - the Canvas element 
		@param {object} options - An object options, boxSize
	*/
	function SearchGrid(context, element, options) {
		/**
			@private
			@member SearchGrid
			the canvas Context */
		var ctx = context

		/**
			@private
			@member SearchGrid
			the canvas width */
		,
			width = context.canvas.width

			/**
				@private
				@member SearchGrid
				the canvas height */
			,
			height = context.canvas.height
			/**
				@private
				@member SearchGrid
				the resulting number of cells per row. */
			,
			rowCount = context.canvas.width / options.boxSize

			/**
				@private
				@member SearchGrid
				The ids of the target- and starting cells the path finding algorithms should connect. */
			,
			targetCell = startCell = -1

			/**
				@public
				@member SearchGrid
				The cells of the grid.
			*/
			,
			cells = []

			/** 
				@private
				@member SearchGrid

				The search adapter. A search adapter implements an interface which conducts the path finding
				between the target cell and the starting cell.
			*/
			,
			searchAdapter = null

			/**
				The last event triggered.

				@private
				@member SearchGrid
			*/
			,
			lastEvent = null

			/**
				Indicates whether the mouse is down or not.

				@private 
				@member SearchGrid
			*/
			,
			mouseDown = false;


		var self = {
			cells: cells,
			/**			
				Gets a cell based on the cell's coordinates, as such: x * rowCount + y

				@public 
				@member SearchGrid
				@param {Integer} x - the X coordinate of the cell.
				@param {Integer} y - the Y coordinate of the cell.
				@returns A Cell with the ID == x * rowCount + y
			*/
			getCell: function(x, y) {
				return cells[x * rowCount + y];
			},
			/**
				Gets a cell based on it's ID
				
				@public
				@member SearchGrid
				@param {integer} id - The ID of the cell
			*/
			get: function(id) {
				return cells[id];
			},
			/**
				Gets the adjacent cells a cell based on the cell's ID. 

				@public 
				@member SearchGrid
				@param {integer} id - The ID of the cell
				@returns a set of adjacent nodes, according to the selected adjacency filter.
			*/
			getAdjacent: function(id) {

				// Get the adjacency filter. 
				var adjacencyFilter = typeof options.adjacencyFilter === "function" 
					? options.adjacencyFilter()
					: (typeof options.adjacencyFilter === "string" 
						? options.adjacencyFilter 
						: 'adjacent4');

				var ids = adjacencyNodes[adjacencyFilter](id, cells.length, rowCount);

				var _this = this;
				var filtered = ids.filter(function(i) {
					return _this.get(i).state !== CellState.WALL;
				});


				return filtered;
			},

			/**
				Sets the search adapter, which will be used to conduct a search.

				@public 
				@member SearchGrid
				@param {Object} adapter - the search adapter to use.
			*/
			setSearchAdapter: function(adapter) {
				searchAdapter = adapter;
			},
			/**
				Returns the start node set in the SearchGrid.

				@public 
				@member SearchGrid
				@returns the start cell.
			*/
			getStartNode: function() {
				return startCell;
			},

			/**
				Returns the target node set in the SearchGrid.

				@public 
				@member SearchGrid
				@returns the target cell.
			*/
			getTargetNode: function() {
				return targetCell;
			},

			/**
				Runs the search with the given search algorithm. Throws an exeption
				if the search adapter hasn't been set.

				@public
				@member SearchGrid
				@param {Function} callback - The callback function which will be called once the adapter has finished it's execution.
			*/
			runSearch: function(callback) {
				if (!searchAdapter) throw "Search adapter not set!";

				var _this = this;
				
				unregisterEvents();

				searchAdapter.run(ctx, function(result) {
					registerEvents();
					callback(result);
				});
			}

		};

		/**
			Registers the click events.

			@private
			@member SearchGrid
		*/
		var registerEvents = function() {
			element.addEventListener('mousedown', handleClickEvent, false);
			element.addEventListener('mousemove', handleMoveEvent, false);
			element.addEventListener('mouseup', handleMouseUpEvent, false);
		};

		/**
			Unregisters the click events.

			@private
			@member SearchGrid
		*/
		var unregisterEvents = function() {
			element.removeEventListener('mousedown', handleClickEvent);
			element.removeEventListener('mousemove', handleMoveEvent);
			element.removeEventListener('mouseup', handleMouseUpEvent);
		}

		/**
			Handles the mouse up event by setting the mousedown state within the grid
			to false.

			@private 
			@member SearchGrid
		*/
		var handleMouseUpEvent = function() {
			mouseDown = false;
		}

		/**
			Handles a mouse click event on the search grid. Enables the user to set 
			starting and target cells for the path finding algorithm. 

			@private 

			@param {Event} e - the current mouse clicked event 
			@param {Event} lastClickEvent - the last mouse clicked event 
		*/
		var handleClickEvent = function(e) {
			e.preventDefault();
			var coordsCurrentEvent = getCoordinates(e),
				coordsLastEvent = lastEvent ? getCoordinates(lastEvent) : null;

			if (coordsCurrentEvent[0] < 0 || coordsCurrentEvent[1] < 0 || coordsCurrentEvent[0] > cells.length || coordsCurrentEvent[1] > cells.length) {
				return;
			}

			if (coordsLastEvent && (coordsCurrentEvent[0] === coordsLastEvent[0] && coordsCurrentEvent[1] === coordsLastEvent[1])) {
				var cell = self.getCell(coordsCurrentEvent[0], coordsCurrentEvent[1]);
				var state = cell.onClick(ctx);

				handleStateChange(cell.id, state)
			}
			lastEvent = e;
			mouseDown = true;
		};


		/**
			Handles the state change of a cell which is moving to a START/TARGET state by
			setting the appropriate starting, target member variables, as well as clearing 
			the previous starting/target cells.

			@private 
			@member SearchGrid
			@param {Integer} cell - the cell id of the cell that was clicked
			@param {Integer} state - the CellState of the cell that was clicked.
		*/
		var handleStateChange = function(cell, state) {
			if (state === CellState.START) {
				if (startCell >= 0) {
					cells[startCell].setState(CellState.NORMAL);
					cells[startCell].draw(ctx);
				}

				startCell = cell;
			} else if (state === CellState.TARGET) {
				if (targetCell >= 0) {
					cells[targetCell].setState(CellState.NORMAL);
					cells[targetCell].draw(ctx);
				}

				targetCell = cell;
			}

			if (startCell === targetCell) {
				startCell = -1;
			}
		};

		/**
			Handles a move event from the mouse, used to enable the user to draw
			obstructions on the search grid.

			@private 
			@member SearchGrid
			@param {Event} e - The current mouse event to parse.
			@param {Event} lastClickEvent - the last click event that happened.
		*/
		var handleMoveEvent = function(e) {
			e.preventDefault();
			if (mouseDown) {
				var coordsCurrentEvent = getCoordinates(e),
					coordsLastEvent = lastEvent ? getCoordinates(lastEvent) : null;

				if (coordsCurrentEvent[0] < 0 || coordsCurrentEvent[1] < 0 || coordsCurrentEvent[0] > cells.length || coordsCurrentEvent[1] > cells.length) {
					return;
				}

				if (coordsLastEvent && (coordsCurrentEvent[0] !== coordsLastEvent[0] || coordsCurrentEvent[1] !== coordsLastEvent[1])) {
					var cell = self.getCell(coordsCurrentEvent[0], coordsCurrentEvent[1]);
					var state = cell.onMove(ctx);

					handleStateChange(cell.id, state)
				}

				lastEvent = e;
			}
		};

		/**
			Extracts a cell's coordinates based on a mouse event within the search grid.

			@private
			@member SearchGrid
			@param {Event} e - The mouse event
			@returns A tuple of coordinates.
		*/
		var getCoordinates = function(e) {
			var y = Math.floor(e.offsetX / (options.boxSize + options.epsilon)),
				x = Math.floor(e.offsetY / (options.boxSize + options.epsilon));

			return [x, y];
		}

		/// Constructor code.

		/* clear the canvas */
		ctx.beginPath();
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillRect(0, 0, width, height)
		ctx.fill();

		/* set up the grid */
		var grid = new Grid(width, height, Options.boxSize, {
			lineColor: Options.lineColor
		});
		
		grid.draw(ctx);

		/* generate the cells */

		for (var i = 0; i < rowCount * rowCount; ++i) {
			var y = Math.floor(i / rowCount),
				x = i % rowCount;

			cells[i] = new Cell(i, x, y, Options.boxSize, CellState.NORMAL);
		}

		/* register click events */
		registerEvents();


		return self;
	}


	return SearchGrid;
})();