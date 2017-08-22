var destinos = [];
var lang_domain = document.documentElement.lang.toLowerCase();
// Array de Tours y Bus tickets seleccionados
var selectedTours = [];
var selectedTickets = [];
// Array de Origen y destino de bus tickets
var starts = [];
var ends = [];
var h = window.innerHeight;
var w = window.innerWidth;
var f = w < 768 ? 2 : 3;
var destinoWasSelected = false;
var destinoIndex = null;
$.ajax({
    url: '//incalake.com/reservar/paquetes.php',
    data: 'idioma=' + lang_domain,
    type: 'POST',
    dataType: 'Json',
    success: function (response) {
        destinos = response.filter(function (destino) { return destino.paquetes.length; }).map(function (destino) {
            return {
                name: destino.nombre,
                tours: destino.paquetes.map(function (tour) {
                    return {
                        name: tour.nombre ? tour.nombre : '',
                        desc: '',
                        url: tour.url ? tour.url : '',
                        id: tour.id
                    };
                }),
                img: destino.imagen
            };
        });
        console.log(destinos);
    }
});
/**********************************************************************************************/
/******************************************  TOURS  *******************************************/
/**********************************************************************************************/
function mostrarDestinos() {
    $('#search_box_tours').val('');
    var html = "";
    destinos.forEach(function (destino, index) {
        if (destino.name) {
            html = html + ("\n    \t<div class=\"col-xs-6 col-sm-4 div-category-search\" id=\"destino-" + index + "\">\n\t    \t<div class=\"img-thumbnail list-category-search\">\n\t\t        <a class=\"bootcards-summary-item img-thumbnail\" onclick=\"toogleTours(" + index + ")\">\n\t\t        \t<img class=\"img-category-search\" src=\"" + destino.img + "\" alt=\"\" >\n\t\t          <i class=\"fa fa-3x fa-suitcase\"></i>\n\t\t          <h4><span class=\"title-category-search\">" + destino.name + "</span><span class=\"count-category-search label label-primary\">" + destino.tours.length + "</span></h4>\n\t\t        </a>\n\t        </div>\n      \t</div>\n\t\t");
        }
    });
    html = html + "\n\t\t<div id=\"space-tours\" class=\"col-md-12 col-xs-12\" >\n\t\t</div>\n\t";
    location.hash = '';
    document.getElementById('destinosCards').innerHTML = html;
}
function toogleTours(index) {
    // Esconder si ya existia seleccionado
    if (destinoWasSelected) {
        document.getElementById("space-tours").innerHTML = "";
        $("#destino-" + destinoIndex).removeClass('selecionado');
        location.hash = "";
        // console.log($(`#destino-${destinoIndex}`));
        // document.getElementById(`destino-${destinoIndex}`).setAttribute('class', 'col-xs-6 col-sm-4');
    }
    // Esconder si selecciono lo mismo
    if (index == destinoIndex) {
        destinoWasSelected = false;
        destinoIndex = null;
    }
    else {
        destinoWasSelected = true;
        destinoIndex = index;
        var content = "\n\t\t\t<div class=\"page-header\">\n\t\t\t\t<div class=\"container-fluid\">\n\t\t\t\t\t<span class=\"col-md-8\">" + (lang_domain == 'es' ? 'Servicios disponibles de' : 'Services available from') + " <span class=\"title-result-category-tours\">" + destinos[index].name + "</span></span>\n\t\t\t\t\t<span class=\"col-md-4 input-group\" style=\"float: right;\" onclick=\"focucear();\">\n                          <input type=\"text\" class=\"form-control\"  placeholder=\"" + (lang_domain == 'es' ? 'Buscar...' : 'Search...') + "\" style=\"float:left;\" id=\"focus_search_box_tours\">\n                          <span class=\"input-group-addon\"><span class=\"fa fa-search\"></span></span>\n                        </span>\n                </div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-12 togle-list-tours\">\n\t\t";
        destinos[index].tours.forEach(function (tour) {
            if (tour.name) {
                if (tour.id == 'ofertas') {
                    content = content + ("\n\t\t\t\t\t<div class=\"col-md-12 center-div col-xs-12\">\n\t\t\t\t\t<div class=\"col-md-10 col-xs-10\">\n\t\t\t\t\t\t<span onclick=\"addTour('" + tour.name + "'," + tour.id + ")\" style=\"cursor:pointer\">" + tour.name + "</span> <br> \n\t\t\t\t\t\t<small>" + tour.desc + "</small> <br> \n\t\t\t\t\t\t<small><a href=\"" + tour.url + "\" target=\"__blank\">" + (lang_domain == 'es' ? 'Explorar tour' : 'Explore tour') + " >> </a></small> \n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-md-2 col-xs-2 v-align\">\n\t\t\t\t\t\t<div class=\"box\"><a style=\"color: #f5f5f5;\" target=\"_blank\" href=\"" + tour.url + "\"><span  >" + (lang_domain == 'es' ? 'Ver' : 'View') + "</span></a></div>\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t\t");
                }
                else {
                    content = content + ("\n\t\t\t\t\t<div class=\"col-md-12 center-div col-xs-12\">\n\t\t\t\t\t<div class=\"col-md-10 col-xs-10\">\n\t\t\t\t\t\t<span onclick=\"addTour('" + tour.name + "'," + tour.id + ")\" style=\"cursor:pointer\">" + tour.name + "</span> <br> \n\t\t\t\t\t\t<small>" + tour.desc + "</small> <br> \n\t\t\t\t\t\t<small><a href=\"" + tour.url + "\" target=\"__blank\">" + (lang_domain == 'es' ? 'Explorar tour' : 'Explore tour') + " >> </a></small> \n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-md-2 col-xs-2 v-align\">\n\t\t\t\t\t\t<div class=\"box\"><span onclick=\"addTour('" + tour.name + "'," + tour.id + ")\" >" + (lang_domain == 'es' ? 'Selecionar' : 'Add') + "</span></div>\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t\t");
                }
            }
        });
        content = content + "\n\t\t\t</div>\n\t\t";
        document.getElementById("space-tours").innerHTML = content;
        $("#destino-" + destinoIndex).addClass('selecionado');
        // document.getElementById(`destino-${destinoIndex}`).setAttribute('class', 'col-xs-6 col-sm-4 selecionado');
        // focus
        // location.hash = "space-tours";
        // $('#space-tours').animate({ scrollTop: 0 }, 'slow');
        // $(".div-category-search").click(function(){
        // console.log('asdasd');
        console.log($('#toursModal').scrollTop());
        console.log($('#space-tours').offset().top);
        console.log($('#toursModal').scrollTop() + $('#space-tours').offset().top);
        $('#toursModal').animate({
            scrollTop: $('#space-tours').offset().top + $('#toursModal').scrollTop()
        }, 1000);
        // });
    }
}
function focucear() {
    document.getElementById("search_box_tours").focus();
}
function focucearCalendario(id) {
    document.getElementById(id).focus();
}
function addTour(tourName, tourId) {
    selectedTours.push({
        name: tourName,
        id: tourId,
        date: null
    });
    var child = "\n\t\t\t<div class=\"col-md-12 div-list-tours col-sm-12 col-xs-12 center-div\" id=\"detalles-tour-" + tourId + "\">\n\t\t\t\t<div class=\"col-md-8 list-tours-name col-sm-7 col-xs-12\"> " + tourName + "\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-3 text-center list-tours-date col-xs-11 v-align col-sm-4\">\n\t\t\t\t\t<div class=\"input-group con_calendario\">\n                        <span class=\"input-group-addon\" onclick=\"focucearCalendario('tour-" + tourId + "-date')\"><span class=\"fa fa-calendar\"></span></span>\n                        <input class=\"form-control\" id=\"tour-" + tourId + "-date\" readonly=\"true\" name=\"date\" type=\"text\" onchange=\"cambiarFechaTour(this)\"\">\n                    </div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-1 text-center col-xs-1 v-align col-sm-1\">\n\t\t\t\t\t<span class=\"btn btn-default btn-sm fa fa-close\" onclick=\"removeTour(" + tourId + ")\">\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t";
    $('#tours-screen').append(child);
    $('.con_calendario input').datepicker({
        'format': 'd-MM-yyyy',
        'autoclose': true,
        language: lang_domain,
        startDate: 'now'
    });
    $('#toursModal').modal('hide');
    location.hash = '';
    setTimeout(function () {
        $("#tour-" + tourId + "-date").focus();
    }, 50);
}
function removeTour(id) {
    selectedTours = selectedTours.filter(function (tour) { return tour.id != id; });
    var parent = document.getElementById("tours-screen");
    var child = document.getElementById("detalles-tour-" + id);
    parent.removeChild(child);
}
function cambiarFechaTour(self) {
    selectedTours.forEach(function (tour) {
        if (tour.id == self.id.split('-')[1]) {
            tour.date = self.value;
        }
    });
}
/**********************************************************************************************/
/****************************************  BUS TICKET  ****************************************/
/**********************************************************************************************/
function mostrarBusTickets() {
    getStarts();
    document.getElementById('div_busqueda').innerHTML = '';
    document.getElementById('destino').innerHTML = '';
}
function getStarts() {
    $.ajax({
        url: 'http://incalake.com/reservar/buses.php',
        data: {
            'tabla': 'origen'
        },
        type: 'POST',
        dataType: 'Json',
        success: function (res) {
            $('#origen').html(res.html);
        }
    });
}
function getEnds(origen) {
    if (origen == 0) {
        $('#destino').html("<option value=\"0\">" + (lang_domain == 'es' ? 'Ciudad de Destino' : 'Destination city') + "</option>").attr('disabled', true);
    }
    else {
        $.ajax({
            url: 'http://incalake.com/reservar/buses.php',
            data: {
                'tabla': 'destino',
                'origen': origen
            },
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
        data: {
            'tabla': 'busqueda',
            'origen': $('#origen').val(),
            'destino': $('#destino').val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (res) {
            console.log(res);
            $('#div_busqueda')
                .html('')
                .append("\n\t\t\t\t\n\t\t\t\t<h3>" + (lang_domain == 'es' ? 'Buses disponibles' : 'Available buses from') + "  <b>" + $('#origen option:selected').html() + "</b> To <b>" + $('#destino option:selected').html() + "</b> </h3>\n\t\t\t").append(res.html);
            $('.select').click(function () {
                var idTicket = $(this).data('id');
                var origen;
                var destino;
                var hora;
                var tipobus;
                var nombrebus;
                var costo;
                $(this).children('td').each(function (index) {
                    switch (index) {
                        case 0:
                            ;
                            break;
                        case 1:
                            origen = $(this).text();
                            break;
                        case 2:
                            destino = $(this).text();
                            break;
                        case 3:
                            hora = $(this).text();
                            break;
                        case 4:
                            nombrebus = $(this).text();
                            break;
                        case 5:
                            tipobus = $(this).text();
                            break;
                        case 6:
                            costo = $(this).text();
                            break;
                    }
                });
                addTicket(idTicket, origen, destino, hora, tipobus, nombrebus, costo);
            });
        }
    });
}
;
function addTicket(idTicket, origen, destino, hora, tipobus, nombrebus, costo) {
    console.log(idTicket + 'id');
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
    var child = "\n\t\t\t<div class=\"col-md-12 div-list-buses col-sm-12 col-xs-12 center-div\" id=\"detalles-ticket-" + idTicket + "\">\n\t\t\t\t<div class=\"col-md-5 list-buses-name col-xs-12 col-sm-5\"> " + nombrebus + " / " + tipobus + " / " + costo + "\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-3 list-tours-where text-center v-align col-xs-12 col-sm-3 \"> " + origen + " - " + destino + "\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-3 text-center list-buses-date col-xs-11 col-sm-3 v-align\">\n\t\t\t\t\t<div class=\"input-group con_calendario\">\n                        <span class=\"input-group-addon\" onclick=\"focucearCalendario('ticket-" + idTicket + "-date')\"><span class=\"fa fa-calendar\"></span></span>\n                        <input class=\"form-control\" id=\"ticket-" + idTicket + "-date\" readonly=\"true\" name=\"date\" type=\"text\" onchange=\"cambiarFechaTicket(this)\"/>\n                    </div>\t\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-1 text-center col-xs-1 col-sm-1 v-align\">\n\t\t\t\t\t<span class=\"btn btn-default btn-sm fa fa-close\" onclick=\"removeTicket(" + idTicket + ")\">\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t";
    $('#tickets-screen').append(child);
    $('.con_calendario input').datepicker({
        'format': 'd-MM-yyyy',
        'autoclose': true,
        language: lang_domain,
        startDate: 'now'
    });
    $('#ticketsModal').modal('hide');
    setTimeout(function () {
        $("#ticket-" + idTicket + "-date").focus();
    }, 50);
}
function removeTicket(id) {
    selectedTickets = selectedTickets.filter(function (ticket) { return ticket.id != id; });
    var parent = document.getElementById("tickets-screen");
    var child = document.getElementById("detalles-ticket-" + id);
    parent.removeChild(child);
}
function cambiarFechaTicket(self) {
    console.log(self);
    selectedTickets.forEach(function (ticket) {
        if (ticket.id == self.id.split('-')[1]) {
            ticket.date = self.value;
        }
    });
}
/**********************************************************************************************/
/****************************************  Live Search  ***************************************/
/**********************************************************************************************/
function liveSearch(text) {
    //console.log('{',text,'}');
    var text2 = '';
    text.trim().split(' ').filter(function (e) { return e != ''; }).forEach(function (t) {
        text2 = text2 + t + ' ';
    });
    text2 = text2.trim();
    //console.log('{',text2,'}');
    text = text2;
    if (text.length < 1) {
        mostrarDestinos();
        location.hash = "";
        return;
    }
    else {
        text = text.toLowerCase();
        var content = "\n\t\t\t<div class=\"\">\n\t\t\t\t<h4>" + (lang_domain == 'es' ? 'Resultados' : 'Results') + "</h4>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-12 togle-list-tours\">\n\t\t";
        var coincidences = destinos.map(function (destino) {
            console.log(text2);
            return {
                name: destino.name,
                tours: destino.tours.filter(function (tour) { return tour.name.toLowerCase().indexOf(text) != -1; })
                // tours: destino.tours.filter((tour) => tour.name.toLowerCase().indexOf(text) != -1)
                // tours: destino.tours.filter(('puno'))
            };
        })
            .filter(function (destino) { return destino.tours.length > 0; });
        coincidences
            .forEach(function (destino, index) {
            content = content + ("\n\t\t\t\t<div class=\"col-md-12 div-title-search \">\n\t\t\t\t " + destino.name + "\n\t\t\t\t</div>\n\t\t\t");
            destino.tours.forEach(function (tour) {
                content = content + ("\n\t\t\t\t\t<div class=\"col-md-12 center-div\">\n\t\t\t\t\t\t<div class=\"col-md-10\">\n\t\t\t\t\t\t\t<span onclick=\"addTour('" + tour.name + "'," + tour.id + ")\" style=\"cursor:pointer\">" + tour.name + "</span> <br> \n\t\t\t\t\t\t\t<small>" + tour.desc + "</small> <br> \n\t\t\t\t\t\t\t<small><a href=\"" + tour.url + "\" target=\"__blank\">" + (lang_domain == 'es' ? 'Explorar tour' : 'Explore tour') + "  >> </a></small> \n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-md-2 v-align\">\n\t\t\t\t\t\t\t<div class=\"box\"><span onclick=\"addTour('" + tour.name + "'," + tour.id + ")\" >" + (lang_domain == 'es' ? 'Seleccionar' : 'Select') + "</span></div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\t\t\t\t");
            });
        });
        // Si no hay resultados
        if (coincidences.length == 0) {
            content = content + ("\n\t\t\t\t" + (lang_domain == 'es' ? 'Lo sentimos, no pudimos encontrar tu Tour. Si lo desea, puede tener un tour personalizado' : 'Sorry, we could not find your Tour. If you want you can have a personalized tour') + ".<br>\n\t\t\t\t<a class=\"btn btn-link\" onclick=\"addTourPersonalizado()\">" + (lang_domain == 'es' ? 'Quiero un tour personalizado' : 'I want a personalized tour') + "</a>\n\t\t\t");
        }
        content = content + "\n\t\t\t</div>\n\t\t";
        document.getElementById('destinosCards').innerHTML = content;
    }
}
/**********************************************************************************************/
/************************************  Tour Personalizado  ************************************/
/**********************************************************************************************/
var cont_custom_tours = 10000;
function addTourPersonalizado() {
    cont_custom_tours = cont_custom_tours + 1;
    var content = "\n\t\t<div>\n\t\t\t<label for=\"detalles_p\">" + (lang_domain == 'es' ? 'Escríbenos los detalles del tour que quiere hacer' : 'Write us the details of the tour that you want to do') + "</label>\n\t\t\t<textarea class=\"form-control\" id=\"detalles_p\" placeholder=\"" + (lang_domain == 'es' ? 'Escríbenos los detalles' : 'Write us the details ') + "\" rows=\"5\"></textarea>\n\t\t\t<br>\n\t\t\t<button class=\"btn btn-primary\" onclick=\"addTourCustomTour(" + cont_custom_tours + ")\">" + (lang_domain == 'es' ? 'Agregar' : 'Add') + "</button>\n\t\t</div>\n\t";
    document.getElementById('destinosCards').innerHTML = content;
    document.getElementById('detalles_p').focus();
    location.hash = "";
}
function addTourCustomTour(tourId) {
    selectedTours.push({
        name: $('#detalles_p').val(),
        id: tourId,
        date: null
    });
    var child = "\n\t\t\t<div class=\"col-md-12 div-list-tours col-sm-12 col-xs-12 center-div \" id=\"detalles-tour-" + tourId + "\">\n\t\t\t\t<div class=\"col-md-8 list-tours-name col-xs-12 col-sm-8\"> " + $('#detalles_p').val() + "\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-3 text-center list-tours-date col-xs-11 v-align col-sm-4\">\n\t\t\t\t\t<div class=\"input-group con_calendario\">\n            <span class=\"input-group-addon\" onclick=\"focucearCalendario('tour-" + tourId + "-date')\"><span class=\"fa fa-calendar\"></span></span>\n            <input class=\"form-control\" id=\"tour-" + tourId + "-date\" readonly=\"true\" name=\"date\" type=\"text\" onchange=\"cambiarFechaTour(this)\">\n          </div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-1 text-center col-xs-1 v-align col-sm-1\">\n\t\t\t\t\t<span class=\"btn btn-default btn-sm fa fa-close\" onclick=\"removeTour(" + tourId + ")\">\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t";
    $('#tours-screen').append(child);
    $('.con_calendario input').datepicker({
        'format': 'd-MM-yyyy',
        'autoclose': true,
        language: lang_domain,
        startDate: 'now'
    });
    $('#toursModal').modal('hide');
    location.hash = '';
    setTimeout(function () {
        $("#tour-" + tourId + "-date").focus();
    }, 50);
}
/**********************************************************************************************/
/***************************  Debe ejecutarse al cargar la pagina  ****************************/
/**********************************************************************************************/
function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('.wizard .nav-tabs > li a[title]').tooltip();
    //Wizard
    $('.wizard a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var $target = $(e.target);
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });
    $(".wizard .prev-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);
    });
    getStarts();
    // Leer la url y ver si esta presente un id de tour
    if (getParameterByName('t')) {
        // hacer el ajax y pedir el nombre del tour
        $.ajax({
            type: 'POST',
            url: 'http://incalake.com/control/paqueteturistico/pt',
            dataType: 'json',
            data: 'id=' + getParameterByName('t') + '&idioma=' + lang_domain,
            success: function (res) {
                if (res.length > 0) {
                    selectedTours.push({
                        name: res[0].nombre,
                        id: 666,
                        date: null
                    });
                    var child = "\n\t\t\t\t\t\t\t<div class=\"col-md-12 div-list-tours col-sm-12 col-xs-12 center-div \" id=\"detalles-tour-666\">\n\t\t\t\t\t\t\t\t<div class=\"col-md-8 list-tours-name col-xs-12 col-sm-8\"> " + res[0].nombre + "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-3 text-center list-tours-date col-xs-11 v-align col-sm-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"input-group con_calendario\">\n\t\t\t\t\t\t\t<span class=\"input-group-addon\" onclick=\"focucearCalendario('tour-666-date')\"><span class=\"fa fa-calendar\"></span></span>\n\t\t\t\t\t\t\t<input class=\"form-control\" id=\"tour-666-date\" readonly=\"true\" name=\"date\" type=\"text\" onchange=\"cambiarFechaTour(this)\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-1 text-center col-xs-1 v-align col-sm-1\">\n\t\t\t\t\t\t\t\t\t<span class=\"btn btn-default btn-sm fa fa-close\" onclick=\"removeTour(666)\">\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t";
                    $('#tours-screen').append(child);
                    $('.con_calendario input').datepicker({
                        'format': 'd-MM-yyyy',
                        'autoclose': true,
                        language: lang_domain,
                        startDate: 'now'
                    });
                    $('#toursModal').modal('hide');
                    location.hash = '';
                    setTimeout(function () {
                        $("#tour-666-date").focus();
                    }, 50);
                }
            },
            error: function (agg) {
            }
        });
    }
    if (getParameterByName('b')) {
        // hacer el ajax y pedir el nombre del tour
        $.ajax({
            type: 'POST',
            url: 'http://incalake.com/reservar/bus.php',
            dataType: 'json',
            data: 'bus=' + getParameterByName('b') + '&idioma=' + lang_domain,
            success: function (res) {
                if (res) {
                    selectedTickets.push({
                        id: res.bus_id,
                        origen: res.origen,
                        destino: res.destino,
                        hora: res.hora,
                        bus: res.empresa,
                        nombrebus: res.servicio,
                        precio: "$ " + res.precio,
                        date: null
                    });
                    var child = "\n\t\t\t\t\t\t\t<div class=\"col-md-12 div-list-buses col-sm-12 col-xs-12 center-div\" id=\"detalles-ticket-" + res.bus_id + "\">\n\t\t\t\t\t\t\t\t<div class=\"col-md-5 list-buses-name col-xs-12 col-sm-5\"> " + res.servicio + " / " + res.empresa + " / $ " + res.precio + "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-3 list-tours-where text-center v-align col-xs-12 col-sm-3 \"> " + res.origen + " - " + res.destino + "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-3 text-center list-buses-date col-xs-11 col-sm-3 v-align\">\n\t\t\t\t\t\t\t\t\t<div class=\"input-group con_calendario\">\n\t\t\t\t\t\t\t\t\t\t<span class=\"input-group-addon\" onclick=\"focucearCalendario('ticket-" + res.bus_id + "-date')\"><span class=\"fa fa-calendar\"></span></span>\n\t\t\t\t\t\t\t\t\t\t<input class=\"form-control\" id=\"ticket-" + res.bus_id + "-date\" readonly=\"true\" name=\"date\" type=\"text\" onchange=\"cambiarFechaTicket(this)\"/>\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-md-1 text-center col-xs-1 col-sm-1 v-align\">\n\t\t\t\t\t\t\t\t\t<span class=\"btn btn-default btn-sm fa fa-close\" onclick=\"removeTicket(" + res.bus_id + ")\">\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t";
                    $('#tickets-screen').append(child);
                    $('.con_calendario input').datepicker({
                        'format': 'd-MM-yyyy',
                        'autoclose': true,
                        language: lang_domain,
                        startDate: 'now'
                    });
                    $('#ticketsModal').modal('hide');
                    setTimeout(function () {
                        $("#ticket-" + res.bus_id + "-date").focus();
                    }, 50);
                }
            },
            error: function (agg) {
            }
        });
    }
});
/**********************************************************************************************/
/*******************************  Control de flujo en los pasos  ******************************/
/**********************************************************************************************/
function checkToursAndBuses() {
    // Verificar que haya al menos 1 tour o 1 bus
    // Limpiar cualquier alerta anterior
    document.getElementById('error-msg1').setAttribute('style', 'display: none');
    document.getElementById('error-msg2').setAttribute('style', 'display: none');
    // Veficar servicios requeridos
    if (selectedTours.length == 0 && selectedTickets.length == 0) {
        document.getElementById('error-msg1').setAttribute('style', 'display: block');
        return;
    }
    // Veficar fechas de tours y tickets
    for (var _i = 0, selectedTours_1 = selectedTours; _i < selectedTours_1.length; _i++) {
        var tour = selectedTours_1[_i];
        if (!tour.date) {
            document.getElementById('error-msg2').setAttribute('style', 'display: block');
            document.getElementById("tour-" + tour.id + "-date").focus();
            return;
        }
    }
    for (var _a = 0, selectedTickets_1 = selectedTickets; _a < selectedTickets_1.length; _a++) {
        var ticket = selectedTickets_1[_a];
        if (!ticket.date) {
            document.getElementById('error-msg2').setAttribute('style', 'display: block');
            document.getElementById("ticket-" + ticket.id + "-date").focus();
            return;
        }
    }
    var $active = $('.wizard .nav-tabs li.active');
    $active.next().removeClass('disabled');
    nextTab($active);
    $active.addClass('tab-complete');
    document.getElementById('name').focus();
}
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
        return true;
    }
    return false;
}
function checkPersonalInformation() {
    // Verificar que los datos sean correctos
    document.getElementById('div_for_name').setAttribute('class', 'form-group');
    document.getElementById('div_for_nationality').setAttribute('class', 'form-group');
    document.getElementById('div_for_email').setAttribute('class', 'form-group');
    document.getElementById('div_for_numberof').setAttribute('class', 'form-group');
    document.getElementById('error-msg3').setAttribute('style', 'display: none');
    // Veficar informacion personal
    if ($('#name').val().length < 1) {
        document.getElementById('name').focus();
        document.getElementById('error-msg3').setAttribute('style', 'display: block');
        document.getElementById('div_for_name').setAttribute('class', 'form-group has-error');
        return;
    }
    if ($('#nationality').val().length < 1) {
        document.getElementById('nationality').focus();
        document.getElementById('error-msg3').setAttribute('style', 'display: block');
        document.getElementById('div_for_nationality').setAttribute('class', 'form-group has-error');
        return;
    }
    if ($('#email').val().length < 1) {
        document.getElementById('email').focus();
        document.getElementById('error-msg3').setAttribute('style', 'display: block');
        document.getElementById('div_for_email').setAttribute('class', 'form-group has-error');
        return;
    }
    if (!ValidateEmail($('#email').val())) {
        document.getElementById('email').focus();
        document.getElementById('error-msg3').setAttribute('style', 'display: block');
        document.getElementById('div_for_email').setAttribute('class', 'form-group has-error');
        return;
    }
    if ($('#numberof').val().length < 1) {
        document.getElementById('numberof').focus();
        document.getElementById('error-msg3').setAttribute('style', 'display: block');
        document.getElementById('div_for_numberof').setAttribute('class', 'form-group has-error');
        return;
    }
    var data = {
        nombres: $('#name').val(),
        pais: $('#nationality').val(),
        npax: $('#numberof').val(),
        celular: $('#cellphone').val(),
        hotel: $('#place').val(),
        detalles: $('#extra').val(),
        email: $('#email').val(),
        tours: selectedTours,
        buses: selectedTickets,
        idioma: lang_domain
    };
    console.log(data);
    document.getElementById('div-loader').setAttribute('style', 'display:block');
    $.ajax({
        type: 'POST',
        url: 'http://incalake.com/reservar/email/reservar-cms.php',
        dataType: 'json',
        data: data,
        success: function (res) {
            console.log(res);
            // Leendo respuesta del servidor
            if (res.state == "success") {
                document.getElementById('div-loader').setAttribute('style', 'display:none');
                document.getElementById('respuesta').innerHTML = res.msg;
                var $active = $('.wizard .nav-tabs li.active');
                $active.addClass('tab-complete');
                $active.next().removeClass('disabled').addClass('tab-complete');
                nextTab($active);
                $active.addClass('disabled');
                $active.prev().addClass('disabled');
                $(".nueva_reserva").click(function (e) {
                    document.location.reload();
                });
            }
            else if (res.state == "error") {
                document.getElementById('div-loader').setAttribute('style', 'display:none');
                alert("Ocurrio un error, " + res.msg);
            }
            else {
                document.getElementById('div-loader').setAttribute('style', 'display:none');
                alert('Ocurrio un error Inesperado');
            }
        },
        error: function (agg) {
            console.log('error=>', agg.responseText);
            document.getElementById('div-loader').setAttribute('style', 'display:none');
            alert('Ocurrio un error, Verifique su conexion a Internet');
        }
    });
}
function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}
