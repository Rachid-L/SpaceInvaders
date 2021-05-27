function createEnemies()
{
	enemies = [];
	let colors = ['#FF0000','#00FF00','#00FF00','#0000FF','#0000FF']
	for (let line = 0; line < 5; line++)
	{
		for (let column = 0; column < 11; column++)
		{
			enemies
				.push 	(
							{
								x: xOffset + (column * 60),
								y: yOffset + (line * 55) + (10 * gameLevel),
								color: colors[line],
								phase: 1,
								score: line == 0 ? 30 : line < 3 ? 20 : 10,
								line: (line == 0 ? 3 : line < 3 ? 2 : 1),
								realLine: line,
								realColumn: column,
								img: document.querySelector("#imgEnemy-" + (line == 0 ? 3 : line < 3 ? 2 : 1) + "-1")
							}
						);
		}
	}
}

function checkCannonBullet(bullet, bulletIndex)
{
	let enemyBullet = bullets.filter(e => e.type == 2 && e.x >= bullet.x - 2 && e.x <= bullet.x + 6 && bullet.y <= e.y + 12)[0];
	if (enemyBullet)
	{
		bullets.splice(bulletIndex, 1);
		bulletReady = true;
		bullets.splice(bullets.indexOf(enemyBullet), 1);
		drawEnemyBulletNeutralize(enemyBullet);
		return false;
	}
	let shield = shields.filter(f => bullet.x > f.x && bullet.x < f.x + 160)[0];
	if (shield)
	{
		let column = parseInt((bullet.x - shield.x) / 4);
		let collision = shield.walls.filter(f => f.coords.column == column && f.value == 1 && bullet.y < (f.coords.line * 4) + shieldTop).sort((a, b) => a.coords.line > b.coords.line ? -1 : 1)[0];
		if (collision)
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
			drawShield(shield);
			bulletReady = true;
			bullets.splice(bulletIndex, 1);
			return false;
		}
	}
	let target = enemies.filter(f => bullet.x >= f.x && bullet.x < f.x + 48 && bullet.y >= f.y && bullet.y <= f.y + 12).sort((a, b) => a.y > b.y ? -1 : 1)[0];
	if (target)
	{
		if (bullet.y < target.y + 48)
		{
			addToScore(target.score);
			bulletReady = true;
			bullets.splice(bulletIndex, 1);
			enemies.splice(enemies.indexOf(target), 1);
			destroyEnemy(target);
		}
	}
	else if (saucer != "" && bullet.y <= 50 && bullet.x >= saucer.x && bullet.x <= saucer.x + 48)
	{
		addToScore(saucer.score);
		bulletReady = true;
		bullets.splice(bulletIndex, 1);	
		destroySaucer();
		return false;
	}
	else if (bullet.y < 0)
	{
		bulletReady = true;
		bullets.splice(bulletIndex, 1);
		drawBulletExplosion(bullet);
	}
	return true;
}

function checkEnemyBulletHit(bullet, bulletIndex)
{
	let shield = shields.filter(f => bullet.x > f.x && bullet.x < f.x + 160)[0];
	if (shield)
	{
		let column = parseInt((bullet.x - shield.x) / 4);
		let collision = shield.walls.filter(f => f.coords.column == column && f.value == 1 && bullet.y > (f.coords.line * 4) + shieldTop).sort((a, b) => a.coords.line < b.coords.line ? -1 : 1)[0];
		if (collision)
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
			drawShields();
			bullets.splice(bulletIndex, 1);
			return false;
		}
	}
	if (bullet.y + 12 > cannon.y && bullet.x >= cannon.x && bullet.x <= cannon.x + 64)
	{
		bullets.splice(bullets.indexOf(bullet), 1);
		console.log(bullet);
		destroyCannon();
		drawLives(--numberOflives);
		if (numberOflives == 0)
		{
			gameOver();
			return false;
		}
		else
		{
			respawnCannon();
		}
	}
	if (bullet.y > cannon.y + 80)
	{
		bullets.splice(bullets.indexOf(bullet), 1);
	}
	return true;
}

function gameOver()
{
	clearInterval(gamePlay);
	gamePlay = 0;
	inGame = false;
	setTimeout	(
					() =>	{
								cleanScreen();
								mainMenu();
							},
					3000
				);
}

function respawnCannon()
{
	setTimeout 	(
					e => 	{
								cannon.x = 120;
								cannonVisible = true;
								drawCannon();
							},
					1500
				);
}

function renderEnemies()
{
	let speed = Math.max(4, enemies.length * 2);
	if (++enemyMovement.rythm % speed == 0)
	{
		playMoveSound();
		enemyMovement.moveStep = enemyMovement.moveStep > 4 ? 1 : enemyMovement.moveStep;
		let xLeftLimit = Math.max(...enemies.map(e => e.x)) + 60;
		let xRightLimit = Math.min(...enemies.map(e => e.x));
		let maxLeft = $('.gameBoard').width();
		if (enemyMovement.turn)
		{
			enemyMovement.turn = false;
		}
		else if (xLeftLimit > maxLeft)
		{
			enemyMovement.way = -1;
			enemiesGoDown();
			enemyMovement.turn = true;
		}
		else if (xRightLimit < 25)
		{
			enemyMovement.way = 1;
			enemiesGoDown();
			enemyMovement.turn = true;
		}
		canShoot = -1;
		if (Math.random() > .85)
		{
			canShoot = parseInt(Math.random() * enemies.length);
		}
		enemies
			.forEach 	(
							(e, i) => 	{
											e.x += enemyMovement.turn ? 0 : 25 * enemyMovement.way;
											e.phase = e.phase == 1 ? 2 : 1;
											e.img = document.querySelector("#imgEnemy-" + e.line + "-" + e.phase);
											e.shoot = i == canShoot;
											let reachLowerZone = parseInt((e.y + 48 - shieldTop) / 12);
											if (reachLowerZone >= 0)
											{
												destroyShieldLine(reachLowerZone);
											}
										}
						);
		enemiesContext.clearRect(0, 0, enemiesCanvas.width, enemiesCanvas.height);
		drawEnemies();
	}
	if (Math.random() > .999 && saucer == "")
	{
		let type = Math.random();
		saucer = 	{
						x: type < .5 ? 0 : $('.gameBoard').width(),
						speed: type < .5 ? 4 : -4,
						score: 50 + (parseInt(Math.random() * 3) * 100) + (Math.random() > .5 ? 0 : 50)
					};
		playSaucerSound();
	}
	if (saucer != "")
	{
		let maxLeft = $('.gameBoard').width();
		saucer.x += saucer.speed;
		if ((saucer.speed < 0 && saucer.x < 0) || (saucer.speed > 0 && saucer.x > maxLeft))
		{
			saucer = "";
		}
		drawSaucer();
	}
	if (enemies.length == 0)
	{
		gameLevel++;
		createEnemies();
		drawEnemies();
		createShields();
		drawShields();
	}
}

function enemiesGoDown()
{
	enemies
		.forEach 	(
						e => 	{
									e.y += 15;
								}
					);
}

function createShields()
{
	shields
		.forEach 	(
						e => 	{
									e.walls = String(1).repeat(600).split('').map((e, i) => {return {value: 1, index: i, coords: {line:parseInt(i /40) , column: i % 40}};});
									e.walls[0].value = 0;
									e.walls[1].value = 0;
									e.walls[2].value = 0;
									e.walls[3].value = 0;
									e.walls[40].value = 0;
									e.walls[41].value = 0;
									e.walls[42].value = 0;
									e.walls[80].value = 0;
									e.walls[81].value = 0;
									e.walls[120].value = 0;
									e.walls[36].value = 0;
									e.walls[37].value = 0;
									e.walls[38].value = 0;
									e.walls[39].value = 0;
									e.walls[77].value = 0;
									e.walls[78].value = 0;
									e.walls[79].value = 0;
									e.walls[118].value = 0;
									e.walls[119].value = 0;
									e.walls[159].value = 0;
									for (let t = 491; t < 509; t++)
									{
										e.walls[t].value = 0;
									}
									for (let t = 531; t < 549; t++)
									{
										e.walls[t].value = 0;
									}
									for (let t = 571; t < 589; t++)
									{
										e.walls[t].value = 0;
									}
								}
					);
}

function addToScore(points)
{
	playerScore += points;
	$('#playerScore').text(('0000000000' + playerScore).substr(-10));
	if (playerScore > highScore)
	{
		highScore = playerScore;
		localStorage.setItem('Combat-HighScore', highScore);
		showHighScore();
	}
}

function showHighScore()
{
	$('#highScore').text(('0000000000' + highScore).substr(-10));
}
