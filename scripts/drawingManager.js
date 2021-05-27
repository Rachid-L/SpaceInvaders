let cannonCanvas;
let bulletsCanvas;
let enemiesCanvas;
let shieldsCanvas;
let cannonContext;
let bulletsContext;
let enemiesContext;
let shieldsContext;

function initCanvases()
{
	cannonCanvas = document.getElementById("cannonCanvas");
	bulletsCanvas = document.getElementById("bulletsCanvas");
	enemiesCanvas = document.getElementById("enemiesCanvas");
	shieldsCanvas = document.getElementById("shieldsCanvas");
	cannonContext = cannonCanvas.getContext("2d");
	bulletsContext = bulletsCanvas.getContext("2d");
	enemiesContext = enemiesCanvas.getContext("2d");
	shieldsContext = shieldsCanvas.getContext("2d");
	cannonCanvas.width = $('.gameBoard').width();
	cannonCanvas.height = $('.gameBoard').height();
	bulletsCanvas.width = $('.gameBoard').width();
	bulletsCanvas.height = $('.gameBoard').height();
	enemiesCanvas.width = $('.gameBoard').width();
	enemiesCanvas.height = $('.gameBoard').height();
	shieldsCanvas.width = $('.gameBoard').width();
	shieldsCanvas.height = $('.gameBoard').height();
}

function drawCannon()
{
	cannonContext.clearRect(0, 0, cannonCanvas.width, cannonCanvas.height);
	if (cannonVisible)
	{
		cannonContext.drawImage(imgCannon, cannon.x, cannon.y);
	}		
}

function renderGame()
{
	updateEnemies();
	updateBullets();
}

function drawShields()
{
	shields
		.forEach 	(
						e => drawShield(e)
					);
}

function drawShield(shield)
{
	shieldsContext.clearRect(shield.x, shieldTop, 160, 60);
	shieldsContext.fillStyle = '#32A200';
	shield
		.walls
		.forEach 	(
						(e, i) => 	{
										let line = parseInt(i / 40);
										let column = i % 40;
										if (e.value == 1)
										{
											shieldsContext.fillRect(shield.x + (column * 4), shieldTop + (line * 4), 4, 4);
										}
									}
					);
}

function drawEnemies()
{
	enemiesContext.clearRect(0, 0, enemiesCanvas.width, enemiesCanvas.height);
	enemies
		.forEach 	(
						e => drawEnemy(e)
					);
}

function drawEnemy(enemy)
{
	enemiesContext.drawImage(enemy.img, enemy.x, enemy.y);
	if (enemy.shoot)
	{
		enemyShoot(enemy);
	}
}

function drawBullets()
{
	bulletsContext.clearRect(0, 0, bulletsCanvas.width, bulletsCanvas.height);
	bullets
		.forEach 	(
						e => drawBullet(e)
					);
}

function drawBullet(bullet)
{
	bulletsContext.fillStyle = bullet.type == 1 ? "rgb(200, 200, 0)" : "rgb(200, 100, 0)";
	bulletsContext.fillRect(bullet.x, bullet.y, 4, 12);
}

function drawBulletExplosion(bullet)
{
	enemiesContext.drawImage(imgExplosion1, bullet.x - 16, 0);
	setTimeout(e => enemiesContext.clearRect(bullet.x - 16, 0, 32, 32), 100);
}

function destroyShieldPart(shield, collision)
{
	let sLine = collision.coords.line;
	let mLine = Math.max(collision.coords.line - 4, 0);
	let sColumn = Math.max(collision.coords.column - 3, 0);
	let mColumn = Math.min(collision.coords.column + 3, 39);
	for (let line = sLine; line >= mLine; line--)
	{
		for (let column = sColumn; column <= mColumn; column++)
		{
			let wallPart = shield.walls.find (e => e.coords.line == line && e.coords.column == column);
			if (wallPart)
			{
				wallPart.value = 0;
			}
		}
	}
}

function destroyEnemy(enemy)
{
	playExplodeSound();
	enemiesContext.clearRect(enemy.x, enemy.y, 48, 48);
 	enemiesContext.drawImage(imgExplosion3, enemy.x, enemy.y);
	setTimeout(e => enemiesContext.clearRect(enemy.x, enemy.y, 48, 48), 100);
}

function destroyShieldPartFromEnemy(shield, collision)
{
	let sLine = collision.coords.line;
	let mLine = Math.min(collision.coords.line + 4, 14);
	let sColumn = Math.max(collision.coords.column - 3, 0);
	let mColumn = Math.min(collision.coords.column + 3, 39);
	for (let line = sLine; line <= mLine; line++)
	{
		for (let column = sColumn; column <= mColumn; column++)
		{
			let wallPart = shield.walls.find (e => e.coords.line == line && e.coords.column == column);
			if (wallPart)
			{
				wallPart.value = 0;
			}
		}
	}
}

function destroyCannon()
{
	playCannonExplodeSound();
	cannonContext.clearRect(cannon.x, cannon.y, 64, 64);
	cannonContext.drawImage(imgExplosion3, cannon.x + 8, cannon.y + 8);
	setTimeout(e => cannonContext.clearRect(cannon.x, cannon.y, 64, 64), 250);
	cannonVisible = false;
}

function drawLives()
{
	let htmlString = String('<img class="playerLive" src="images/cannon.png">').repeat(numberOflives);
	$('#lives').html(htmlString);
}

function drawSaucer()
{
	enemiesContext.clearRect(saucer.x - 4, 2, 64, 48);
	enemiesContext.drawImage(document.getElementById("imgSaucer"), saucer.x, 2);
}

function destroySaucer()
{
	playExplodeSound();
	enemiesContext.clearRect(saucer.x, 2, 48, 48);
	enemiesContext.drawImage(imgExplosion3, saucer.x, 2);
	setTimeout(e => enemiesContext.clearRect(saucer.x, 2, 48, 48), 100);
	saucer = "";
}

function cleanScreen()
{
	let width = $('.gameBoard').width();
	let height = $('.gameBoard').height();
	cannonContext.clearRect(0, 0, width, height);
	shieldsContext.clearRect(0, 0, width, height);
	enemiesContext.clearRect(0, 0, width, height);
	bulletsContext.clearRect(0, 0, width, height);
	$('.gameOver').remove();
}

function destroyShieldLine(line)
{
	let linePos = shieldTop + ((line - 2) * 12);
	shieldsContext.clearRect(0, linePos, $('.gameBoard').width(), 24);
	shields
		.forEach 	(
						e => e
								.walls
								.filter (
											f => f.coords.line <= line * 3
										)
								.forEach 	(
												f => f.value = 0
											)
					);
} 

function destroyEnemyBullet(bullet)
{
	enemiesContext.drawImage(imgExplosion2, bullet.x - 16, bullet.y);
	setTimeout(e => enemiesContext.clearRect(bullet.x - 16, bullet.y, 32, 32), 100);
}  

