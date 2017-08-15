const languages = ['es','en'];
const choosen = 0;
const language = languages[choosen];
/**********************************************************************************************/
/*************************************  No me acuerso ahorita  *************************************/
/**********************************************************************************************/
var contador = 0;
var destinosDisponibles = menus.filter((menu) => menu.options);

var destinos = destinosDisponibles.map((destino) => {
	let toursDestino = [];
	destino.options.forEach(grupo => {
		grupo.options.forEach(tour => {
			toursDestino.push({
				name: tour.name ? (language=='es'?tour.name.es:(tour.name.en?tour.name.en:'')) : null,
				desc: tour.subname ? (language=='es'?tour.subname.es:tour.subname.en) : '',
				url: tour.url ? (language=='es'?tour.url.es:tour.url.en) : null,
				id: contador
			});
			contador = contador + 1;
		});
	});

	return {
		name: (language=='es'?destino.name.es:destino.name.en),
		tours: toursDestino
	}
});
console.log(destinos);

// Form data
var selectedTours = [];
var selectedTickets = [];

// Data for Bus ticket
var starts = [];
var ends = [];

var h = window.innerHeight;
var w = window.innerWidth;
var f = w < 768 ? 2 : 3;

var destinoWasSelected = false;
var destinoIndex = null;

function mostrarDestinos() {
	document.getElementById('search_box_tours').value = '';
	document.getElementById('busca_tu_tour').innerHTML = ['Busca tu Tour','Find your tour'][choosen];
	document.getElementById('boton_destinos').innerHTML = ['Destinos','Destinies'][choosen];
	document.getElementById('boton_quiero_personalizado').innerHTML = ['Quiero un tour personalizado','I wanna a customize tour'][choosen];
	document.getElementById('search_box_tours').placeholder = ['Filtrar...','Filter...'][choosen];
	document.getElementById('boton_cerrar_modal').innerHTML = ['Cerrar','Close'][choosen];

	var html = "";

	destinos.forEach((destino, index) => {
		html = html + `
    	<div class="col-xs-6 col-sm-4" id="destino-${index}">
        <a class="bootcards-summary-item" onclick="toogleTours(${index})">
          <i class="fa fa-3x fa-suitcase"></i>
          <h4>${destino.name} <span class="label label-info">${destino.tours.length}</span></h4>
        </a>
      </div>
		`;
	});

	html = html + `
		<div id="space-tours" class="col-xs-12" >
		</div>
	`;

	document.getElementById('destinosCards').innerHTML = html;
}

function toogleTours(index) {
	// Esconder si ya existia seleccionado
	if (destinoWasSelected) {
		document.getElementById(`space-tours`).innerHTML = "";
		document.getElementById(`destino-${destinoIndex}`).setAttribute('class', 'col-xs-6 col-sm-4');
	}
	// Esconder si selecciono lo mismo
	if (index == destinoIndex) {
		destinoWasSelected = false;
		destinoIndex = null;
	}
	// Mostrar tour si seleciono otro
	else {
		destinoWasSelected = true;
		destinoIndex = index;

		var content = `
			<div class="page-header">
				<h3>Tour disponibles de ${destinos[index].name}</h3>
			</div>
			<div class="col-md-12 togle-list-tours">
		`;
		destinos[index].tours.forEach((tour) => {
			content = content + `
				<div class="col-md-12 center-div">
					<div class="col-md-10">
						<span onclick="addTour(\'${tour.name}\',${tour.id})" style="cursor:pointer">${tour.name}</span> <br> 
						<small>${tour.desc}</small> <br> 
						<small><a href="${tour.url}" target="__blank">Explorar tour >> </a></small> 
					</div>
					<div class="col-md-2 v-align">
						<div class="box"><span onclick="addTour(\'${tour.name}\',${tour.id})" >Selecionar</span></div>
					</div>

				</div>
			`;
		});
		content = content + `
			</div>
		`;
		document.getElementById(`space-tours`).innerHTML = content;
		document.getElementById(`destino-${destinoIndex}`).setAttribute('class', 'col-xs-6 col-sm-4 selecionado');

		// focus
		// document.getElementById(`space-tours`).focus();
	}

}
/**********************************************************************************************/
/******************************************  TOURS  *******************************************/
/**********************************************************************************************/
function addTour(tourName, tourId) {
	selectedTours.push({
		name: tourName,
		id: tourId,
		date: null
	});
	let child = `
			<div class="col-md-12 div-list-tours col-xs-12 center-div" id="detalles-tour-${tourId}">
				<div class="col-md-7 list-tours-name"> ${tourName}
				</div>
				<div class="col-md-3 text-center list-tours-date col-xs-10 v-align">
					<div class="input-group">
						<span class="input-group-addon fa fa-calendar">							     
						</span>
						<input class="" id="tour-${tourId}-date" name="date" type="date" onchange="cambiarFechaTour(this)" />
					</div>
				</div>
				<div class="col-md-2 text-center col-xs-2 v-align">
					<span class="btn btn-default btn-xs fa fa-close" onclick="removeTour(${tourId})">
					</span>
				</div>
			</div>
		`;
	$('#tours-screen').append(child);

	$('#toursModal').modal('hide');
}

function removeTour(id) {
	selectedTours = selectedTours.filter(tour => tour.id != id);

	var parent = document.getElementById("tours-screen");
	var child = document.getElementById(`detalles-tour-${id}`);
	parent.removeChild(child);
}

function cambiarFechaTour(self) {
	selectedTours.forEach((tour) => {
		if (tour.id == self.id.split('-')[1]) {
			tour.date = self.value
		}
	});
}

/**********************************************************************************************/
/****************************************  BUS TICKET  ****************************************/
/**********************************************************************************************/
function getStarts() {
	$.ajax({
		url: 'http://incalake.com/reservar/buses.php',
		data: { 'tabla': 'origen' },
		type: 'POST',
		dataType: 'Json',
		success: function (res) {
			$('#origen').html(res.html);
		}
	});

}

function getEnds(origen) {
	if (origen == 0) {
		$('#destino').html('<option value="0">Ciudad de Destino</option>').attr('disabled', true);
	}
	else {
		$.ajax({
			url: 'http://incalake.com/reservar/buses.php',
			data: { 'tabla': 'destino', 'origen': origen },
			type: 'POST',
			dataType: 'Json',
			success: function (res) {
				$('#destino').html(res.html).attr('disabled', false);
			}
		});
	}
}

function buscar_bus() {
	console.log($('.select'));


	$.ajax({
		url: 'http://incalake.com/reservar/buses.php',
		data: { 'tabla': 'busqueda', 'origen': $('#origen').val(), 'destino': $('#destino').val() },
		type: 'POST',
		dataType: 'json',
		success: function (res) {
			console.log(res);
			$('#div_busqueda').html('').append(`
				<span class=""></span>
        <span>Resultados de <b>Origen:</b>
					<label class="label label-primary" style="font-size:14px;"> 
						${$('#origen option:selected').html()}
					</label>
          <b>Destino:</b>
					<label class="label label-primary" style="font-size:14px;"> 
						${$('#destino option:selected').html()}
					</label>
        </span>
        <br>
				<span>
          Seleccione un BUS de nuestro listado
				</span>
			`).append(res.html);

			$('.select').click(function () {
				let idTicket = $(this).data('id');
				let origen;
				let destino;
				let hora;
				let tipobus;
				let nombrebus;
				let costo;
				$(this).children('td').each(function (index) {
					switch (index) {
						case 0: ;
							break;
						case 1: origen = $(this).text();
							break;
						case 2: destino = $(this).text();
							break;
						case 3: hora = $(this).text();
							break;
						case 4: nombrebus = $(this).text();
							break;
						case 5: tipobus = $(this).text();
							break;
						case 6: costo = $(this).text();
							break;
					}
				});
				addTicket(idTicket, origen, destino, hora, tipobus, nombrebus, costo);
			});

		}
	});
};

function addTicket(idTicket, origen, destino, hora, tipobus, nombrebus, costo) {
	selectedTickets.push({
		id: idTicket,
		origen: origen,
		destino: destino,
		hora: hora,
		bus: tipobus,
		nombrebus: nombrebus,
		precio: costo,
		date: null
	});
	let child = `
			<div class="col-md-12 div-list-buses col-xs-12 center-div" id="detalles-ticket-${idTicket}">
				<div class="col-md-5 list-buses-name"> ${nombrebus} / ${tipobus} / ${costo}
				</div>
				<div class="col-md-3 list-tours-where text-center v-align col-xs-12"> ${origen} - ${destino}
				</div>
				<div class="col-md-3 text-center list-buses-date col-xs-10 v-align">
					<div class="input-group">
						<span class="input-group-addon fa fa-calendar">							     
						</span>
						<input class="" id="ticket-${idTicket}-date" name="date" type="date" onchange="cambiarFechaTicket(this)" />
					</div>
				</div>
				<div class="col-md-1 text-center col-xs-2 v-align">
					<span class="btn btn-default btn-xs fa fa-close" onclick="removeTicket(${idTicket})">
					</span>
				</div>
			</div>
		`;
	$('#tickets-screen').append(child);

	$('#ticketsModal').modal('hide');
}

function removeTicket(id) {
	selectedTickets = selectedTickets.filter(ticket => ticket.id != id);

	var parent = document.getElementById("tickets-screen");
	var child = document.getElementById(`detalles-ticket-${id}`);
	parent.removeChild(child);
}

function cambiarFechaTicket(self) {
	selectedTickets.forEach((ticket) => {
		if (ticket.id == self.id.split('-')[1]) {
			ticket.date = self.value
		}
	});
}

/**********************************************************************************************/
/*****************************************  RESERVAS  *****************************************/
/**********************************************************************************************/

function reservar() {
	// Limpiar cualquier alerta anterior
	document.getElementById('error-msg1').setAttribute('style','display: none');
	document.getElementById('error-msg2').setAttribute('style','display: none');
	document.getElementById('error-msg3').setAttribute('style','display: none');

	// Veficar servicios requeridos
	if(selectedTours.length==0 && selectedTickets.length==0){
		console.log(selectedTours);
		document.getElementById('error-msg1').setAttribute('style','display: block');
	}
	// Veficar fechas de tours y tickets
	let falatFechaTour = false;
	selectedTours.forEach((tour)=>{
		if(!tour.date){
			document.getElementById(`tour-${tour.id}-date`).focus();
			document.getElementById('error-msg2').setAttribute('style','display: block');
			falatFechaTour = true;
			return;
		}
	});
	if(falatFechaTour) return;
	let falatFechaTicket = false;
	selectedTickets.forEach((ticket)=>{
		if(!ticket.date){
			document.getElementById(`ticket-${ticket.id}-date`).focus();
			document.getElementById('error-msg2').setAttribute('style','display: block');
			falatFechaTicket = true;
			return;
		}
	});
	if(falatFechaTicket) return;

	// Veficar informacion personal
	if(document.getElementById('name').value.length < 1){
		document.getElementById('name').focus();
		document.getElementById('error-msg3').setAttribute('style','display: block');
		return;
	}
	if(document.getElementById('nationality').value.length < 1 ){
		document.getElementById('nationality').focus();
		document.getElementById('error-msg3').setAttribute('style','display: block');
		return;
	}
	if(document.getElementById('numberof').value.length < 1){
		document.getElementById('numberof').focus();
		document.getElementById('error-msg3').setAttribute('style','display: block');
		return;
	}
	if(document.getElementById('email').value.length < 1){
		document.getElementById('email').focus();
		document.getElementById('error-msg3').setAttribute('style','display: block');
		return;
	}

	var data = {
		nombres: document.getElementById('name').value,
		pais: document.getElementById('nationality').value,
		npax: document.getElementById('numberof').value,
		celular: document.getElementById('cellphone').value,
		hotel: document.getElementById('place').value,
		detalles: document.getElementById('extra').value,
		email: document.getElementById('email').value,
		tours: selectedTours,
		buses: selectedTickets,
	}

	console.log(data);

	document.getElementById('div-loader').setAttribute('style','display:block');

	$.ajax({
		type: 'POST',
		url: 'http://incalake.com/reservar/email/reservar-cms.php',
		dataType: 'json',
		data: data,
		success: function (res) {
			document.getElementById('div-loader').setAttribute('style','display:none');
			document.getElementById('formulario').innerHTML = res.msg;
			$(function(){$(".nueva_reserva").click(function(){document.location.reload();});})
		}
	});
}

/**********************************************************************************************/
/****************************************  Live Search  ***************************************/
/**********************************************************************************************/

function liveSearch(text){
	//console.log('{',text,'}');
	let text2 = '';
	text.trim().split(' ').filter(e=>e!='').forEach(t=>{
		text2 = text2 + t + ' ';
	})
	text2 = text2.trim();
	//console.log('{',text2,'}');
	text = text2;

	if(text.length<1) {
		mostrarDestinos();
		return;
	}
	else{
		text = text.toLowerCase();
		var content = `
			<div class="page-header">
				<h4>${['Resultados','Results'][choosen]}</h4>
			</div>
			<div class="col-md-12 togle-list-tours">
		`;

		let coincidences = destinos.map((destino)=>{
			return {
				name: destino.name,
				tours: destino.tours.filter((tour)=>tour.name.toLowerCase().indexOf(text) != -1)
			};
		})
		.filter((destino)=>destino.tours.length>0);
		coincidences
		.forEach((destino,index)=>{
			content = content + `
				<div class="col-md-12" style="background-color:grey">
				Tours de ${destino.name}
				</div>
			`;
			destino.tours.forEach((tour)=>{
				content = content + `
					<div class="col-md-12 center-div">
						<div class="col-md-10">
							<span onclick="addTour(\'${tour.name}\',${tour.id})" style="cursor:pointer">${tour.name}</span> <br> 
							<small>${tour.desc}</small> <br> 
							<small><a href="${tour.url}" target="__blank">Explorar tour >> </a></small> 
						</div>
						<div class="col-md-2 v-align">
							<div class="box"><span onclick="addTour(\'${tour.name}\',${tour.id})" >Selecionar</span></div>
						</div>

					</div>
				`;
			});
		});

		// Si no hay resultados
		if(coincidences.length==0){
			if(choosen==1){
				content = content + `
					We are sorry, We couldn't find your tour. If you want you can have a customize tour.<br>
					<a class="btn btn-link" onclick="addTourPersonalizado()">I want a customize tour</a>
				`;
			}else if(choosen==0){
				content = content + `
					Lo sentimos, no pudimos encontrar su Tour. Si desea puedes tener un tour personalizado.<br>
					<a class="btn btn-link" onclick="addTourPersonalizado()">Quiero un tour personalisado</a>
				`;
			}
		}
		

		content = content + `
			</div>
		`;

		document.getElementById('destinosCards').innerHTML = content;
	}
}

/**********************************************************************************************/
/****************************************  Live Search  ***************************************/
/**********************************************************************************************/
var cont_custom_tours = 10000;
function addTourPersonalizado(){
	cont_custom_tours = cont_custom_tours + 1;
	let content = `
		<div>
			<label for="detalles_p">Escribenos los detalles del tour que desea realizar</label>
			<textarea class="form-control" id="detalles_p" placeholder="aqui" rows="5"></textarea>
			<br>
			<button class="btn btn-positive" onclick="addTourCustomTour(${cont_custom_tours})">Agregar</button>
		</div>
	`;
	document.getElementById('destinosCards').innerHTML = content;
}
function addTourCustomTour(tourId){
	selectedTours.push({
		name: document.getElementById('detalles_p').value,
		id: tourId,
		date: null
	});
	let child = `
			<div class="col-md-12 div-list-tours col-xs-12 center-div " id="detalles-tour-${tourId}">
				<div class="col-md-7 list-tours-name col-xs-12"> ${document.getElementById('detalles_p').value}
				</div>
				<div class="col-md-3 text-center list-tours-date col-xs-10 v-align">
					<div class="input-group">
						<span class="input-group-addon fa fa-calendar">							     
						</span>
						<input class="" id="tour-${tourId}-date" name="date" type="date" onchange="cambiarFechaTour(this)" />
					</div>
				</div>
				<div class="col-md-2 text-center col-xs-2 v-align">
					<span class="btn btn-default btn-xs fa fa-close" onclick="removeTour(${tourId})">
					</span>
				</div>
			</div>
		`;
	$('#tours-screen').append(child);

	$('#toursModal').modal('hide');
}

