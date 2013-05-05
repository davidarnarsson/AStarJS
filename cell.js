Cell = (function() {

	/**
		@constructor 

		Represents a cell in the search grid.

		@param {Integer} id - the ID of the Cell
		@param {Integer} x - the X coordinate of the Cell
		@param {Integer} y - the Y coordinate of the Cell
		@param {Integer} sideLength - the length of one side of the Cell, which is assumed to be square.
		@param {CellState} state - The initial cell state.
	*/
	function Cell(id,x, y, sideLength, state) 
	{

		/**
			@private 
			@member Cell
			The length of a side of the cell. 
			The Cell is assumed to be a square.
		*/
		var sideLength = sideLength
		
		/**
			@private 
			@member Cell
			The Fill color of the cell. Used for drawing the cell.
		*/
		var	fillColor = 'rgb(255,255,255)';
		
		var self = {
		
			/**
				@public 
				@member Cell
				The ID of the cell.
			*/
			id: id,
		
			/**
				@public 
				@member Cell
				The X coordinate of the cell.
			*/
			x: x,
			/**
				@public 
				@member Cell
				The Y coordinate of the cell.
			*/
			y: y,
			/**
				@public 

				The CellState of the cell. 
			*/
			state: state,

			/**
				@public 
				@member Cell
				Sets the state of the Cell.

				It can be NORMAL, WALL, PLOTTING, PATH, START and TARGET. 

				@param {Integer} s - the state to set the Cell to.
			*/
			setState: function(s)
			{
				state = s;
				switch(state) {
					case CellState.NORMAL: 
						fillColor = 'rgb(255,255,255)';
						break;
					case CellState.WALL:
						fillColor = 'rgb(125,125,125)';
						break;
					case CellState.PLOTTING:
						fillColor = 'yellow';
						break;
					case CellState.PATH:
						fillColor = 'rgb(51,221,51)';
						break;
					case CellState.START: 
						fillColor = 'blue';
						break;
					case CellState.TARGET: 
						fillColor = 'red';
						break;
				};
			},

			/**
				@public 

				Draws the cell based on it's representational data.

				@param {2DCanvasContext} ctx - The Canvas context to draw the cell to.
			*/
			draw: function(ctx) 
			{
				ctx.beginPath();
				ctx.fillStyle = fillColor;
				ctx.fillRect(x * sideLength + 1, y * sideLength + 1, sideLength - 2, sideLength - 2);
				ctx.fill();
			},

			/**
				@public 

				Implements a click behavior which cycles through the available states and redraws the cell.

				@param {2DCanvasContext} ctx - The canvas context to draw the cell to.

				@returns the state the cell ends up in.
			*/
			onClick: function(ctx) 
			{
				var s = state === CellState.NORMAL 
					? CellState.WALL 
					: (state === CellState.WALL 
						
						? CellState.START 
						: (state === CellState.START 
							
							? CellState.TARGET 
							: CellState.NORMAL));

				this.setState(s);
				this.draw(ctx);

				return s;
			},

			/**
				@public 

				Implements a mousemove behavior which sets the cell either to NORMAL or WALL state depending on what
				the previous cell state it was in. 

				@param {2DCanvasContext} ctx - The canvas context to draw the cell to.

				@returns the state the cell ends up in.
			*/
			onMove: function(ctx)
			{
				var s = state === CellState.NORMAL 
					? CellState.WALL 
					: CellState.NORMAL;

				this.setState(s);

				this.draw(ctx);

				return s;
			}
		};
		
		/* set the state of the cell. */
		self.setState(state);

		return self;
	}

	return Cell
})();
