export class OpenAnswer {
  public fecha: string
  public porcentaje: string
  public pregunta: string
  public respuesta: string
  public sesion: string

  constructor(fecha: string, porcentaje: string, pregunta: string, respuesta: string, sesion: string) {
    this.fecha = fecha;
    this.porcentaje = porcentaje;
    this.pregunta = respuesta;
    this.respuesta = respuesta;
    this.sesion = sesion;
  }
}
