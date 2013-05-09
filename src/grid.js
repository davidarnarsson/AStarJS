Grid = (function() {
	/**	
		Represents a 2D grid on the canvas.
		@constructor
		@global Grid
		@param {Integer} width - The width of the grid.
		@param {Integer} height - The height of the grid.
		@param {Integer} boxSize - The length of one side of an individual cell.
		@param {Object} options - Additional options, such as the color of the gridlines.
	*/	
	function Grid(width, height, boxSize, options)
	{
		var self = {
			/**
				Draws the grid to the canvas context.

				@public 
				@member Grid
				@param {Object} ctx - The Canvas context.
			*/
			draw: function (ctx) {
				ctx.beginPath();
				
				ctx.strokeStyle = options.lineColor;
				ctx.lineWidth = 1;

				var lineCountX = width / boxSize
				,	lineCountY = height / boxSize;

				for(var i = 0; i < lineCountX; ++i)
				{
					ctx.moveTo(i * boxSize, 0);
					ctx.lineTo(i * boxSize, height);
				}

				for(var i = 0; i < lineCountY; ++i)
				{
					ctx.moveTo(0, i * boxSize);
					ctx.lineTo(width, i * boxSize);
				}

				ctx.stroke();
			}
		};

		return self;
	}
	
	return Grid;
})();	