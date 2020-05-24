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

// dimensiones del campo
var sizex=50;
var sizey=50;

function goForrestGo(coordx,coordy) {
    // coordenadas de inicio
    var startingpointx=coordx;
    var startingpointy=coordy;
    // posicion de partida
    var arr={
        posx:startingpointx,
        posy:startingpointy,
        oldx:0,
        oldy:0,        
        cont:0,
        cat:1,
        dir:5,
        map:[]
    };    
    
    var texto="";
    // desde una ubicación
    var from=[startingpointy,startingpointx];


    var where;
    var way;
    var until;
    var gway;
    var entorno;
    var mov;


    var cont=0;
    do {

        // desde una ubicación
        from=[startingpointy,startingpointx];

        texto=texto+"<p>Queremos ir desde el punto Y:"+from[0]+" X:"+from[1]+"</p>";
        // tenemos que acceder a un punto en el mapa
        where=getAddress(from);
        texto=texto+"<p>Hasta el punto Y:"+where[0]+" punto X:"+where[1]+"</p>";
        // utilizando una via
        way=getWay(from,where);
        texto=texto+"<p>Empezando en la casilla punto Y:"+way[0]+" punto X:"+way[1]+"</p>";
        // durante un periodo de tiempo o hasta un objetivo
        until=getLimit(from, where,75);
        texto=texto+"<p>En un tiempo maximo de "+until+"</p>";

        gway=generalWay(where[0], where[1], from[0], from[1]);
        texto=texto+"<p>Tomando una direccion general "+gway[0]+" "+gway[1]+"</p>";

        entorno=detectEntornoR(from[0], from[1]);
        texto=texto+"<p>Con las siguientes opciones: </p>";
        texto=texto+"<p>"+entorno[0]+" / "+entorno[1]+" / "+entorno[2]+"</p>";
        texto=texto+"<p>"+entorno[3]+" / W / "+entorno[4]+"</p>";
        texto=texto+"<p>"+entorno[5]+" / "+entorno[6]+" / "+entorno[7]+"</p>";

        mov=recursiveWayR(arr,where[0],where[1],true);

        for (var i in mov) {
            texto=texto+"<p>PODEMOS IR A punto Y:"+mov[i]['posy']+" / punto X:"+mov[i]['posx']+" </p>";
        }

        if (mov.length==1) {
            // movemos el puntero a la nueva posicion
            startingpointy=mov[0]['posy'];
            startingpointx=mov[0]['posx'];
            //modificamos el arraymap con los datos del desplazamiento
            arr['oldx']=arr['posx'];
            arr['oldy']=arr['posy'];
            arr['posx']=startingpointx;
            arr['posy']=startingpointy;
            // Guardamos en el mapa la posicion
            arr['map'].push([arr['oldy'],arr['oldx']]);
            // pintamos en el mapa la posicion
            printPosition(arr);

        } else {
            // seleccionamos el movimiento a hacer
            // en funcion de la distancia a la que nos deja
            // del destino
            var dst=9999;
            var select=0;
            for (var i in mov) {
                // comprobamos la distancia hasta el final
                var frm=[mov[i]['posy'],mov[i]['posx']];
                //var whr=[mov[i]['posy'],mov[i]['posx']];
                var res=getLimit(frm,where,9999);
                texto=texto+"<p> DIRECCION"+mov[i]['posy']+" / "+mov[i]['posx']+" / VALORACION:"+res+"</p>";
                // si la nueva distancia es menor que la guardada
                // nos la quedamos
                if (res < dst) {
                    dst=res;
                    select=i;
                }
            }

            // movemos el puntero a la nueva posicion
            startingpointy=mov[select]['posy'];
            startingpointx=mov[select]['posx'];
            //modificamos el arraymap con los datos del desplazamiento
            arr['oldx']=arr['posx'];
            arr['oldy']=arr['posy'];
            arr['posx']=startingpointx;
            arr['posy']=startingpointy;
            // Guardamos en el mapa la posicion
            arr['map'].push([arr['oldy'],arr['oldx']]);            
            // pintamos en el mapa la posicion
            printPosition(arr);
        }

        // comprobamos si hemos llegado al final
        if (checkIfFinish(arr,where)) {
            cont=9999;
        } else if(checkIfBorder(arr)) {
            // comprueba entonces si hemos llegado
            // al borde del plano
            texto=texto+"<p> BORDE DEL PLANO: "+arr['posy']+" / "+arr['posx']+"</p>";
            // al llegar al borde, debemos retroceder hasta el último cruce
            texto=goBack(arr,texto);
        }

        cont++;

    } while (cont<75)



    $('#talk').html(texto);    
    
}







/**
 * Esta funcion nos devuelve una direccion a la que ir, en formato
 * array x,y
 * Lleva parametro from, pero seria opcional su uso
 * 
 * @param {type} from
 * @returns null | array
 */
function getAddress(from) {
    var ret=[49,40];
    return ret;
}

/**
 * Esta funcion retorna un camino factible hacia la direccion del objetivo
 * array x,y
 * @param {type} from
 * @param {type} where
 * @returns null | array
 */
function getWay(from,where) {
    var ret=[1,1];
    return ret;
}

/**
 * Limit nos indica el número máximo de pasos a realizar para llegar
 * al objetivo.
 * Si supera esos pasos, debe:
 * a) iniciar una nueva ruta
 * b) volver al punto de partida
 * 
 * @param {type} from
 * @param {type} where
 * @param {type} max distancia maxima que puede recorrer
 * @returns null | int
 */
function getLimit(from, where, max) {
    
    //if (from==null || where==null) return null;
    
    //if (from.length < 2 || where.length < 2) return null;
    
    // vamos a obtener la distancia mínima para llegar al objetivo
    var diff=0;
    if (from[0] < where[0]) {
        diff=diff+where[0]-from[0];
    } else {
        diff=diff+from[0]-where[0];
    }
    if (from[1] < where[1]) {
        diff=diff+where[1]-from[1];
    } else {
        diff=diff+from[1]-where[1];
    }
    
    // parametro optimizado
    // como normalmente no es posible ir en linea recta
    // duplicamos la distancia optima
    diff=diff*2;
    
    // si la distancia es mayor que la distancia maxima
    // posible a recorrer de una vez, se toma esta
    if (diff > max) diff=max;
    
    
    return diff;
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
function generalWay(destx, desty, situationx, situationy) {
    
    if (isNaN(destx) || isNaN(desty) || isNaN(situationx) || isNaN(situationy) 
            || destx==null || desty==null || situationx==null || situationy==null ) {
        return null;
    }
    
    var wayx='center';
    var wayy='center';
    
    if (situationx > destx) {
        wayx='left';
    } else if (situationx < destx) {
        wayx='right';
    }
    
    if (situationy < desty) {
        wayy='down';
    } else if (situationy > desty) {
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
function detectEntornoR ( y, x) {
    
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
function recursiveWayR(arraypos,destx,desty,strict) {
    
    // obtenemos la orientación general del destino, desde la posicion actual
    var dirgeneral=generalWay(destx, desty, arraypos['posx'], arraypos['posy']);
    // comprobamos las posibilidades de avance, desde la posición actual
    var posiblesdirecciones=detectEntornoR ( arraypos['posy'], arraypos['posx'])
    
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
 * 
 *
 * @param {type} arrmap
 * @returns {undefined} */
function printPosition(arrmap) {
    
    $("#point_"+(arrmap['posy'])+"-"+(arrmap['posx'])).text('*');
    $("#point_"+(arrmap['oldy'])+"-"+(arrmap['oldx'])).text('=')

} 

/**
 * Esta funcion comprueba si hemos llegado a destino
 *
 * @returns {undefined} */
function checkIfFinish(arrmap,where) {
    
    if (arrmap['posy']==where[0] && arrmap['posx']==where[1]) {
        return true;
    }
    return false;
}

/**
 * Esta funcion comprueba si hemos llegado a destino
 *
 * @returns {undefined} */
function checkIfBorder(arrmap) {
    
    if (arrmap['posy']==0 || arrmap['posy']==(sizey-1)) {
        return true;
    }
    if (arrmap['posx']==0 || arrmap['posx']==(sizex-1)) {
        return true;
    }    
    return false;
}

function goBack(arrmap,texto) {
    
    var mapa=arrmap['map'];
    var crossSelection=[];
    var iniciomap=mapa.length-1;
    var finmap=mapa.length-10;
    for (var i=iniciomap;i>finmap;i--) {
        
        // vamos mapeando el entorno recorrido, desde la casilla
        // inmediatamente anterior a la menos 10
        var entorno=detectEntornoR ( mapa[i][0], mapa[i][1]);
        texto=texto+"<p>Con las siguientes opciones: "+i+" / "+mapa[i][0]+" / "+mapa[i][1]+"</p>";
        texto=texto+"<p>"+entorno[0]+" / "+entorno[1]+" / "+entorno[2]+"</p>";
        texto=texto+"<p>"+entorno[3]+" / W / "+entorno[4]+"</p>";
        texto=texto+"<p>"+entorno[5]+" / "+entorno[6]+" / "+entorno[7]+"</p>";
        
        // contabilizamos las posibles variantes saltadas en los cruces
        // teniendo en cuenta que no podemos contar las diagonales
        var counter=0;        
        if (entorno[1]=="  ") counter++;
        if (entorno[3]=="  ") counter++;
        if (entorno[4]=="  ") counter++;
        if (entorno[6]=="  ") counter++;
        
        texto=texto+"<p> Opciones con cruce: "+counter+"</p>";
        
        if (counter > 0) {
            var cx=mapa[i][1];
            var cy=mapa[i][0];
            //goForrestGo(cx,cy);
        }
    }
    return texto;
}