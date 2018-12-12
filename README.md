# Script AdWords Alerta Presupuesto
  
    author: Marcelo Fernandez
    web: www.marcelofernandez.es <-.-> www.soporte-web.es
    v.82
                     `www´   
                     (0 0) 
             ---oOO-- (_) --oOO---    
          +-------------------------+ 
          ¦  By: MaRcElo FeRnAnDeZ  ¦ 
          +-------------------------+ 
              -------------------
                    |__|__| 
                     || || 
                    ooO Ooo 
  


# Descripción

Este Script AdWords sirve para enviar una notificación por correo electrónico cuando las campañas que nosotros seleccionemos lleguen a un coste específico. También calcula cuantos días de presupuesto queda y creará un evento en el calendario.

   
# Instalación y Requisistos
           
       1- Habilitar API Avanzadas TASK y CALENDAR

       2- Rellenar parametros de configuracion  
          
              var alerta = 130; // Definir Alerta
              var presupuesto = 150; // Definir Presupuesto
              var fecha = ('20150601'); // Definir Fecha de Ingreso - yyyyMMdd
              var correo = ('correo@para_notificaciones.es'); // Definir Correo Notificacion
              var nombre_alerta = ('Alerta Presupuesto AdWords'); // Definir Mensaje para Tarea, Calendario y Asunto Correo


       3- Seleccionar Campañas

              var selector_busqueda = AdWordsApp.campaigns()
              .withCondition('Name = "Busqueda"') // Definir Nombre de Campaña
              .get();


       4- Definir la imagen de empresa

              var imagenEmpresaUrl = ('https://www.google.com/partners/images/partners-badge.png');  // Definir URL Logo Empresa


       5- Definir ID Cliente. [Solo Version MCC]

              var id_cliente = ('XXX-XXX-XXXX'); // Definir ID Cliente


       RUN >>
