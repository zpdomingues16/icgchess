import * as THREE from './js/three.module.js';
import { OrbitControls } from "./js/OrbitControls.js";
import { GLTFLoader } from "./js/GLTFLoader.js";
  
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;
camera.position.y = 0;
camera.lookAt(0, 0, 0); 

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Importing gltf model
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  '../chess_set/scene.gltf',
  (gltf) => {
    const model = gltf.scene;

    model.scale.set(10, 10, 10);
    model.position.set(10, 0, 0);

    model.traverse(function(node) {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });

    scene.add(model);
  },
  undefined, 
  (error) => console.error(error)
);


// Materials
const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const pawnMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const pawnMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const towerMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const towerMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const bishopMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const bishopMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const knightMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const knightMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const queenMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const queenMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const kingMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const kingMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// Geometries
const squareGeometry = new THREE.BoxGeometry(1, 1, 1);
const pawnGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const towerGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
const bishopGeometry = new THREE.ConeGeometry(0.5, 1, 4);
const knightGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.4);
const torusKnotGeometry = new THREE.TorusKnotBufferGeometry(0.3, 0.1, 64, 16);

const chessboardSquares = [];

function createChessboard() {
  const fileNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rankNames = ['1', '2', '3', '4', '5', '6', '7', '8'];

  for (let x = 0; x < 8; x++) {
    // Create a new row array to store the square objects
    const row = [];
    
    for (let y = 0; y < 8; y++) {
      const material = (x + y) % 2 === 0 ? whiteMaterial : blackMaterial;
      const square = new THREE.Mesh(squareGeometry, material);
      square.position.set(x - 3.5, y - 3.5, 0);
      const squareName = fileNames[x] + rankNames[y];
      square.name = squareName;

      // Store the square object in the row array
      row.push(square);
      
      scene.add(square);
    }
    chessboardSquares.push(row);


    // Add the row 
  }
}

function createPawns() {
  const pawnSpheres = [];
  const fileNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  for (let x = 0; x < 8; x++) {
    const pawnSphereRed = new THREE.Mesh(pawnGeometry, pawnMaterialRed);
    const pawnSphereBlue = new THREE.Mesh(pawnGeometry, pawnMaterialBlue);

    const fileName = fileNames[x]; // Get the appropriate file name based on the index

    pawnSphereRed.position.set(x - 3.5, -2.5, 1);
    pawnSphereBlue.position.set(x - 3.5, 2.5, 1);

    pawnSphereRed.name = `Pawn_Red_${fileName}2`; // Assign a name to the red pawn using algebraic notation
    pawnSphereBlue.name = `Pawn_Blue_${fileName}7`; // Assign a name to the blue pawn using algebraic notation

    scene.add(pawnSphereRed);
    scene.add(pawnSphereBlue);

    pawnSphereBlue.userData.draggable = true;
    pawnSphereRed.userData.draggable = true;
    pawnSphereBlue.userData.name = "Pawn";

    pawnSpheres.push(pawnSphereRed, pawnSphereBlue);
  }

  return pawnSpheres;
}


function createTowers() {
  const towerSquares = [];

  const towerPositions = [
    { x: 0, y: -3.5, side: 'Red' },
    { x: 7, y: -3.5, side: 'Red' },
    { x: 0, y: 3.5, side: 'Blue' },
    { x: 7, y: 3.5, side: 'Blue' }
  ];

  let towerCounterRed = 1; // Counter for red towers
  let towerCounterBlue = 1; // Counter for blue towers

  for (const position of towerPositions) {
    const towerMaterial = position.side === 'Red' ? towerMaterialRed : towerMaterialBlue;
    const towerSquare = new THREE.Mesh(towerGeometry, towerMaterial);
    towerSquare.position.set(position.x - 3.5, position.y, 1);

    // Get the file name based on the x-coordinate
    const fileName = String.fromCharCode(97 + position.x);

    // Assign names to the tower pieces using algebraic notation
    const towerName = `Tower_${position.side}_${fileName}${position.side === 'Red' ? towerCounterRed : towerCounterBlue}`;
    towerSquare.name = towerName;

    scene.add(towerSquare);
    towerSquare.userData.draggable = true;

    towerSquares.push(towerSquare);

    if (position.side === 'Red') {
      towerCounterRed++;
    } else {
      towerCounterBlue++;
    }
  }

  return towerSquares;
}

function createBishops() {
  const bishopPyramids = [];

  const bishopPositions = [
    { x: 2, y: -3.5, side: 'Red' },
    { x: 5, y: -3.5, side: 'Red' },
    { x: 2, y: 3.5, side: 'Blue' },
    { x: 5, y: 3.5, side: 'Blue' }
  ];

  let bishopCounterRed = 1; // Counter for red bishops
  let bishopCounterBlue = 1; // Counter for blue bishops

  for (const position of bishopPositions) {
    const bishopMaterial = position.side === 'Red' ? bishopMaterialRed : bishopMaterialBlue;
    const bishopPyramid = new THREE.Mesh(bishopGeometry, bishopMaterial);
    bishopPyramid.position.set(position.x - 3.5, position.y, 1);
    bishopPyramid.rotation.x = Math.PI / 2;

    // Get the file name based on the x-coordinate
    const fileName = String.fromCharCode(97 + position.x);

    // Assign names to the bishop pieces using algebraic notation
    const bishopName = `Bishop_${position.side}_${fileName}${position.side === 'Red' ? bishopCounterRed : bishopCounterBlue}`;
    bishopPyramid.name = bishopName;
    bishopPyramid.userData.draggable = true;

    scene.add(bishopPyramid);

    bishopPyramids.push(bishopPyramid);

    if (position.side === 'Red') {
      bishopCounterRed++;
    } else {
      bishopCounterBlue++;
    }
  }

  return bishopPyramids;
}

function createKnights() {
  const knightCylinders = [];

  const knightPositions = [
    { x: 1, y: -3.5, side: 'Red' },
    { x: 6, y: -3.5, side: 'Red' },
    { x: 1, y: 3.5, side: 'Blue' },
    { x: 6, y: 3.5, side: 'Blue' }
  ];

  let knightCounterRed = 1; // Counter for red knights
  let knightCounterBlue = 1; // Counter for blue knights

  for (const position of knightPositions) {
    const knightMaterial = position.side === 'Red' ? knightMaterialRed : knightMaterialBlue;
    const knightCylinder = new THREE.Mesh(knightGeometry, knightMaterial);
    knightCylinder.position.set(position.x - 3.5, position.y, 1);
    knightCylinder.rotation.x = Math.PI / 2;

    // Get the file name based on the x-coordinate
    const fileName = String.fromCharCode(97 + position.x);

    // Assign names to the knight pieces using algebraic notation
    const knightName = `Knight_${position.side}_${fileName}${position.side === 'Red' ? knightCounterRed : knightCounterBlue}`;
    knightCylinder.name = knightName;

    knightCylinder.userData.draggable = true;

    scene.add(knightCylinder);

    knightCylinders.push(knightCylinder);

    if (position.side === 'Red') {
      knightCounterRed++;
    } else {
      knightCounterBlue++;
    }
  }

  return knightCylinders;
}

function createQueenAndKing() {
  const queenMeshRed = new THREE.Mesh(dodecahedronGeometry, queenMaterialRed);
  const queenMeshBlue = new THREE.Mesh(dodecahedronGeometry, queenMaterialBlue);
  const kingMeshRed = new THREE.Mesh(torusKnotGeometry, kingMaterialRed);
  const kingMeshBlue = new THREE.Mesh(torusKnotGeometry, kingMaterialBlue);

  queenMeshRed.position.set(-0.5, -3.5, 1);
  queenMeshBlue.position.set(-0.5, 3.5, 1);
  kingMeshRed.position.set(0.5, -3.5, 1);
  kingMeshBlue.position.set(0.5, 3.5, 1);

  queenMeshRed.userData.draggable = true;
  queenMeshBlue.userData.draggable = true;
  kingMeshRed.userData.draggable = true;
  kingMeshBlue.userData.draggable = true;

  // Assign names to the queen and king pieces using algebraic notation
  queenMeshRed.name = "Queen_Red_d1";
  queenMeshBlue.name = "Queen_Blue_d8";
  kingMeshRed.name = "King_Red_e1";
  kingMeshBlue.name = "King_Blue_e8";

  scene.add(queenMeshRed);
  scene.add(queenMeshBlue);
  scene.add(kingMeshRed);
  scene.add(kingMeshBlue);

  return [queenMeshRed, queenMeshBlue, kingMeshRed, kingMeshBlue];
}



const occupiedSquares = {}; // Object to track occupied squares

function updatePiecePosition(pieceName, squareName) {
  const piece = scene.getObjectByName(pieceName);
  const square = scene.getObjectByName(squareName);
  const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const redWhite = new THREE.MeshBasicMaterial({ color: 0xfffff });
  changeSquareColor(squareName, redMaterial);

  console.log(square);

  if (piece && square) {
    const capturedPieceName = occupiedSquares[squareName]; // Check if there's a captured piece at the destination square
    if (capturedPieceName) {
      const capturedPiece = scene.getObjectByName(capturedPieceName);
      if (capturedPiece) {
        scene.remove(capturedPiece); // Remove the captured piece from the scene
      }
      delete occupiedSquares[squareName]; // Clear the occupied square
  
    }

    // Update the position of the piece to match the position of the square
    piece.position.copy(square.position);
    piece.position.z = 1;

    occupiedSquares[squareName] = pieceName; // Update the occupied square with the new piece
  } else {
    console.log("Piece or square not found.");
  }
}



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
let draggable = null;

window.addEventListener('click', event => {
  if (draggable) {
    console.log(`dropping draggable ${draggable.userData.name}`);
    draggable = null;
    return;
  }

  clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickMouse.y = (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(clickMouse, camera);
  const found = raycaster.intersectObjects(scene.children);
  if (found.length > 0) {
    const firstObject = found[0].object;
    if (firstObject.userData.draggable) {
      draggable = firstObject;
      console.log(`found draggable ${draggable.userData.name}`);
    }
  }
});


window.addEventListener('mousemove', event => {
  moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  moveMouse.y = (event.clientY / window.innerHeight) * 2 + 1;
  dragObject();
});

function dragObject() {
  if (draggable !== null) {
    raycaster.setFromCamera(moveMouse, camera);
    const found = raycaster.intersectObjects(scene.children);
    if (found.length > 0) {
      for (const object of found) {
        if (object.object.userData.ground) {
          draggable.position.x = object.point.x;
          draggable.position.y = object.point.y;
          break; // Exit the loop after the first valid intersection
        }
      }
    }
  }
}




function findSquareByName(squareName) {
  for (const row of chessboardSquares) {
    for (const square of row) {
      if (square.name === squareName) {
        return square;
      }
    }
  }
  
  return null;
}

function changeSquareColor(squareName, colorMaterial) {
  const square = findSquareByName(squareName);
  
  if (square) {
    square.material = colorMaterial;
  } else {
    console.log(`Square ${squareName} not found.`);
  }
}


function getSquareName(pieceName) {
  const piece = scene.getObjectByName(pieceName);

  if (piece) {
    const piecePosition = piece.position;
    const squareX = Math.round(piecePosition.x + 3.5);
    const squareY = Math.round(piecePosition.y + 3.5);
    const squareName = String.fromCharCode(97 + squareX) + (squareY + 1);
    return squareName;
  } else {
    return "Piece not found";
  }
}


function animate() {
  requestAnimationFrame(animate);
  dragObject();


  controls.update();
  TWEEN.update();

  renderer.render(scene, camera);
}




const moves = [
  { piece: "Pawn_Red_e2", destination: "e4" },
  { piece: "Pawn_Blue_c7", destination: "c5" },
  { piece: "Pawn_Red_c2", destination: "c3" },
  { piece: "Pawn_Blue_d7", destination: "d5" },
  { piece: "Pawn_Red_e2", destination: "d5" },
  { piece: "Queen_Blue_d8", destination: "d5" },
  { piece: "Pawn_Red_d2", destination: "d4" },
  { piece: "Knight_Blue_g2", destination: "f6" },
  { piece: "Knight_Red_g2", destination: "f3" },
  { piece: "Bishop_Blue_c1", destination: "g4" },
  { piece: "Bishop_Red_f2", destination: "e2" },
  { piece: "Pawn_Blue_e7", destination: "e6" },
  { piece: "Pawn_Red_h2", destination: "h3" },
  { piece: "Bishop_Blue_c1", destination: "h5" },
  { piece: "King_Red_e1", destination: "g1" },
  { piece: "Tower_Red_h2", destination: "f1" },
  { piece: "Knight_Blue_b1", destination: "c6" },
  { piece: "Bishop_Red_c1", destination: "e3" },
  { piece: "Pawn_Blue_c7", destination: "d4" },
  { piece: "Pawn_Red_c2", destination: "d4" },
  { piece: "Bishop_Blue_f2", destination: "b4" },
  { piece: "Pawn_Red_a2", destination: "a3" },
  { piece: "Bishop_Blue_f2", destination: "a5" },
  { piece: "Knight_Red_b1", destination: "c3" },
  { piece: "Queen_Blue_d8", destination: "d6" },
  { piece: "Knight_Red_b1", destination: "b5" },
  { piece: "Queen_Blue_d8", destination: "e7" },
  { piece: "Knight_Red_g2", destination: "e5" },
  { piece: "Bishop_Blue_c1", destination: "e2" },
  { piece: "Queen_Red_d1", destination: "e2" },
  { piece: "King_Blue_e8", destination: "g8" },
  { piece: "Tower_Blue_h2", destination: "f8" },
  { piece: "Tower_Red_a1", destination: "c1" },
  { piece: "Tower_Blue_a1", destination: "c8" },
  { piece: "Bishop_Red_c1", destination: "g5" },
  { piece: "Bishop_Blue_f2", destination: "b6" },
  { piece: "Bishop_Red_c1", destination: "f6" },
  { piece: "Pawn_Blue_g7", destination: "f6" },
  { piece: "Knight_Red_g2", destination: "c4" },
  { piece: "Tower_Blue_h2", destination: "d8" },
  { piece: "Knight_Red_g2", destination: "b6"},
  { piece: "Pawn_Blue_a7", destination: "b6" },
  { piece: "Tower_Red_h2", destination: "d1" },
  { piece: "Pawn_Blue_g7", destination: "f5" },
  { piece: "Queen_Red_d1", destination: "e3" },
  { piece: "Queen_Blue_d8", destination: "f6" },
  { piece: "Pawn_Red_c2", destination: "d5" },
  { piece: "Tower_Blue_a1", destination: "d5" },
  { piece: "Queen_Red_d1", destination: "c5" },
  { piece: "Pawn_Blue_e7", destination: "d4" },
  { piece: "Pawn_Red_b2", destination: "b3" },
  { piece: "King_Blue_e8", destination: "h8" },
  { piece: "Queen_Red_d1", destination: "b6" },
  { piece: "Tower_Blue_f6", destination: "g8" },
  { piece: "Queen_Blue_d8", destination: "d8" },
  { piece: "Rook_Red_d8", destination: "g8" },
  { piece: "Knight_Blue_f3", destination: "h2" },
  { piece: "Rook_Red_g8", destination: "g7" },
  { piece: "Knight_Blue_h2", destination: "f3" },
  { piece: "King_Red_e1", destination: "g1" },
  { piece: "Rook_Blue_g7", destination: "g1" },
  { piece: "Rook_Red_g1", destination: "g7" },
  { piece: "Knight_Blue_f3", destination: "e4" },
  { piece: "Rook_Red_g7", destination: "g1" },
  { piece: "Rook_Blue_g1", destination: "g7" },
  { piece: "Rook_Red_g1", destination: "g7" },
  { piece: "Knight_Blue_e4", destination: "g3" },
  { piece: "Rook_Red_g7", destination: "g1" },
  { piece: "Rook_Blue_g1", destination: "g7" },
  { piece: "Rook_Red_g7", destination: "g1" },
  { piece: "Rook_Blue_g7", destination: "g1" },
  { piece: "Rook_Red_g1", destination: "g7" },
  { piece: "Rook_Blue_g1", destination: "g7" },
  { piece: "Rook_Red_g7", destination: "g1" },
  { piece: "Rook_Blue_g7", destination: "g1" },
  { piece: "Rook_Red_g1", destination: "g7" },
  { piece: "Rook_Blue_g1", destination: "g7" },
  { piece: "Rook_Red_g7", destination: "g1" },
  { piece: "Rook_Blue_g1", destination: "g7" },
  { piece: "Rook_Red_g7", destination: "g1" },
  { piece: "Rook_Blue_g1", destination: "g7" },
  { piece: "Rook_Red_g1", destination: "g7" },
  { piece: "Rook_Blue_g7", destination: "g1" }
];


let currentMoveIndex = 0;

document.onkeydown = function(e) {
  if (e.keyCode === 39) {
    // Right arrow key
    if (currentMoveIndex < moves.length) {
      const move = moves[currentMoveIndex];
      updatePiecePosition(move.piece, move.destination);
      currentMoveIndex++;
    }
  } else if (e.keyCode === 37) {
    // Left arrow key
    if (currentMoveIndex > 0) {
      currentMoveIndex--;
      const move = moves[currentMoveIndex];
      // Undo the move by swapping the destination and original positions
      const originalPosition = move.destination;
      updatePiecePosition(move.piece, originalPosition);
    }
  }
};


function init() {
  const squareNames = createChessboard();
  const pawnSpheres = createPawns();
  const towerSquares = createTowers();
  const bishopPyramids = createBishops();
  const knightCylinders = createKnights();
  const chessPieces = createQueenAndKing();

  animate();

  console.log(THREE.REVISION);

  // Print the piece names
  printPieceNames(chessPieces);

  return {
    squareNames,
    pawnSpheres,
    towerSquares,
    bishopPyramids,
    knightCylinders,
    chessPieces,
    getSquareName // Include the getSquareName function in the returned object
  };

  function printPieceNames(chessPieces) {
    console.log('Chess Piece Names:');
    console.log('-------------------');

    // Print the names of the chess pieces
    for (const piece of chessPieces) {
      console.log(piece.name);
    }

    // Print the names of the pawn spheres
    for (const piece of pawnSpheres) {
      console.log(piece.name);
    }

    // Print the names of the tower squares
    for (const piece of towerSquares) {
      console.log(piece.name);
    }

    // Print the names of the bishop pyramids
    for (const piece of bishopPyramids) {
      console.log(piece.name);
    }

    // Print the names of the knight cylinders
    for (const piece of knightCylinders) {
      console.log(piece.name);
    }
  }
}

const chessGame = init();

// Example usage of the getSquareName function
const squareName = chessGame.getSquareName("Queen_Red");
console.log(squareName);




