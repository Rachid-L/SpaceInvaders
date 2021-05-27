$(document)
	.ready (init);

function init()
{
	$('body')
	  .on (
	  		'keydown',
	  		manageKeyboardInput
	  	  );
	mainMenu();
}

function manageKeyboardInput(e)
{
	let maxLeft = $('.gameBoard').width() - 64;
	if (gamePlay > 0)
	{
		switch (e.keyCode)
		{
			case 32:
				cannonShoot();
				break;
			case 39:
			case 68:
				cannon.x = Math.min(cannon.x + 20, maxLeft);
				drawCannon();
				break;
			case 37:
			case 81:
				cannon.x = Math.max(cannon.x - 20, 0);
				drawCannon();
				break;
			default:
				break;
		}
	}
	else
	{
		if (e.keyCode == 80)
		{
			$('.mainMenu')
				.fadeOut (
							3000,
							() => 	{
										$('.mainMenu')
											.addClass('cache');
										startGame();
									}
						);
		}
	}
}
