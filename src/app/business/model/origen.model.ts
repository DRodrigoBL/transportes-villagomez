export interface Origen {
    id: string;
    nombreOrigen: string;
    destinos: Destino[];
}

export interface Destino {
    id: string;
    nombreDestino: string;
    productos: Producto[];
}

export interface Producto {
    id: string;
    nombreProducto: string;
    unidadMedida: string;
    unidadesPorMedida: number;
}
