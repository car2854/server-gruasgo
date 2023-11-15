"use strict";
class ConductorDbModel {
    constructor(id, idConductor, Lat, Lng, Estado, IdPedido, SubServicio, bandera) {
        this.id = id;
        this.idConductor = idConductor;
        this.Lat = Lat;
        this.Lng = Lng;
        this.Estado = Estado;
        this.IdPedido = IdPedido;
        this.SubServicio = SubServicio;
        this.bandera = bandera;
    }
}
