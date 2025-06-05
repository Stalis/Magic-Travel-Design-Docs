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

// Alternative: Even simpler step-by-step approach
const getCellsEuclideanSimple = (source: Point, target: Point): Point[] => {
  const cells: Point[] = [];
  const stepX = target.x > source.x ? 1 : target.x < source.x ? -1 : 0;
  const stepY = target.y > source.y ? 1 : target.y < source.y ? -1 : 0;
  
  let x = source.x;
  let y = source.y;
  
  while (x !== target.x || y !== target.y) {
    cells.push({ x, y });
    if (x !== target.x) x += stepX;
    if (y !== target.y) y += stepY;
  }
  cells.push({ x, y }); // Add target
  
  return cells;
}

const printPoint = (point: Point) => `(${point.x};${point.y})`;

// Test both algorithms
console.log('Euclidean cells (interpolation):', getCellsEuclidean(source, target)
  .map(printPoint)
  .join(' -> '));

console.log('Euclidean cells (simple step):', getCellsEuclideanSimple(source, target)
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
  const addedCells = new Set<string>();
  
  // Helper function to add a point if not already added
  const addPoint = (point: Point, walls: WallSide[]) => {
    const key = `${point.x},${point.y}`;
    const existing = result.find(p => p.x === point.x && p.y === point.y);
    
    if (existing) {
      // Merge walls, avoiding duplicates
      const allWalls = [...existing.walls, ...walls];
      existing.walls = [...new Set(allWalls)];
    } else {
      result.push({ ...point, walls: [...walls] });
      addedCells.add(key);
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
    
    // For diagonal movement, add the additional cells before the next point
    if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
      // Add the two additional cells that connect the diagonal
      const cell1 = { x: current.x, y: current.y + dy }; // vertical step first
      const cell2 = { x: current.x + dx, y: current.y }; // horizontal step first
      
      // For cell1 (vertical movement from current)
      const cell1Walls: WallSide[] = [];
      if (dy > 0) {
        cell1Walls.push('north'); // came from north
        cell1Walls.push('east'); // going east to reach next
      } else {
        cell1Walls.push('south'); // came from south
        cell1Walls.push('east'); // going east to reach next
      }
      
      // For cell2 (horizontal movement from current)
      const cell2Walls: WallSide[] = [];
      if (dx > 0) {
        cell2Walls.push('west'); // came from west
        cell2Walls.push('south'); // going south to reach next
      } else {
        cell2Walls.push('east'); // came from east  
        cell2Walls.push('south'); // going south to reach next
      }
      
      addPoint(cell1, cell1Walls);
      addPoint(cell2, cell2Walls);
    }
    
    // Add the next point last (only on the final iteration or if it's the last point)
    if (i === points.length - 2) {
      addPoint(next, nextWalls);
    }
  }
  
  return result;
}

// Test the getAllPath function
const testPath = getCellsEuclideanSimple(source, target);
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
const sixtyDegDiagonalPath = [{ x: 0, y: 0 }, { x: 6, y: 3 }];
console.log('~60 Degree Diagonal test:', getAllPath(sixtyDegDiagonalPath).map(p => 
  `${printPoint(p)}:[${p.walls.join(',')}]`).join(' '));