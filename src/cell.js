Cell = (function() {

	/**
		Represents a cell in the search grid.
		
		@constructor 
		@global Cell
		@param {Integer} id - the ID of the Cell
		@param {Integer} x - the X coordinate of the Cell
		@param {Integer} y - the Y coordinate of the Cell
		@param {Integer} sideLength - the length of one side of the Cell, which is assumed to be square.
		@param {CellState} state - The initial cell state.
	*/
	function Cell(id,x, y, sideLength, state) 
	{

		/**
			The length of a side of the cell. 
			The Cell is assumed to be a square.

			@private 
			@member Cell
		*/
		var sideLength = sideLength
		
		/**
			The Fill color of the cell. Used for drawing the cell.

			@private 
			@member Cell
		*/
		var	fillColor = 'rgb(255,255,255)';
		
		var self = {
		
			/**
				The ID of the cell.
				
				@public 
				@member Cell
			*/
			id: id,
		
			/**
				The X coordinate of the cell.

				@public 
				@member Cell
			*/
			x: x,
			/**
				The Y coordinate of the cell.

				@public 
				@member Cell
			*/
			y: y,
			/**
				The CellState of the cell. 

				@public 
				@member Cell
			*/
			state: state,

			/**

				Sets the state of the Cell.

				It can be NORMAL, WALL, PLOTTING, PATH, START and TARGET. 

				@public 
				@member Cell
				@param {Integer} s - the state to set the Cell to.
			*/
			setState: function(s)
			{
				this.state = s;
				switch(this.state) {
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
				Draws the cell based on it's representational data.	

				@public 
				@member Cell
				@param {class} ctx - The Canvas context to draw the cell to.
			*/
			draw: function(ctx) 
			{
				ctx.beginPath();
				ctx.fillStyle = fillColor;
				ctx.fillRect(x * sideLength + 1, y * sideLength + 1, sideLength - 2, sideLength - 2);
				ctx.fill();
			},

			/**
				Implements a click behavior which cycles through the available states and redraws the cell.

				@public 
				@member Cell
				@param {class} ctx - The canvas context to draw the cell to.
				@returns the state the cell ends up in.
			*/
			onClick: function(ctx) 
			{
				var s = this.state === CellState.NORMAL 
					? CellState.WALL 
					: (this.state === CellState.WALL 
						
						? CellState.START 
						: (this.state === CellState.START 
							
							? CellState.TARGET 
							: CellState.NORMAL));

				this.setState(s);
				this.draw(ctx);

				return s;
			},

			/**
				Implements a mousemove behavior which sets the cell either to NORMAL or WALL state depending on what
				the previous cell state it was in. 
				
				@public 
				@member Cell
				@param {Object} ctx - The canvas context to draw the cell to.
				@returns the state the cell ends up in.
			*/
			onMove: function(ctx)
			{
				var s = this.state === CellState.NORMAL 
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
