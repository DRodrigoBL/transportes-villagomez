
export interface Carga {
    fechaCarga: string;
    cargasDetalles: CargasDetalles[];
}

export interface CargasDetalles {
    camioneta: string;
    chofer: string;
    ayudante?: string;
    destinoId: string;
    nombreDestino: string;
    origenId: string;
    nombreOrigen: string;
    productos: CargaProducto[];
}

export interface CargaProducto {
    productoId: string;
    nombreProducto: string;
    cantidad: number;
    remision: string;
    unidadMedida: string;
    unidadesPorMedida: number;
}
