/*wikipedia'd*/ 
AStarSearchAdapter = (function() {

	/**
		@constructor
		@global AStarSearchAdapter

		@param {Object} searchgrid - the grid of nodes to search from.
		@param {Object} options - A map of options, such as the delay between open set pops.								
	*/
	function AStarSearchAdapter(searchgrid, options) {

		/**
			The lookup of nodes that have already been explored.
			It's used to evaluate whether a node requires re-evaluation
			based on it's previous G(X) score.

			@private
			@member AStarSearchAdapter 
		*/
		var closedSet = []
		/**
			A priority queue of nodes that need evaluation based on the current node.
			The queue is sorted by the lowest g(x)+h(x) score. This is pretty much
			where the magic happens.

			@private
			@member AStarSearchAdapter
		*/
		,	openSet = new PriorityQueue({ low: true })

		/**
			A node - node map which holds the results. When the path finding is done, 
			this map is used to traverse the path, from the goal to the start.

			@private 
			@member AStarSearchAdapter
		*/
		,	nodePathMap = {}

		/**
			A map holding the G(X) scores of the nodes, that is, the cost of travelling from 
			the start to a node N.

			@private
			@member AStarSearchAdapter
		*/
		,	g = {}

		/**
			A map holding the F(X) scores of the nodes, or the total cost of travelling from 
			the start to a node N + the result of the heuristic function of the node N and the 
			goal node.

			@private 
			@member AStarSearchAdapter
		*/
		, 	f = {}

		/**
			The nodes.

			@private 
			@member AStarSearchAdapter
		*/
		,	nodes = searchgrid

		/** 
			The starting node.

			@private 
			@member AStarSearchAdapter
		*/
		,	start = searchgrid.getStartNode()
		/** 
			The target node.

			@private 
			@member AStarSearchAdapter
		*/
		,	target = searchgrid.getTargetNode()

		/**
			The previous best found path, used for drawing and resetting drawing state.

			@private 
			@member AStarSearchAdapter
		*/
		,	previousPath = null;

		/**
			Constructs a path based on the the came from parameter and the current node.

			@private 
			@member AStarSearchAdapter
			@param {Object} map - a traversal map of node mappings
			@param {Integer} current - the current node id 
		*/
		var getPath = function(map, current) {
			if(current in map) {
				var path = getPath(map, map[current]);
				path.unshift(current);
				return path;
			}
			return [current];
		}

		/**
			Uses euclidian distance as a heuristic. 

			@private 
			@member AStarSearchAdapter
			@param {Object} node - The node id of the current node
			@param {Object} targetNode - The node id of the target node
			@returns a heuristic value which indicates the goodness of the current node.
		*/
		var heuristic = function(node, targetNode) {
			var target = nodes.get(targetNode)
			,	current = nodes.get(node);

			return Math.sqrt(
					Math.pow(current.x - target.x, 2) +
					Math.pow(current.y - target.y, 2));
		};


		/**
			Draws a path on the canvas context and clears a previously drawn path.

			@private
			@member AStarSearchAdapter
		*/		
		var drawPath = function(ctx, path) {
			if(previousPath) {
				for(var i = 0; i < previousPath.length; ++i) {
					nodes.get(previousPath[i]).setState(CellState.PLOTTING);
					nodes.get(previousPath[i]).draw(ctx);
				}	
			}

			for(var i = 0; i < path.length; ++i) {
				nodes.get(path[i]).setState(CellState.PATH);
				nodes.get(path[i]).draw(ctx);
			}	

			previousPath = path;
		}


		var self = {

			/**
				Runs the A* search algorithm as well as drawing the current state
				of the search to the canvas context parameter.

				@public
				@member AStarSearchAdapter
				@param {Object} ctx - The canvas context
				@param {Function} done - A callback function which will get called once the algorithm has been run.
				@returns a path of node-ids if a path was found, false if no path was found.
			*/
			run: function(ctx, done) {

				function onePass() {
					
					var current = openSet.pop();

					// if the current node on top of the open set 
					// is the target node 
					if(current === target) {
					
						// we return the constructed path.
						drawPath(ctx, getPath(nodePathMap, target));
						done(getPath(nodePathMap, target));
						return;
					}

					// we mark the current node as visited.
					closedSet[current] = 1;
					nodes.get(current).setState(CellState.PLOTTING);
					nodes.get(current).draw(ctx);

					// get the adjacent nodes. The number of the 
					// adjacent nodes depends on the SearchGrid implementation
					var adjacentNodes = nodes.getAdjacent(current);

					for (var i = 0; i < adjacentNodes.length; ++i) {

						// calculate the tentative G(neighbour)
						var neighbor = adjacentNodes[i]
						,	tentative_g = g[current] + heuristic(current, neighbor);

						// if the neighbor is in the closed set and gets a higher tentative g cost
						// travelling through the current node, we continue to the next neighbor,
						// as this is clearly a more expensive route.
						if (closedSet[neighbor] && tentative_g >= g[neighbor]) {
							continue;
						}

						// if the neighbor is not in the open set or the tentative g score is lower(better)
						// than a previously attained score
						if (openSet.includes(neighbor) === false || tentative_g < g[neighbor]) {

							// we map the traversal from the current node to the neighbour
							nodePathMap[neighbor] = current;

							drawPath(ctx, getPath(nodePathMap, current));

							// set the cost of getting to the neighbor
							g[neighbor] = tentative_g;

							// and set the estimated cost of getting to the target 
							// from the neighbor.
							f[neighbor] = tentative_g + heuristic(neighbor, target);

							// finally add the neighbor to the open set if 
							// it isn't already on it.
							if (openSet.includes(neighbor) === false) {
								openSet.push(neighbor, f[neighbor]);
							}

						}
					}

					if(openSet.size() > 0) {
						setTimeout(onePass, (typeof options.delay === "function" ? options.delay() : options.delay) || 100);
					} else {
						// otherwise a path has not been found.
						done(false);
					}
				}
				
				onePass();
			}
		};

		// initialize the open set with the starting node, 
		// which has a priority value of 0 
		openSet.push(start, heuristic(start, target));

		// score leading up to this path 
		g[start] = 0;

		// total score leading up to + heuristic to goal.
		f[start] = g[start] + heuristic(start, target);

		return self;
	}

	return AStarSearchAdapter;
})();