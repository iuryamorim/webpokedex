/****************************************************************************************************************************************/
/*** Lista Pokemon								*/
/*** Autor					: Iury Amorim		*/
/*** Data de Criação		: 13/10/2015		*/
/*** Data de Modificação	: 19/10/2015		*/
/************************************************/

var oPokemon = {
	jqThis 					: null
	, jqName 				: null
	, jqAttack 				: null
	, jqDefense				: null
	, jqID					: null
	, jqDescriptions		: null
	, jqSprite				: null
	, jqUserName			: null
	, jqEmail				: null
	, jqBtnBuscar			: null
	, jqInputComment		: null
	, jqList				: null
	, jqSelect				: null
	, jqDatalist			: null
	, jqOptionSelected		: null
	, jqDlOptionSelected	: null
	, jqBlockCommentary		: null
	, jqAtributos			: {id: null, nome: null, descricao: null, ataque: null, defesa: null, imagem: null}
	

	, Carregar: function () {
		var _this = this;
		
		_this.jqThis 				= jQuery('#jqBodyPokemon');
		_this.jqName 				= _this.jqThis.find('#jqName');
		_this.jqAttack				= _this.jqThis.find('#jqAttack');
		_this.jqDefense				= _this.jqThis.find('#jqDefense');
		_this.jqID					= _this.jqThis.find('#jqID');
		_this.jqDescriptions		= _this.jqThis.find('#jqDescriptions');
		_this.jqSprite				= _this.jqThis.find('#jqSprite');
		_this.jqUserName			= _this.jqThis.find('#jqUserName');
		_this.jqEmail				= _this.jqThis.find('#jqEmail');
		_this.jqInputComment		= _this.jqThis.find('#jqInputComment');
		_this.jqList				= _this.jqThis.find('#jqList');
		_this.jqSelect				= _this.jqThis.find('#jqSelect');
		_this.jqDatalist			= _this.jqThis.find('#jqDatalist');
		_this.jqBlockCommentary		= _this.jqThis.find('#jqBlockCommentary');
		_this.jqBtnBuscar			= _this.jqThis.find('#jqBtnBuscar');
		
		Parse.initialize("hKmSBr5pY2rkF4E816p4pksdwkg0A0hpGl40f821", "zZ97rKZOcQfBOCDAAQLhAPwxftMkSLAjZrwQtRSV");

		if (_this.jqThis.length){
			_this.CarregarEventos();
			_this.AjaxPokedex();			
		}
	}
	
	, CarregarEventos: function () {
		var _this = this;

		_this.jqThis
			.on('click'		, '#jqBtnBuscar'		,	function() { _this.GetOption();									})
			.on('change'	, '#jqSelect'			,	function() { _this.ChangeOption(); 								})
			.on('submit'	,							function() { _this.GetCommentary(); 	return false;						})
		;

	}

	//Busca Nomes e ids
	, AjaxPokedex: function () {
		var _this = this;
		
		jQuery.ajax({
				url			: 'http://pokeapi.co/api/v1/pokedex/'
			,	contentType	: 'application/json'
		})
			.done(function (poJSON) {
				var array = poJSON.objects[0].pokemon;
	
				array.sort(function(a, b){
					var a1= parseInt(a.resource_uri.split('/').slice(3,4)),
						b1= parseInt(b.resource_uri.split('/').slice(3,4));
					if(a1== b1) return 0;
					return a1 > b1 ? 1 : -1;
				});
	
				jQuery(array).each(function(){
					var oPoke 		= this,
						idPokemon 	= parseInt(oPoke.resource_uri.split('/').slice(3,4));
					
					if (idPokemon < 1000){
						_this.jqSelect.append(
							'<option class="jqOption" value="'+oPoke.resource_uri.split('/').slice(3,4)+'">'+oPoke.name+'</option>' 
						);
						_this.jqDatalist.append(
							'<option value="'+oPoke.name+'" identificador="'+idPokemon+'"></option>'  
						);
					}
				}) 
	
			})
			.fail(function (jqHTR) {
				console.log(jqHTR);
			});
	}

	// Busca Informações especificas 
	, AjaxPokemon: function (nome, id) {
		var _this = this;	
		
		jQuery.ajax({
				url			: 'http://pokeapi.co/api/v1/pokemon/' + id + '/'
			,	contentType	: 'application/json'
			,	beforeSend	: function(){
				_this.jqName.empty();
				_this.jqAttack.empty();
				_this.jqDefense.empty();
				_this.jqID.empty();
			}
		})
			.done(function (poJSON) {
				var descriptions 	= poJSON.descriptions[0].resource_uri;
					sprites		 	= poJSON.sprites[0].resource_uri;

				_this.jqAtributos.id		= id;
				_this.jqAtributos.nome 		= nome;
				_this.jqAtributos.ataque	= poJSON.attack;
				_this.jqAtributos.defesa	= poJSON.defense;
	
				descriptions = descriptions.split('/').slice(4,5);
				_this.AjaxDescriptions(descriptions);
				
				sprites = sprites.split('/').slice(4,5);
				_this.AjaxSprite(nome, sprites);
				
				_this.ReturnCommentary(id);
			})
			.fail(function (jqHTR) {
				console.log(jqHTR);
			});
	}

	//Busca descrição
	, AjaxDescriptions: function (id) {
		var _this = this;
		jQuery.ajax({
				url			: 'http://pokeapi.co/api/v1/description/' + id + '/'
			,	contentType	: 'application/json'
			,	beforeSend	: function(){
				_this.jqDescriptions.empty();
			}
		})
			.done(function (poJSON) {				
				_this.jqAtributos.descricao	= poJSON.description;
			})
			.fail(function (jqHTR) {
				console.log(jqHTR);
			});
	}	

	//Busca Imagens
	, AjaxSprite: function (nome, id) {
		var _this = this;
		jQuery.ajax({
				url			: 'http://pokeapi.co/api/v1/sprite/' + id + '/'
			,	contentType	: 'application/json'
			,	beforeSend	: function(){
					_this.jqSprite.attr({ src : '', alt : '' });
				}
		})
			.done(function (poJSON) {				
				_this.jqAtributos.imagem	= poJSON.image;				
				_this.MountBody();
			})
			.fail(function (jqHTR) {
				console.log(jqHTR);
			});
	}

	//Busca Opção selecionada do datalist
	, ChangeOption: function () {
		var _this = this;
		
		_this.jqOptionSelected	= _this.jqThis.find("#jqSelect option:selected");
		
		var 	id 		= _this.jqOptionSelected.val()
			,	nome 	= _this.jqOptionSelected.text();
			
		_this.AjaxPokemon(nome, id);
	}

	//Busca Opção selecionada do select
	, GetOption: function () {
		var 	_this 		= this
			,	id	
			,	nome
			,	nomeLista 	= _this.jqList.val();
		
		if(nomeLista.length > 0){

			_this.jqDlOptionSelected	= _this.jqThis.find('#jqDatalist option');
		
			if(_this.jqDlOptionSelected)
			_this.jqDlOptionSelected.each(function(index) {
    			var nomeData = jQuery(this).val();
    			if(nomeData == nomeLista){
       				id 		= jQuery(this).attr("identificador");
       				nome 	= nomeData;
    			}
			});

			_this.AjaxPokemon(nome, id);
		}
	}

	//Busca comentario no html e salva no parse
	, GetCommentary: function () {
		var 	_this 	= this
			,	filtro 	= /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		
		var		commentary 	= _this.jqInputComment.val()
			,	userName 	= _this.jqUserName.val()
			,	email		= _this.jqEmail.val()
			,	id 			= _this.jqID.val();

		_this.jqInputComment.val("");
		
		if(email.length > 0 && filtro.test(email)){
			if(id.length > 0 && userName.length > 0){
				var conectaParse = Parse.Object.extend("Commentary");
				obj = new conectaParse();
				obj.set({"identificador" : parseInt(id), "commentary" : commentary, "username" : userName, "email" : email});
				obj.save(null, {
					success: function(valor) {
						_this.ReturnCommentary(id);
						console.log("Objeto criado com ID: " + obj.id);
					},
					error: function(valor, error) {
						console.log("Falha ao criar objeto" + error.message);
					}
				});
			}
		}else{
			alert("Digite seu nome e um email valido!");
		}
	}

	//Busca comentario no parse
	, ReturnCommentary: function (id) {
		var _this = this;
		var query = new Parse.Query("Commentary");

    	query.equalTo(
      		"identificador",parseInt(id)
    	);
    	query.find({
      		success: function(results) {
   				_this.MountBlockCommentary(results); 
			}
			, error: function(error) {
        		console.log('não foi');
      		}
    	});
	}

	//Monta Informações pokemon
	, MountBody: function () {
		var _this = this;
		
		_this.jqID.val(_this.jqAtributos.id);
		_this.jqName.text(_this.jqAtributos.nome);
		_this.jqAttack.text(_this.jqAtributos.ataque);
		_this.jqDefense.text(_this.jqAtributos.defesa);
		_this.jqDescriptions.text(_this.jqAtributos.descricao);
		_this.jqSprite.attr({ src : 'http://pokeapi.co' + _this.jqAtributos.imagem, alt : _this.jqAtributos.nome });
		
	}

	//Monta Comentarios
	, MountBlockCommentary: function (results) {
		var _this = this;
		
		_this.jqBlockCommentary.find("tr").remove();

      	jQuery(results).each(function(){
      		oResults = this;
      		_this.jqBlockCommentary.append(
      				'<tr>'
      			+	'<td colspan="4">'
      			+	'<div class="div-inblock-c">'
      			+	'<p>'+oResults._serverData.username+':</p>'
      			+	'<pre>'+oResults._serverData.commentary+'</pre>'
      			+	'</div>'
      			+	'</td>'
      			+	'</tr>'
      		);
      	})

	}
}
jQuery(window).load(function(){
	oPokemon.Carregar();
});

/****************************************************************************************************************************************/