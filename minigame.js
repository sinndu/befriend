/** 
 * Class representing the canvas.
 */
class Canvas {
  static element;
  static context;
  static width;
  static height;

  /** 
   * Initializes the canvas.
   */
  constructor() {
    Canvas.element = document.getElementById("minigame");
    Canvas.context = Canvas.element.getContext("2d");
    Canvas.width = parseInt(Canvas.element.width);
    Canvas.height = parseInt(Canvas.element.height);

    Canvas.element.addEventListener("click", (e) => { // On click, change the clicked block's color to black.
      Canvas.game.changeBlockColor(e.offsetX, e.offsetY, "#000000");
    });
    
    Canvas.game = new Game(this, 10, 10);
  }

  /** 
   * Clears the canvas.
   */
  static clear() {
    Canvas.context.clearRect(0, 0, Canvas.width, Canvas.height);
  }
}

class Game {
  static timeInterval = 33;
  state = "game";
  
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.blockSize = Canvas.width/this.width;
    this.grid = [];

    for (let i = 0; i < this.width; i++) {
      const temp = [];

      for (let j = 0; j < this.height; j++) {
        temp.push(new Block(i, j, "#FFFFFF"));
      }

      this.grid.push(temp);
    }

    this.gameInterval = setInterval(() => {
      this.update();
    }, Game.timeInterval);
  }

  update() {
    Canvas.clear();
    
    for (let arr of this.grid) {
      for (let block of arr) {
        block.draw();
      }
    }
  }

  /** 
   * Changes the selected block's color.
   *
   * @param {number} mouseX - The x position of the mouse in relation to the canvas.
   * @param {number} mouseY - The y position of the mouse in relation to the canvas.
   * @param {string} color - The color to change the block to.
   */
  changeBlockColor(mouseX, mouseY, color) {
    const blockX = Math.floor(mouseX/this.blockSize);
    const blockY = Math.floor(mouseY/this.blockSize);

    this.grid[blockX][blockY].color = color;
  }
}

/** 
 * A class representing a block.
 */
class Block {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw() {
    Canvas.context.fillStyle = this.color;
    Canvas.context.fillRect(this.x*Canvas.game.blockSize, this.y*Canvas.game.blockSize/2, Canvas.game.blockSize, Canvas.game.blockSize/2);
  }
}