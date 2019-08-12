
export interface Carga {
    fechaCarga: string;
    cargasDetalles: Cargas[];
}

export interface Cargas {
    camioneta: string;
    chofer: string;
    ayudante?: string;
    origen: Origen;
    destino: Destino;
    productos: Producto[];
}

export interface Destino {
    destinoId: string;
    nombreDestino: string;
}

export interface Origen {
    origenId: string;
    nombreOrigen: string;
}

export interface Producto {
    productoId: string;
    nombreProducto: string;
    cantidad: number;
    remision: string;
    unidadMedida: string;
    unidadesPorMedida: number;
}
