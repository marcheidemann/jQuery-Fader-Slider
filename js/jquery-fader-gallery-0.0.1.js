/**
	@author 	: Bjoern Schwabe, 
	@version	: 0.0.2
	@licence	: GPL V3
	@url		: www.bytenight.de
	@description: 
	This is a very simple gallery plugin that gives the user the ability to
	fade his images in an looplike method. 
	
	The basic idea is to shuffle the z-indexes of each link and than apply 
	the basic fadeIn effect of jquery to it. 
	
	The user can specify several stuff such as the fade time and if a menu needs to be enabled and where 
	the menu is supposed to be shown
**/

( function( $ ) 
{

	jQuery.fn.faderGallery	=	function( options ) 
	{
		//get the basic settings and extend them with user settings
		var settings	=	$.extend( {			
			'fadeEffect'	: 	1500,	//how many miliseconds does the fadeIn take?
			'showMenu'		: 	true,	//do you want to see the menu?
			'menuId'		: 	'faderGallery-menu',	//if yes what is the id of the menu?
			'menuItemName'  : 	'faderGallery-menu-item', //how about the li of the ul ? 
			'menuPosition'	: 	'right', //where do you want to see the menu?
			'debugger'		: 	false //do you need to debugg something ? 
		}, options);

		//not for public changes unless you know what you do ?! 
		var helpers		=	{
			'current'	: 	0,
			'last'		: 	$( this ).children( '.fader-gal-img' ).length - 1,
			'previous'  : 	$( this ).children( '.fader-gal-img' ).length - 1,
			'next'		: 	1,
			'items'		: 	$( this ).children( '.fader-gal-img' ),
			'innerTimer': 	0,
			'outerTimer':   0
		}

		//start the methods
		var methods	=	{
			
			init	: 	function( container ) {				
				//fade all the elements out
				helpers['items'].each(function( index ){
					$( helpers['items'].get( index ) ).fadeOut(0);
					if ( index == 0 )
					{						
						$( helpers['items'].get( index ) ).fadeIn(0);
					}
				});
			},
			
			/**
			Create the menu and append it to the container
			**/
			makeMenu	: 	function( container ) {
				//start the menu
				var menu = '<ul id="'+ settings['menuId'] +'">';

				//go through all the link and pictures in the container to build up a menu
				$( container ).children().each( function( index ) { 

					var specialClasses	=	'';
					
					if ( index == 0 )
					{
						specialClasses 	= 	' first';
					}
					else if ( index == $( container ).children( '.fader-gal-img' ).length - 1 )
					{
						specialClasses	=	' last';
					}

					menu += '<li class="'+ settings['menuItemName'] + specialClasses + '"><a href="#">&nbsp;</a></li>';
				
				});

				//finish the menu and append it to the container
				menu += '</ul>';

				$( container ).append( menu );
			},

			/**
				make the on status on the li of the menu 
			**/
			putClassesOnMenu	: 	function( current )
			{				
				//put the class on the link and remove it from the others
				$( "#" + settings['menuId'] ).children('li').each( function( index )
				{
					if ( index == $( current ).index() )
					{
						$( this ).addClass('on');
					}
					else
					{
						$( this ).removeClass('on');
					}							
				});
			},

			/**
				Set the menu position
			**/
			setMenuPosition		: 	function( container )
			{
				var menu 			=	$("#" + settings['menuId'] );
				
				var menuWidth		=	parseInt( menu.css('width') );

				var gallBoxWidth	=	parseInt( container.css('width') );
				var gallBoxHeight 	=	parseInt( container.css('height') );

				var halfMenuWidth		=	Math.round(  menuWidth / 2 );

				var halfGallBoxWidth	=	Math.round(  gallBoxWidth / 2 );
				var halfGallBoxHeight	=	Math.round(  gallBoxHeight / 2 );

				switch ( settings['menuPosition'] )
				{
					case 'topLeft':
						menu.css('left', halfGallBoxWidth - halfMenuWidth).css('top', 10);
					break;

					case 'topCenter':
						menu.css('left', 10).css('top', 10);
					break;

					case 'topRight':
						menu.css('right', 10).css('top', 10);
					break;

					case 'left':
						menu.css('left', 10).css('top', halfGallBoxHeight - halfMenuWidth );
						menu.children('li').css('float', 'none');
					break;

					case 'right':
						menu.css('right', 10).css('top', halfGallBoxHeight - halfMenuWidth );
						menu.children('li').css('float', 'none');
					break;

					case 'bottomLeft':
						menu.css('left', 10).css('bottom', 10);
					break;

					case 'bottomCenter':
						menu.css('left', halfGallBoxWidth - halfMenuWidth).css('bottom', 10);
					break;

					case 'bottomRight':
						menu.css('right', 10).css('bottom', 10);
					break;

					default:
						menu.css('left', halfGallBoxWidth - halfMenuWidth).css('bottom', 10);
				}
			},

			/**
			Apply the click event on the menu links
			**/
			menuFunctions	: 	function()
			{
				$( "#" + settings['menuId'] ).children().each( function() {					
					$( this ).click(function() 
					{ 
						methods.jumpToImage( $( this ).index() );
					});
				});				
			},

			/**
			Go to Picture when clicking on a link
			**/
			jumpToImage		: 	function( imageNo )
			{
				clearTimeout( helpers['innerTime'] );
				//get all the current ids
				var chainCurrent	=	helpers['current'];
				var	chainNext		=	helpers['next'];
				var chainPrevious	=	helpers['previous'];

				//set the new ones based on the new current picture
				helpers['current']	=	imageNo;
				helpers['next']		=	imageNo + 1;
				helpers['previous']	=	imageNo - 1;

				if ( helpers['previous'] < 0 )
				{
					helpers['previous']	= helpers['items'].length - 1;
				}

				if ( helpers['next'] > helpers['items'].length - 1 )
				{
					helpers['next']	=	0;
				}

				var current 	=	helpers['items'].get( helpers['current'] );
				$( current ).css( 'z-index', 3 ).fadeIn( settings['fadeEffect'] );
				
				//put the class on the link and remove it from the others
				methods.putClassesOnMenu( current );

				helpers['items'].each(function() {
					if ( $(this).index() != $( current ).index() )
					{
						$(this).css( 'z-index', 1).fadeOut(settings['fadeEffect'] * 2);											
					}
				});

				var next 		=	helpers['items'].get( helpers['next'] );
				$( next ).css( 'z-index', 2 );

				var previous 	=	helpers['items'].get( helpers['previous'] );
				$( previous ).css( 'z-index', 1).fadeOut( 0 );

			},

			/**
			loop through the items
			**/
			startLoop		: 	function()
			{
				//get the current
				var current	=	helpers['items'].get(helpers['current']);

				//what happens if the current one is the last item
				if ( helpers['current'] == helpers['items'].length - 1)
				{
					helpers['next'] 	= 0; //the next is the start
				}
				

				//set the previous one always one down to the current one
				helpers['previous']	=	helpers['current'] - 1;

				if ( helpers['current'] == 0 )
				{
					helpers['previous']	=	helpers['items'].length - 1;
				}


				//set next always to the after current unless it is the end then it is 0
				helpers['next']	=	helpers['current'] + 1;
				if ( helpers['next']	==	helpers['items'].length )
				{
					helpers['next']	=	0;
				}


				//put the currnet on top and than fade it in
				$( current ).css('z-index', 3).fadeIn( settings['fadeEffect'] );
				
				//put the class on the link and remove it from the others
				methods.putClassesOnMenu( current );

				
				//get the next one an put the z index up to 2
				var next	=	helpers['items'].get( helpers['next'] );
				$( next ).css('z-index', 2);

				//take the previous one and put the z-index to 1 and fade it out
				var previous	=	helpers['items'].get( helpers['previous'] );
				$( previous ).css('z-index', 1).fadeOut( settings['fadeEffect'] * 2);


				//increase the current
				helpers['current']	=	helpers['current'] + 1;

				//or start at the beginning
				if ( helpers['current'] == helpers['items'].length)
				{
					helpers['current']	=	0;
				}

				helpers['innerTime']	=	setTimeout( function(){ methods.startLoop()}, 5000 );


				//only if you want to debugg
				if ( settings['debugger'] == true )
				{
					methods.pluginDebugger();
				}
			},

			//show some information such as the current, previous and the next item in the list
			pluginDebugger	: function()
			{				
				console.log("-------------");
				console.log( "Current:" + helpers['current']);
				console.log( "Previous:" + helpers['previous']);
				console.log( "Next:" + helpers['next']);
			}

		}

		//the plugin and make it chainable
		return this.each( function(  ) {
			//start of plugin

			//set everything up with my internal init method
			methods.init( this );

			//if you want to have a menu create it
			if ( settings['showMenu'] == true )
			{
				methods.makeMenu( this );
				methods.menuFunctions();
					
				//check if developer wants to put the menu somewhere with our code : ) 
				if ( settings['menuPosition'] != '' )
				{
					methods.setMenuPosition( $(this) );
				}
			}

			methods.startLoop();
		});
	}

}) ( jQuery );