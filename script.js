const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let particleArray;

// posição do mouse ///////////////////////////////
let mouse = {
	x: null,
	y: null,
  radius: ((canvas.height/80) * (canvas.width/80))
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
});

// criar partícula
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.speedX = this.directionX;
        this.speedY = this.directionY;
    }
    // criar método para desenhar partículas individuais
    draw() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI * 2, false);

        ctx.fillStyle = 'black';
	    ctx.fill();
    }

    // verifique a posição da partícula, verifique a posição do mouse, mova a partícula, desenhe a partícula
    update() {
        // verifique se a partícula ainda está dentro da tela
        if (this.x > canvas.width || this.x < 0){
			this.directionX = -this.directionX;
            this.speedX = this.directionX;
	    } if (this.y + this.size > canvas.height || this.y - this.size < 0){
		    this.directionY = -this.directionY;
            this.speedY = this.directionY;
	    }
        // verifique a posição do mouse/posição da partícula - detecção de colisão
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size*10){
               this.x+=10;
            }
            if (mouse.x > this.x && this.x > this.size*10){
                this.x-=10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size*10){
                this.y+=10;
            }
            if (mouse.y > this.y && this.y > this.size*10){
                this.y-=10;
            }
        }
        // mover partícula
        this.x += this.directionX;
        this.y += this.directionY;
        // call draw method
        this.draw();
    }
}

// verifique se as partículas estão próximas o suficiente para desenhar uma linha entre elas
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++){
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x))
            +   ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));
            if  (distance < (canvas.width/7) * (canvas.height/7))
            {   
                opacityValue = 1 -(distance/20000);
                ctx.strokeStyle='rgba(0,0,0,' + opacityValue +')';
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }    
        }
    }
}

//criar matriz de partículas
function init(){
    particleArray = [];
    let numberOfParticles = (canvas.height*canvas.width)/8000;
    for (let i=0; i<numberOfParticles *3; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#f57070';

        particleArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// criar loop de animação
function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0,0,innerWidth,innerHeight);
	
	for (let i = 0; i < particleArray.length; i++){
		particleArray[i].update();
	}
    connect();
}
init();
animate();


// CONFIGURAÇÃO DE REDIMENSIONAMENTO - esvazie e recarregue a matriz de partículas toda vez que a janela mudar de tamanho + alterar o tamanho da tela
window.addEventListener('resize',
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.width/80));
		init();
	}
)
// 2) DEFINIR A POSIÇÃO DO MOUSE COMO INDEFINIDA quando sair da tela//////
window.addEventListener('mouseout',
	function(){
		mouse.x = undefined;
	    mouse.y = undefined;
        console.log('mouseout');
	}
)