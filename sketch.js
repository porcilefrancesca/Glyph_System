let glifSize = 16;   // Dimensione del glifo
let space = 28;      // Spazio tra i glifi
let padding = 32;    // Padding attorno alla griglia
let colors = [];     // Array per i colori (generati casualmente)

function setup() {
  createCanvas(windowWidth, windowHeight); //tela grande quanto la finestra del browser
  generatePalette();
  drawGrid();
}

// Funzione per rigenerare i colori (separata per pulizia)
function generatePalette() {
  colors = [];
  // Genera un array di colori casuali, ciclo for con 10 colori random (lavora sulle tre componenti del modello colore RGB)
  //minore è il numero di iterazioni, maggiore è la coerenza della palette cromatica della tela 
  for (let i = 0; i < 10 ; i++) {
    //ogni volta che il ciclo si ripete, un nuovo colore viene aggiunto all'array
    colors.push(color(random(255), random(255), random(255)));
  }
}

function drawGrid() {
  background("#ffffffff"); //bianco sporco
  noLoop();

  // Calcola la larghezza e l'altezza disponibili per la griglia, considerando il padding
  let MaxWidth = width - 2 * padding;   // Larghezza totale disponibile (viene sottratto due volte il padding, a destra e a sinistra)
  let MaxHeight = height - 2 * padding; // Altezza totale disponibile (viene sottratto due volte il padding, in alto e in basso)
  
  // Calcola il numero di colonne e righe in modo intero (floor)
  let numColumns = floor(MaxWidth / (glifSize + space)); 
  let numRows = floor(MaxHeight / (glifSize + space));   

  // CALCOLO PER CENTRARE LA GRIGLIA:
  // Calcoliamo l'ingombro totale effettivo della griglia e lo sottraiamo alla tela per trovare il nuovo offset
  let gridW = (numColumns - 1) * (glifSize + space);
  let gridH = (numRows - 1) * (glifSize + space);
  let offsetX = (width - gridW) / 2;
  let offsetY = (height - gridH) / 2;

  //cicli for per i glifi, x e y rappresentano una posizione nella griglia
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numColumns; x++) {
      // Calcola la posizione usando gli offset centrati
      let posX = offsetX + x * (glifSize + space); // Posizione orizzontale
      let posY = offsetY + y * (glifSize + space); // Posizione verticale
      drawGlifo(posX, posY, glifSize); //disegna il glifo nella posizione specifica, con la corretta dimensione stabilita
    }
  }
}

// Questa funzione assicura che il margine rimanga costante anche se ridimensioni il browser
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawGrid(); 
}

function drawGlifo(x, y, size) {
  push();
  translate(x, y);  //sposta l'origine delle coordinate al centro del glifo (corretto: x e y sono già i centri ora)
  let layers = int(random(4, 8));  //imposta un numero casuale di livelli concentrici, compreso tra 4 e 8
  let segments = int(random(4, 12));  //imposta numero di segmenti radiali, tra 6 e 12, dando al glifo simmetria radiale
  
  //ciclo for per disegnare ogni livello concentrico
  for (let i = 0; i < layers; i++) {
    let layerSize = map(i, 0, layers, size / 5, size); //calcola la dimensione del livello corrente, che descresce verso il centro del glifo
    let colorIndex = int(random(colors.length)); // Seleziona un colore casuale
    let selectedColor = colors[colorIndex]; // Colore scelto dall'array
    
    //imposta il colore di contorno del livello corrente (0-> valore per il rosso, 1-> valore per il verde, 2->valore per il blu)
    stroke(selectedColor.levels[0], selectedColor.levels[1], selectedColor.levels[2]); // Imposta il colore
    noFill(); //no rimepimento interno
    
    push();
    //applica una rotazione random al livello corrente
    rotate(random(TWO_PI));  //genera una rotazione random fino ad un massimo di 2π
    
    //ciclo for che disegna ciascun segmento radiale attorno al livello corrente del glifo
    for (let j = 0; j < segments; j++) {
      rotate(TWO_PI / segments);  // Distribuisce segmenti attorno al cerchio
      
      if (i % 2 === 0) {
        drawPetal(layerSize);  // Disegna petalo allungato
      } else if (i % 3 === 0) {
        drawSpikyShape(layerSize);  //Disegna forma a punta
      } else {
        drawCurvedShape(layerSize);  // Disegna forma curva
      }
    }
    pop();
  }
  pop();
}

//funzione per disegnare il petalo del fiore
function drawPetal(radius) {
  beginShape(); 
  curveVertex(0, -radius / 2); 
  curveVertex(radius / 4, -radius); 
  curveVertex(-radius / 4, -radius); 
  curveVertex(0, -radius / 2); 
  endShape(CLOSE); 
}

//funzione per disegnare la forma a punta
function drawSpikyShape(radius) {
  beginShape();
  vertex(0, -radius / 2);
  vertex(radius / 4, -radius);
  vertex(0, -radius * 1.2);
  vertex(-radius / 4, -radius);
  vertex(0, -radius / 2);
  endShape(CLOSE);
}

//funzione per disegnare la forma curva
function drawCurvedShape(radius) {
  beginShape();
  curveVertex(0, 0);
  curveVertex(radius / 3, -radius / 2);
  curveVertex(0, -radius);
  curveVertex(-radius / 3, -radius / 2);
  curveVertex(0, 0);
  endShape(CLOSE);
}
// Questa funzione viene eseguita automaticamente ogni volta che clicchi con il mouse
function mousePressed() {
  generatePalette(); // Crea una nuova combinazione di 10 colori casuali
  drawGrid();        // Ricalcola la posizione dei glifi e ridisegna tutto
}