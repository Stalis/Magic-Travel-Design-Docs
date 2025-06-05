type Point = {
    x: number;
    y: number;
};

const source: Point = { x: 1, y: 0 };
const target: Point = { x: 5, y: 4 };

// Simplified diagonal line algorithm
const getCellsEuclidean = (source: Point, target: Point): Point[] => {
  const cells: Point[] = [];
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(source.x + (dx * i) / steps);
    const y = Math.round(source.y + (dy * i) / steps);
    cells.push({ x, y });
  }
  
  return cells;
}


const printPoint = (point: Point) => `(${point.x};${point.y})`;

// Test both algorithms
console.log('Euclidean cells (interpolation):', getCellsEuclidean(source, target)
  .map(printPoint)
  .join(' -> '));

type WallSide = 'north' | 'south' | 'east' | 'west';

type PathCheckPoint = Point & {
    walls: WallSide[];
}
/*
Пример: луч из (1,0) в (5,4)
  0 1 2 3 4 5    . - пустая клетка
0 . S . . . .    o - препятствие
1 . o \ . . .    S - источник
2 . . . \ o .    E - цель
3 . . . . \ .    \ - луч
4 . . . . . E

Алгоритм:
1. Получаем все клетки на пути: (1,0) → (2,0) → (2,1) → (3,1) → (3,2) → (4,2) → (4,3) → (5,3) → (5,4)
2. Для каждой пары соседних клеток проверяем стену между ними
*/
/*
    * This function takes an array of points and returns an array of PathCheckPoint objects.
    * Each PathCheckPoint object contains the x and y coordinates of the point,
    * and walls, which need to check for obstacles.
    * Function should add cells that connected to path.
    * Examples: 
    *   if path is from (0,0) to (1,0) then walls should be ['east'] for (0,0) and ['west'] for (1,0).
    *   if path is from (0,0) to (0,1) then walls should be ['south'] for (0,0) and ['north'] for (0,1).
    *   if path is from (0,0) to (1,1) then walls should be ['east', 'south'] for (0,0) and ['west', 'north'] for (1,1).
    *       And it needs to add (0,1) with walls ['north', 'east'] and (1,0) with walls ['south', 'west'].
    * This function is used to create a path for the grid algorithm.
*/
const getAllPath = (points: Point[]): PathCheckPoint[] => {
  if (points.length === 0) return [];
  if (points.length === 1) return [{ ...points[0], walls: [] }];

  const result: PathCheckPoint[] = [];
  
  // Helper function to add a point if not already added
  const addPoint = (point: Point, walls: WallSide[]) => {
    const existing = result.find(p => p.x === point.x && p.y === point.y);
    
    if (existing) {
      // Merge walls, avoiding duplicates
      const allWalls = [...existing.walls, ...walls];
      existing.walls = [...new Set(allWalls)];
    } else {
      result.push({ ...point, walls: [...walls] });
    }
  };

  // Process each consecutive pair of points
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    
    // Determine movement direction and required walls
    const currentWalls: WallSide[] = [];
    const nextWalls: WallSide[] = [];

    // Horizontal movement
    if (dx > 0) {
      currentWalls.push('east');
      nextWalls.push('west');
    } else if (dx < 0) {
      currentWalls.push('west');
      nextWalls.push('east');
    }
    
    // Vertical movement
    if (dy > 0) {
      currentWalls.push('south');
      nextWalls.push('north');
    } else if (dy < 0) {
      currentWalls.push('north');
      nextWalls.push('south');
    }
    
    // Add the current point first
    addPoint(current, currentWalls);
    
    // For any movement (not just unit diagonal), we need to check all cells
    // that could block the line between current and next
    if (dx !== 0 || dy !== 0) {
      // Get all cells that the line crosses
      const intermediateCells = getLineCrossingCells(current, next);
      
      // Add each intermediate cell with appropriate walls
      intermediateCells.forEach(cell => {
        const cellWalls: WallSide[] = [];
        
        // Determine which walls this cell needs to check based on line direction
        const cellDx = cell.x - current.x;
        const cellDy = cell.y - current.y;
        const remainingDx = next.x - cell.x;
        const remainingDy = next.y - cell.y;
        
        // Add walls based on where we came from
        if (cellDx > 0) cellWalls.push('west');
        if (cellDx < 0) cellWalls.push('east');
        if (cellDy > 0) cellWalls.push('north');
        if (cellDy < 0) cellWalls.push('south');
        
        // Add walls based on where we're going
        if (remainingDx > 0) cellWalls.push('east');
        if (remainingDx < 0) cellWalls.push('west');
        if (remainingDy > 0) cellWalls.push('south');
        if (remainingDy < 0) cellWalls.push('north');
        
        addPoint(cell, cellWalls);
      });
    }
    
    // Add the next point last (only on the final iteration or if it's the last point)
    if (i === points.length - 2) {
      addPoint(next, nextWalls);
    }
  }
  
  return result;
}

// Helper function to get all cells that a line crosses between two points
const getLineCrossingCells = (start: Point, end: Point): Point[] => {
  const cells: Point[] = [];
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  
  // If it's a single step movement, handle the diagonal case
  if (dx <= 1 && dy <= 1) {
    if (dx === 1 && dy === 1) {
      // Add the two intermediate cells for diagonal movement
      cells.push({ x: start.x, y: end.y }); // vertical step
      cells.push({ x: end.x, y: start.y }); // horizontal step
    }
    return cells;
  }
  
  // For longer lines, we need to find all cells the line passes through
  // Use a grid traversal algorithm to find all cells the line crosses
  const stepX = end.x > start.x ? 1 : end.x < start.x ? -1 : 0;
  const stepY = end.y > start.y ? 1 : end.y < start.y ? -1 : 0;
  
  // Add all adjacent cells that the line might cross
  let x = start.x;
  let y = start.y;
  
  while (x !== end.x || y !== end.y) {
    // Check if we should move horizontally or vertically (or both)
    const remainingX = Math.abs(end.x - x);
    const remainingY = Math.abs(end.y - y);
    
    // Add adjacent cells that could be crossed
    if (stepX !== 0 && stepY !== 0) {
      // For diagonal movement, add the adjacent cells
      if (x !== end.x && y !== end.y) {
        cells.push({ x: x + stepX, y: y });     // horizontal step
        cells.push({ x: x, y: y + stepY });     // vertical step
      }
    }
    
    // Move to next cell
    if (remainingX > 0) x += stepX;
    if (remainingY > 0) y += stepY;
  }
  
  return cells;
}

// Test the getAllPath function
const testPath = getCellsEuclidean(source, target);
console.log('\nTest path:', testPath.map(printPoint).join(' -> '));

const pathCheckPoints = getAllPath(testPath);
console.log('\nPath check points:');
pathCheckPoints.forEach(point => {
  console.log(`  ${printPoint(point)}: walls [${point.walls.join(', ')}]`);
});

// Test simple horizontal movement
const horizontalPath = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
console.log('\nHorizontal test:', getAllPath(horizontalPath).map(p => 
  `${printPoint(p)}:[${p.walls.join(',')}]`).join(' '));

// Test simple vertical movement
const verticalPath = [{ x: 0, y: 0 }, { x: 0, y: 1 }];
console.log('Vertical test:', getAllPath(verticalPath).map(p => 
  `${printPoint(p)}:[${p.walls.join(',')}]`).join(' '));

// Test diagonal movement
const diagonalPath = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
console.log('Diagonal test:', getAllPath(diagonalPath).map(p => 
  `${printPoint(p)}:[${p.walls.join(',')}]`).join(' '));

// Test for ~60-degree diagonal movement
const sixtyDegSource = { x: 0, y: 0 };
const sixtyDegTarget = { x: 6, y: 3 };
const sixtyDegDiagonalPath = getCellsEuclidean(sixtyDegSource, sixtyDegTarget);
console.log('~60 Degree path:', sixtyDegDiagonalPath.map(printPoint).join(' -> '));
console.log('~60 Degree Diagonal test:', getAllPath(sixtyDegDiagonalPath).map(p => 
  `${printPoint(p)}:[${p.walls.join(',')}]`).join(' '));