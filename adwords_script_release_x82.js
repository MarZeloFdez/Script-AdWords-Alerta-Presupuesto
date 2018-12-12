/*
     
    SCRIPT ADWORDS DE ALERTA DE PRESUPUESTO
  
    author: Marcelo Fernandez
    web: www.marcelofernandez.es <-.-> www.soporte-web.es
    v.82
                     `www´   
                     (0 0) 
             ---oOO-- (_) --oOO---    
          ╔═════════════════════════╗ 
          ║  By: MaRcElo FeRnAnDeZ  ║ 
          ╚═════════════════════════╝ 
              -------------------
                    |__|__| 
                     || || 
                    ooO Ooo 
  
*/

function main() {
  
  var alerta = 5500; // Definir Alerta
  var presupuesto = 6000; // Definir Presupuesto
  var fecha = ('20150601'); // Definir Fecha de Ingreso - yyyyMMdd
  var correo = ('correo@para_notificaciones.es'); // Definir Correo Notificacion
  var nombre_alerta = ('Alerta Presupuesto AdWords'); // Definir Mensaje para Tarea, Calendario y Asunto Correo
 
  
  if (alerta < presupuesto){
    
     Presupuesto(alerta, presupuesto, fecha, correo, nombre_alerta);
     
  }else{
  
     Logger.log ('ERROR DE CONFIGURACION \n\nEl importe de la alerta debe ser inferior al del presupuesto');
  
  }
  
}

//FUNCION DE PRESUPUESTO
function Presupuesto(alerta, presupuesto, fecha, correo, nombre_alerta) {

  var hoy = ControlFecha(0); // Fecha Comparacion ('yyyyMMdd');
    
  var selector_busqueda = AdWordsApp.campaigns()
        .withCondition('Name = "Busqueda"') // Definir Nombre de Campaña
        .get();
      
  var busqueda = selector_busqueda.next();
  var stats_busqueda = busqueda.getStatsFor(fecha, hoy);
  
  var selector_remarketing = AdWordsApp.campaigns()
       .withCondition('Name = "Remarketing"') // Definir Nombre de Campaña
       .get();
  
  var remarketing = selector_remarketing.next();
  var stats_remarketing = remarketing.getStatsFor(fecha, hoy);


  var consumido = (stats_busqueda.getCost() + stats_remarketing.getCost()); 
  var total = presupuesto - consumido
  total = total.toFixed(2);
  
  var porciento = (consumido * 100) / presupuesto;
  porciento = Math.round(porciento);
  
  // Fijar Alerta en Cosumido >= o Total <=
  if (consumido >= alerta) {  
      
    var imagenEmpresaUrl = ('https://www.google.com/partners/images/partners-badge.png');  // Definir URL Logo Empresa
    var imagenEmpresa = UrlFetchApp.fetch(imagenEmpresaUrl).getBlob().setName('imagenEmpresaUrl');
    
    var lista_tarea = '@default';  
    var tarea = Tasks.Tasks.list(lista_tarea);

    for (var i = 0; i < tarea.items.length; i++) {
    
        if(tarea.items[i].title == nombre_alerta){
    
           var estado = tarea.items[i].status;
      
           if(estado == 'completed'){ 
        
              Logger.log('TAREA COMPLETADA PERO NO REALIZADA\n');
             
              MailApp.sendEmail({to: correo, subject: nombre_alerta, 
              htmlBody:'<img src="cid:logo" /><br />' +
                 '<p>Le recordamos que todavia no esta reiniciado el presupuesto. Ha consumido <b>' + consumido + '€</b> de ' + presupuesto + '€, le quedan ' + total + '€.</p>' + 
                 '<p style="color:#ff0000;"><i>No responda a este mensaje, ha sido generado automaticamente.</i></p>',
                          
              inlineImages:{logo: imagenEmpresa}
              }); 
              
              Logger.log('Correo de Alerta Enviado. Consumido: ' + consumido + '€ = ' + porciento + '%');
              break;
      
           }else if (estado == 'needsAction'){
        
              Logger.log('TAREA PENDIENTE');
              break;
        
           }else{};
     
        }
    
        Logger.log('ALERTA ACTIVADA\n');
      
        MailApp.sendEmail({to: correo, subject: nombre_alerta, 
        htmlBody:'<img src="cid:logo" /><br />' +
                 '<p>El presupuesto ha llegado a <b>' + consumido + '€</b> (' + porciento + '%) de ' + presupuesto + '€, le quedan ' + total + '€.</p>' +
                                      
                 '<b>Estadisticas</b><hr>' +
                 
                 '<table><tr><td>' + busqueda.getName() + ' </td> <td> Coste: ' + stats_busqueda.getCost() + '€ </td> <td> Clics: ' + stats_busqueda.getClicks() + ' </td>' +
                 '<td> Impresiones: ' + stats_busqueda.getImpressions() + ' </td></tr>' +
                 
                 '<tr><td>' + remarketing.getName() + ' </td> <td> Coste: ' + stats_remarketing.getCost() + '€ </td> <td> Clics: ' + stats_remarketing.getClicks() + ' </td>' +
                 '<td> Impresiones: ' + stats_remarketing.getImpressions() +' <td></tr></table>' +
                           
                 '<p style="color:#ff0000;"><i>No responda a este mensaje, ha sido generado automaticamente.</i></p>', 
                              
                           
        inlineImages:{logo: imagenEmpresa}
        });   
        
        Logger.log('Correo de Alerta Enviado');

        CrearTarea(presupuesto, consumido, total, nombre_alerta);
      
        var yyyy = fecha.substring(0, 4);
        var mm = fecha.substring(6, 4);
        var dd = fecha.substring(8, 6); 
    
        var fecha = CambiarFecha(yyyy + '-'+ mm + '-' + dd ,"yyyy-mm-dd","-");
    
        CalcularMedia(fecha, new Date(), presupuesto, consumido, total, correo, nombre_alerta);
      
        Logger.log('\nTODO CORRECTO :-)');
        
     }
      
  }else{
  
     Logger.log('SIN NOVEDAD. Consumido: ' + consumido + '€ = ' + porciento + '%\nTODO CORRECTO :-)');
      
  }  
  
}

//FUNCION CALCULAR DIAS Y MEDIA 
function CalcularMedia(fecha, hoy, presupuesto, consumido, total, correo, nombre_alerta) {
  
  var difference = (hoy - fecha);

  var years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
  difference -= years * (1000 * 60 * 60 * 24 * 365);
  var months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.4375));
  var day = Math.floor(difference / (1000 * 60 * 60 * 24));
  
  var dif = '';
  if (years > 0)
      dif = years;

  if (months > 0) {
     if (years > 0) dif;
     dif += day;
  }else {    
     dif = day;
  }
    
  
  Logger.log('\nConsumido ' + consumido + '€ en ' + dif + ' dias');
         
  var resultado = (total * dif) / consumido;    
  resultado = Math.round(resultado);
  var resultado_final = resultado.toFixed();
  
  Logger.log('Queda un total de ' + total + '€, aproximadamente ' + resultado_final + ' dias' );
  
  EventoCalendar(presupuesto, consumido, total, correo, nombre_alerta, resultado_final);

}

//FUNCION NECESARIA PARA EVENTO CALENDAR - API REQUERIDA
function EventoCalendar(presupuesto, consumido, total, correo, nombre_alerta, resultado_final) {
 
  var calendario = 'primary';
  var inicio = new Date();
  var cortesia = ('-' + resultado_final);
  var fin = new Date();
  fin.setDate(fin.getDate() - cortesia);
  
  var evento = {
     summary: nombre_alerta,
     description: 'El presupuesto ha llegado a ' + consumido + '€ de ' + presupuesto + '€ le queda ' + total + ' €',
    
     start: {
       dateTime: inicio.toISOString()
     },
     end: {
       dateTime: fin.toISOString()
     },
     attendees: [{email: correo}],
     colorId: 10  
  };
  
  evento = Calendar.Events.insert(evento, calendario);
  Logger.log('Alerta Creada en Calendario ID: ' + evento.getId());

}

//FUNCION NECESARIA PARA CREAR TAREA GOOGLE - API REQUERIDA
function CrearTarea(presupuesto, consumido, total, nombre_alerta) {

  var lista_tarea = '@default';
  var tarea = Tasks.newTask();
  tarea.title = nombre_alerta;
  tarea.notes = 'El presupuesto ha llegado a ' + consumido + '€ de ' + presupuesto + '€ le queda ' + total + ' €';

  var tarea_tiempo = new Date();
  tarea_tiempo.setDate(tarea_tiempo.getDate() + 5);
  tarea.due = tarea_tiempo.toISOString();

  var tarea_insert = Tasks.Tasks.insert(tarea, lista_tarea);
  Logger.log('Tarea Creada ID: ' + tarea_insert.id);
  
}

//FUNCION CAMBIAR FORMA FECHA 
function CambiarFecha(_dia, _formato, _separador)
{
  
  var formatLowerCase = _formato.toLowerCase();
  var formatItems = formatLowerCase.split(_separador);
  var dateItems = _dia.split(_separador);
  var monthIndex = formatItems.indexOf("mm");
  var dayIndex = formatItems.indexOf("dd");
  var yearIndex = formatItems.indexOf("yyyy");
  var month = parseInt(dateItems[monthIndex]);
  month-=1;
 
  var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
  return formatedDate;

}

//FUNCION CONTROL FECHA
function ControlFecha(dias) {

   var hoy = new Date();
   hoy.setDate(hoy.getDate() - dias);
  
   return Utilities.formatDate(hoy, "PST", "yyyyMMdd");
  
}