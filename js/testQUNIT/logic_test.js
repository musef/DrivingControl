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

var from=[0,0];
var where=[99,99];
QUnit.test( "Chequea getAddress not null", function( assert,from ) {
  var address=getAddress(from);
  assert.notEqual( address, null, "La dirección de destino no es null" );
});

QUnit.test( "Chequea getAddress es un array", function( assert,from ) {
  var address=getAddress(from);
  assert.equal( Array.isArray(address),true , "La dirección de destino es array" );
  assert.equal( address.length,2 , "El array de la dirección de destino mide 2 de longitud" );
});

QUnit.test( "Chequea getWay not null", function( assert,from,where ) {
  var address=getWay(from,where);
  assert.notEqual( address, null, "El camino de direccion no es null" );
});

QUnit.test( "Chequea getWay es un array", function( assert,from,where ) {
  var address=getWay(from,where);
  assert.equal( Array.isArray(address),true , "El camino de direccion es array" );
  assert.equal( address.length,2 , "El array del camino de direccion mide 2 de longitud" );
});

QUnit.test( "Chequea getLimit not null", function( assert ) {
    var from=[0,0];
    var where=[99,99];
  var limit=getLimit(from,where,9999);
  assert.notEqual( limit, null, "El limite no es null" );
});

QUnit.test( "Chequea getLimit es número entero", function( assert ) {
    var from=[0,0];
    var where=[99,99];    
  var limit=getLimit(from,where,9999);

  assert.equal( isNaN(limit), false, "El limite es un número" );
  assert.equal(limit>0, true, "El limite es un número entero positivo" );
});

QUnit.test( "Chequea generalWay not null", function( assert ) {

  var dir=generalWay(99, 99, 0, 0);
  assert.notEqual( dir, null, "El orientacion general no es null" );
  var dir=generalWay(null, null, null, null);
  assert.equal( dir, null, "El orientacion general es null" );
});

QUnit.test( "Chequea generalWay es un array", function( assert ) {
  
  var dir=generalWay(99, 99, 0, 0);

  assert.equal( Array.isArray(dir),true , "El orientacion general es array" );
  assert.equal( dir.length,2 , "El orientacion general mide 2 de longitud" );
});