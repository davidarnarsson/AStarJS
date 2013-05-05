/*wikipedia'd*/ 
AStarSearchAdapter = (function() {

	/**
		@constructor
	*/
	function AStarSearchAdapter(searchgrid, options) {

		/**
			@private
			@member AStarSearchAdapter 

			The lookup of nodes that have already been explored.
			It's used to evaluate whether a node requires re-evaluation
			based on it's previous G(X) score.
		*/
		var closedSet = []
		/**
			@private
			@member AStarSearchAdapter

			A priority queue of nodes that need evaluation based on the current node.
			The queue is sorted by the lowest g(x)+h(x) score. This is pretty much
			where the magic happens.
		*/
		,	openSet = new PriorityQueue({ low: true })

		/**
			@private 
			@member AStarSearchAdapter

			A node - node map which holds the results. When the path finding is done, 
			this map is used to traverse the path, from the goal to the start.
		*/
		,	nodePathMap = {}

		/**
			@private
			@member AStarSearchAdapter

			A map holding the G(X) scores of the nodes, that is, the cost of travelling from 
			the start to a node N.
		*/
		,	g = {}

		/**
			@private 
			@member AStarSearchAdapter

			A map holding the F(X) scores of the nodes, or the total cost of travelling from 
			the start to a node N + the result of the heuristic function of the node N and the 
			goal node.
		*/
		, 	f = {}

		/**
			@private 
			@member AStarSearchAdapter

			The nodes.
		*/
		,	nodes = searchgrid

		/** 
			@private 
			@member AStarSearchAdapter

			The starting node.
		*/
		,	start = searchgrid.getStartNode()
		/** 
			@private 
			@member AStarSearchAdapter

			The target node.
		*/
		,	target = searchgrid.getTargetNode();


		/**
			@private 
			@member AStarSearchAdapter

			Constructs a path based on the the came from parameter and the current node.

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
			@private 
			@member AStarSearchAdapter

			Uses euclidian distance as a heuristic. 
		*/
		var heuristic = function(node, targetNode) {
			var target = nodes.get(targetNode)
			,	current = nodes.get(node);

			return Math.sqrt(
					Math.pow(current.x - target.x, 2) +
					Math.pow(current.y - target.y, 2));
		};


		var self = {
			run: function(ctx) {

				// while the open set has has nodes
				// (in the beginning the starting node is the only node)
				while(openSet.size() > 0) { 
					var current = openSet.pop();

					// if the current node on top of the open set 
					// is the target node 
					if(current === target) {

						// we return the constructed path.
						return getPath(nodePathMap, target);
					}

					// we mark the current node as visited.
					closedSet[current] = 1;

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
				}

				// otherwise a path has not been found.
				return false;
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