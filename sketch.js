let glifSize = 16;   // Dimensione del glifo
let space = 28;      // Spazio tra i glifi
let padding = 32;    // Padding attorno alla griglia
let colors = [];     // Array per i colori

function setup() {
  createCanvas(windowWidth, windowHeight); // Tela grande quanto la finestra
  generatePalette();
  drawGrid();
}

function draw() {
  // Aggiorna solo ogni 40 frame per un effetto lento e deliberato
  // Si attiva solo se il mouse è all'interno della finestra
  if (frameCount % 40 === 0) { 
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      generatePalette();
      drawGrid();
    }
  }
}

// Funzione per rigenerare i colori
function generatePalette() {
  colors = [];
  for (let i = 0; i < 10 ; i++) {
    colors.push(color(random(255), random(255), random(255)));
  }
}

function drawGrid() {
  background("#ffffffff"); // Bianco sporco

  // Calcola la larghezza e l'altezza disponibili
  let MaxWidth = width - 2 * padding; 
  let MaxHeight = height - 2 * padding;
  
  // Calcola il numero di colonne e righe
  let numColumns = floor(MaxWidth / (glifSize + space)); 
  let numRows = floor(MaxHeight / (glifSize + space));   

  // Calcolo per centrare la griglia
  let gridW = (numColumns - 1) * (glifSize + space);
  let gridH = (numRows - 1) * (glifSize + space);
  let offsetX = (width - gridW) / 2;
  let offsetY = (height - gridH) / 2;

  // Cicli for per i glifi
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numColumns; x++) {
      let posX = offsetX + x * (glifSize + space);
      let posY = offsetY + y * (glifSize + space);
      drawGlifo(posX, posY, glifSize);
    }
  }
}

function drawGlifo(x, y, size) {
  push();
  translate(x, y);
  let layers = int(random(4, 8));
  let segments = int(random(4, 12));
  
  for (let i = 0; i < layers; i++) {
    let layerSize = map(i, 0, layers, size / 5, size);
    let selectedColor = random(colors); // Seleziona un colore dall'array
    
    stroke(selectedColor.levels[0], selectedColor.levels[1], selectedColor.levels[2]);
    noFill();
    
    push();
    rotate(random(TWO_PI));
    for (let j = 0; j < segments; j++) {
      rotate(TWO_PI / segments);
      if (i % 2 === 0) {
        drawPetal(layerSize);
      } else if (i % 3 === 0) {
        drawSpikyShape(layerSize);
      } else {
        drawCurvedShape(layerSize);
      }
    }
    pop();
  }
  pop();
}

function drawPetal(radius) {
  beginShape(); 
  curveVertex(0, -radius / 2); 
  curveVertex(radius / 4, -radius); 
  curveVertex(-radius / 4, -radius); 
  curveVertex(0, -radius / 2); 
  endShape(CLOSE); 
}

function drawSpikyShape(radius) {
  beginShape();
  vertex(0, -radius / 2);
  vertex(radius / 4, -radius);
  vertex(0, -radius * 1.2);
  vertex(-radius / 4, -radius);
  vertex(0, -radius / 2);
  endShape(CLOSE);
}

function drawCurvedShape(radius) {
  beginShape();
  curveVertex(0, 0);
  curveVertex(radius / 3, -radius / 2);
  curveVertex(0, -radius);
  curveVertex(-radius / 3, -radius / 2);
  curveVertex(0, 0);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawGrid(); 
}
