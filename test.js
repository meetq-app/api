const matrix1 = [
  [1,1,1,0,0,0],
  [0,1,1,0,0,0],
  [0,0,0,1,1,0],
  [0,1,1,0,1,0]
]

function findObjects(matrix){
  const objectsCount = 0;
  const visitedList = [];

  for(let i=0; i<matrix.length; i++){
    for(let j=0; j<matrix[0].length; j++){
      let count = traverse(matrix, 0, 0, visitedList)
      if(count > 0)
        objectsCount++
    }
  }
  
  return objectsCount;
}

function traverse(matrix, i, j, visitedList, count=0){
  if(matrix[i][j] === 0 || visitedList[`${i}${j}`])
    return count

  if(matrix[i][j] === 1){
    count++
    visitedList.push(`${i}${j}`)
    traverse(matrix, i, j+1, visitedList, count)
    traverse(matrix, i+1, j, visitedList, count)
  }
}

console.log(findObjects(matrix1));