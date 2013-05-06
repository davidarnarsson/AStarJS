	function Grid(width, height, boxSize)
		{
			this._width = width; 
			this._height = height; 
			this._boxSize = boxSize; 
		}

		Grid.prototype.draw = function (ctx)
		{
			ctx.beginPath();
			
			ctx.strokeStyle = Options.lineColor;
			ctx.lineWidth = 1;

			var lineCountX = this._width / this._boxSize
			,	lineCountY = this._height / this._boxSize;

			for(var i = 0; i < lineCountX; ++i)
			{
				ctx.moveTo(i * this._boxSize, 0);
				ctx.lineTo(i * this._boxSize, this._height);
			}

			for(var i = 0; i < lineCountY; ++i)
			{
				ctx.moveTo(0, i * this._boxSize);
				ctx.lineTo(this._width, i * this._boxSize);
			}

			ctx.stroke();
		}
