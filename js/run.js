/* 
 * Copyright (C) fmsdevelopment.com author musef2904@gmail.com
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

// coordenadas de inicio
var startingpointx=6;
var startingpointy=0;

// coordenadas de final
var destinypointx=49;
var destinypointy=30;

// coordenadas actuales
var situationx=6;
var situationy=0;

// dimensiones del campo
var sizex=50;
var sizey=50;

var solutions=[];

$(document).ready(function(){
    
    var startpoint='#point_'+startingpointy+'-'+startingpointx;
    
    // primero comprobamos si estamos en una casilla vacia
    if (checkIfCorrect(startingpointx,startingpointy)) {
        
        // detectamos nuestro entorno
        //var dataval=detectEntorno(startingpointx,startingpointy);
        
        // obtenemos la mejor direccion para llegar
        //var map=getBetterOption(dataval,destinypointx,destinypointy);
        
        // nos desplazamos
        //moveOn(map,startingpointx,startingpointy);
    }
    
    // posicion de partida
    var arr={
        posx:startingpointx,
        posy:startingpointy,
        oldx:0,
        oldy:0,        
        cont:0,
        cat:1,
        dir:5,
        map:null
    };
    
    var result="false";
    
    // repetiremos el bucle de mapa-consejo-exploracion-movimiento
    // hasta llegar a destino u obtener un error
    while (result == 'false') {

        if (tenemosMapa(arr,destinypointx,destinypointy) != "false"){
            // si tenemos mapa lo usamos

        } else if (tenemosConsejo(arr,destinypointx,destinypointy) != "false"){
            // si conseguimos consejo, lo usamos

        } else {
            // sin mapa ni consejo, debemos explorar el recorrido

            var cont=0;
            // instanciamos el proceso de explorar
            // y recibimos un mapa de recorrido
            var provmap=[];
            var map=goForrestGo(arr,cont,0,provmap);

            result=moveOn2(map);

    //        for (var i in solutions) {
    //            console.log(solutions[i]['cont']+'--'+solutions[i]['posx']+'--'+solutions[i]['posy']);
    //        }        
        }        
        
    }
    

    



});


/**
 * Esta funcion devuelve un mapa de recorrido total hasta el destino, o
 * false si no tiene un mapa
 * @param {type} arrayPoint
 * @param {type} destinypointx
 * @param {type} destinypointy
 * @returns {String}
 */
function tenemosMapa(arrayPoint,destinypointx,destinypointy) {
    
    return "false";
    
}


/**
 * Esta funcion devuelve un mapa total o parcial hasta el destino,
 * obtenido por diversos medios, o false si no lo tiene
 * @param {type} arrayPoint
 * @param {type} destinypointx
 * @param {type} destinypointy
 * @returns {String}
 */
function tenemosConsejo(arrayPoint,destinypointx,destinypointy) {
    
    return "false";
    
}


/**
 * Esta funcion recursiva explora buscando el mejor de los caminos hasta
 * una profundidad determinada.
 * Siempre devuelve un mapa
 * 
 * @param {type} arrProcess
 * @param {type} cont
 * @param {type} level
 * @returns {Array|goForrestGo.map}
 */
function goForrestGo(arrProcess,cont,level,provmap) {
    
    // manejamos el bucle segun el anidamiento
    var bucle=10;
    if (level>0) bucle=5;
    
    do {
        var dirs=recursiveWay(arrProcess,destinypointx,destinypointy,"false");
        if (dirs != null) {
            var map=provmap;
            if (dirs.length<2) {
                // almacena en el mapa el punto avanzado
                map.push([dirs[0]['posx'],dirs[0]['posy']]);
                //moveOn2(map);
                cont++;
            } else {
                // llegado aqui ha de guardar el recorrido
                map.push(arrProcess);
                provmap=map;
                cont++;
                for (var i in dirs) {
                    map.push([dirs[i]['posx'],dirs[i]['posy']]);
                    //moveOn2(map);
                    goForrestGo(dirs[i],cont,1,provmap);
                }             
            }

            arrProcess=dirs[0];          
        } else {
            // guardamos la solucion
            solutions.push(arrProcess);
            break;
        }

        //moveOn2(map);
    } while (cont < bucle);    
    
    return map;
}


/**
 * Recibe una matriz con los datos actuales del objeto;
 * chequea la orientacion general del movimiento, en funcion del destx e desty
 * Si strict es true, desecha las opciones que no van en la orientacion general
 * Si strict false, prueba todas las opciones
 * @param {type} arraypos
 * @param {type} destx
 * @param {type} desty
 * @param {type} strict
 * @returns {Array|recursiveWay.arraydirecciones}
 */
function recursiveWay(arraypos,destx,desty,strict) {
    
    // obtenemos la orientación general del destino, desde la posicion actual
    var dirgeneral=generalWay(destx, desty, arraypos['posx'], arraypos['posy']);
    // comprobamos las posibilidades de avance, desde la posición actual
    var posiblesdirecciones=detectEntorno ( arraypos['posx'], arraypos['posy'])
    
    var arraydirecciones=[];

    // subir hacia arriba
    if (posiblesdirecciones[1]!='X' && posiblesdirecciones[1]!='99') {
        var act=parseInt(arraypos['posy'])-1; 
        var cont=parseInt(arraypos['cont'])+1; 
        var arr={
            posx:arraypos['posx'],
            posy:act,
            oldx:0,
            oldy:0,              
            cont:cont,
            cat:0,
            dir:2,
            map:null
            };

            // añadimos la direccion si no es de donde viene
        if (arr['posx']!=arraypos['oldx'] || arr['posy']!=arraypos['oldy'] ) {
            // le asignamos la preferencia si va en la direccion general
            if (dirgeneral[1] == 'up' || dirgeneral[1] == 'center') arr['cat']=1;
            // pasamos a old la antigua direccion
            arr['oldx']=arraypos['posx'];
            arr['oldy']=arraypos['posy'];
            // guardamos
            if (strict=="true") {
                // si strict es true, solo guardamos direcciones cat. 1
                if (arr['cat']==1) arraydirecciones.push(arr); 
            } else {
                arraydirecciones.push(arr);                 
            }
           
        }

    }

    // bajar
    if (posiblesdirecciones[6]!='X' && posiblesdirecciones[6]!='99') {
        var act=parseInt(arraypos['posy'])+1;
        var cont=parseInt(arraypos['cont'])+1;        
        var arr={
            posx:arraypos['posx'],
            posy:act,
            oldx:0,
            oldy:0,              
            cont:cont,
            cat:0,
            dir:7,
            map:null
            };
            // añadimos la direccion si no es de donde viene
        if (arr['posx']!=arraypos['oldx'] || arr['posy']!=arraypos['oldy'] ) {
            // le asignamos la preferencia si va en la direccion general
            if (dirgeneral[1]=='down'|| dirgeneral[1] == 'center' ) arr['cat']=1;  
            // pasamos a old la antigua direccion
            arr['oldx']=arraypos['posx'];
            arr['oldy']=arraypos['posy'];
            if (strict=="true") {
                // si strict es true, solo guardamos direcciones cat. 1
                if (arr['cat']==1) arraydirecciones.push(arr); 
            } else {
                arraydirecciones.push(arr);                 
            }           
        }       
    }    
    
    
    // izquierda
    if (posiblesdirecciones[3]!='X' && posiblesdirecciones[3]!='99') {
        var act=parseInt(arraypos['posx'])-1;
        var cont=parseInt(arraypos['cont'])+1;        
        var arr={
            posx:act,
            posy:arraypos['posy'],
            oldx:0,
            oldy:0,              
            cont:cont,
            cat:0,
            dir:4,
            map:null
            };
            // añadimos la direccion si no es de donde viene
        if (arr['posx']!=arraypos['oldx'] || arr['posy']!=arraypos['oldy'] ) {
            // le asignamos la preferencia si va en la direccion general
            if (dirgeneral[0]=='left' || dirgeneral[0] == 'center') arr['cat']=1;            
            // pasamos a old la antigua direccion
            arr['oldx']=arraypos['posx'];
            arr['oldy']=arraypos['posy'];
            if (strict=="true") {
                // si strict es true, solo guardamos direcciones cat. 1
                if (arr['cat']==1) arraydirecciones.push(arr); 
            } else {
                arraydirecciones.push(arr);                 
            }          
        }       
    }    
    
    // izquierda
    if (posiblesdirecciones[4]!='X' && posiblesdirecciones[4]!='99') {
        var act=parseInt(arraypos['posx'])+1;
        var cont=parseInt(arraypos['cont'])+1;        
        var arr={
            posx:act,
            posy:arraypos['posy'],
            oldx:0,
            oldy:0,              
            cont:cont,
            cat:0,
            dir:5,
            map:null
            };
            // añadimos la direccion si no es de donde viene
        if (arr['posx']!=arraypos['oldx'] || arr['posy']!=arraypos['oldy'] ) {            
            // le asignamos la preferencia si va en la direccion general
            if (dirgeneral[0]=='right' || dirgeneral[0] == 'center') arr['cat']=1;        
            // pasamos a old la antigua direccion
            arr['oldx']=arraypos['posx'];
            arr['oldy']=arraypos['posy'];
            if (strict=="true") {
                // si strict es true, solo guardamos direcciones cat. 1
                if (arr['cat']==1) arraydirecciones.push(arr); 
            } else {
                arraydirecciones.push(arr);                 
            }           
        }      
    }
    
    // ordenamos el array en funcion de las categorias
    // las categorias hacia el objetivo son 1
    // y fuera de objetivo son cero
    if (arraydirecciones.length>1) {
        arraydirecciones.sort(function(a,b){
            if (a['cat']>b['cat']){
                return -1;
            }
            if (a['cat']<b['cat']){
                return 1;
            }
            return 0;
        });
        //console.log('num arrays:'+arraydirecciones.length);
        //console.log('direcciones generales:'+dirgeneral[0]+'//'+dirgeneral[1]);
        console.log('actual:'+arraypos['posx']+'//'+arraypos['posy']);
        console.log('calculadas:'+arraydirecciones[0]['posx']+'//'+arraydirecciones[0]['posy']);        
    } else if (arraydirecciones.length==0) {
        console.log('FINAL:'+arraypos['posx']+'//'+arraypos['posy']+' =>'+arraypos['cont']);
        return null;
    } else {
        //console.log('num arrays:'+arraydirecciones.length);
        //console.log('direcciones generales:'+dirgeneral[0]+'//'+dirgeneral[1]);
        console.log('actual:'+arraypos['posx']+'//'+arraypos['posy']);
        console.log('calculadas:'+arraydirecciones[0]['posx']+'//'+arraydirecciones[0]['posy']);        
    }        
    
    return arraydirecciones;
    
}


/**
 * Esta funcion nos informa de la ruta general a seguir (izquierda, derecha, arriba,
 * abajo, centro) desde el punto actual hasta el destino
 * Es una especie de brujula
 * @param {type} x
 * @param {type} y
 * @param {type} situationx
 * @param {type} situationy
 * @returns {Array}
 */
function generalWay(x, y, situationx, situationy) {
    
    var wayx='center';
    var wayy='center';
    
    if (situationx > x) {
        wayx='left';
    } else if (situationx < x) {
        wayx='right';
    }
    
    if (situationy < y) {
        wayy='down';
    } else if (situationy > y) {
        wayy='up';
    }    
    
    return [wayx, wayy];
}


/**
 * Esta funcion detecta lo que hay alrededor del punto en el que
 * estamos, y devuelve un mapa con lo que encuentra:
 * 99 significa no posible avance
 * 
 * @param {type} x
 * @param {type} y
 * @returns {Array}
 */
function detectEntorno ( x, y) {
    
    if (x==0) {
        
        if (y==0) {
            
            return [
                '99',
                '99',
                '99',
                '99',
                $("#point_"+(y)+"-"+(x+1)).text(),
                '99',
                $("#point_"+(y+1)+"-"+(x)).text(),
                $("#point_"+(y+1)+"-"+(x+1)).text()
            ];            
            
        } else if (y==sizey) {
        // la y supera el limite
            return [
                '99',
                $("#point_"+(y-1)+"-"+(x)).text(),
                $("#point_"+(y-1)+"-"+(x+1)).text(),
                '99',
                '99',
                '99',
                '99',
                '99',
            ];           
            
        } else {
            // caso normal
            return [
                '99',
                $("#point_"+(y-1)+"-"+(x)).text(),
                $("#point_"+(y-1)+"-"+(x+1)).text(),
                '99',
                $("#point_"+(y)+"-"+(x+1)).text(),
                '99',
                $("#point_"+(y+1)+"-"+(x)).text(),
                $("#point_"+(y+1)+"-"+(x+1)).text()
            ];            
           // return ['99','99','99',$("#point_0-"+(x-1)).text(),$("#point_0-"+(x+1)).text(),$("#point_"+(y+1)+"-"+(x-1)).text(),$("#point_"+(y+1)+"-"+(x)).text(),$("#point_"+(y+1)+"-"+(x+1)).text()];            
        }
        
    } else if (x==sizex) {
                // la x supera el limite
        if (y==0) {
            
            return [
                '99',
                '99',
                '99',
                $("#point_"+(y)+"-"+(x-1)).text(),
                '99',
                $("#point_"+(y+1)+"-"+(x-1)).text(),
                '99',
                '99',
            ];               
            
        } else if (y==sizey) {
        // la y supera el limite            
            return [
                $("#point_"+(y-1)+"-"+(x-1)).text(),
                '99',
                '99',
                '99',
                '99',
                '99',
                '99',
                '99',
                '99',
            ];              
        } else {
            // caso normal
            return [
                $("#point_"+(y-1)+"-"+(x-1)).text(),
                '99',
                '99',
                $("#point_"+(y)+"-"+(x-1)).text(),
                '99',
                $("#point_"+(y+1)+"-"+(x-1)).text(),
                '99',
                '99',
            ];              
        }        
        
    } else {
        
        // caso normal
        
        if (y==0) {
            
            return [
                '99',
                '99',
                '99',
                $("#point_"+(y)+"-"+(x-1)).text(),
                $("#point_"+(y)+"-"+(x+1)).text(),
                $("#point_"+(y+1)+"-"+(x-1)).text(),
                $("#point_"+(y+1)+"-"+x).text(),
                $("#point_"+(y+1)+"-"+(x+1)).text()
            ];            
            
            //return ['99','99','99',$("#point_0-"+(x-1)).text(),$("#point_0-"+(x+1)).text(),$("#point_"+(y+1)+"-"+(x-1)).text(),$("#point_"+(y+1)+"-"+(x)).text(),$("#point_"+(y+1)+"-"+(x+1)).text()];
            
        } else if (y==sizey) {
        // la y supera el limite            
            return [
                $("#point_"+(y-1)+"-"+(x-1)).text(),
                $("#point_"+(y-1)+"-"+(x)).text(),
                $("#point_"+(y-1)+"-"+(x+1)).text(),
                '99',
                '99',
                '99',
                '99',
                '99',
            ];               
        } else {
            // caso normal
            return [
                $("#point_"+(y-1)+"-"+(x-1)).text(),
                $("#point_"+(y-1)+"-"+(x)).text(),
                $("#point_"+(y-1)+"-"+(x+1)).text(),
                $("#point_"+(y)+"-"+(x-1)).text(),
                $("#point_"+(y)+"-"+(x+1)).text(),
                $("#point_"+(y+1)+"-"+(x-1)).text(),
                $("#point_"+(y+1)+"-"+(x)).text(),
                $("#point_"+(y+1)+"-"+(x+1)).text()
            ];        
        }        
        
    }
    
    
    return ['0','0','0','0','0','0','0','0'];
}



// Esta funcion verifica si estamos situados sobre la casilla correcta
function checkIfCorrect( x, y) {
    
    var startpoint='#point_'+y+'-'+x;
    
    if ($(startpoint).text() == '1') return false;

    $(startpoint).text('A');
    
    return true;
}




// esta funcion obtiene la mejor opcion de camino hacia el destino
// entre las diferente opciones suministradas.
function getBetterOption(directions, x, y) {
    
    // cero cero significa sobre el punto donde 
    // esta situado actualmente
    // [-1 -1 -1 0 -1 +1]
    // [ 0 -1  0 0  0 +1]
    // [+1 -1 +1 0 +1 +1]
    var betterx=0;
    var bettery=0;
    
    // obtenemos la navegacion general a realizar
    var navigation=generalWay(x, y, situationx, situationy);
//    alert (navigation[0]+'/'+navigation[1]+'**'+destinypointx);
    
    // obtenemos un mapa del recorrido
    var waymap=maps(navigation);
    
    return waymap;

}




// retorna un mapa con el recorrido que ha de hacer,
// segun su posicion relativa
    // [-1 -1 -1 0 -1 +1]
    // [ 0 -1  0 0  0 +1]
    // [+1 -1 +1 0 +1 +1]
function maps(generalnavigation) {
    
    return [
        [0,1],
        [0,1],
        [0,1],
        [0,1],
        [0,1],
        [1,0],
        [1,0],
        [1,0],                
        [0,1],  
        [1,0],
        [1,0],
        [1,0],  
        [1,0],
        [1,0],
        [1,0]       
    ];
    
}



// esta funcion mueve el objeto al nuevo destino
// dejando el rastro detras de la anterior posicion
function moveOn(thismap,x,y) {
    
    var stepx=0;
    var stepy=0;
    for (var i in thismap) {
        //alert ('GO');
        stepx=thismap[i][0];
        stepy=thismap[i][1];
        // dejamos el rastro
        var startpoint='#point_'+y+'-'+x;
        $(startpoint).text('0');        
        x=x+stepx;
        y=y+stepy;
        // nueva direccion
        var startpoint='#point_'+y+'-'+x;
        $(startpoint).text('A');         
    }
    
    
    return true;
}



// esta funcion mueve el objeto al nuevo destino
// dejando el rastro detras de la anterior posicion
function moveOn2(thismap) {
    

//    for (var i in thismap) {
//        stepx=thismap[i][0];
//        stepy=thismap[i][1];
//        // nueva direccion
//        var startpoint='#point_'+stepy+'-'+stepx;
//        $(startpoint).text('A');         
//        console.log('se mueve a:'+startpoint);
//    }
        stepx=thismap[0][0];
        stepy=thismap[0][1];
        // nueva direccion
        var startpoint='#point_'+stepy+'-'+stepx;
        $(startpoint).text('A');         
        console.log('se mueve a:'+startpoint);
    
    return true;
}
