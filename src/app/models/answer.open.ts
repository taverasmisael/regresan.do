export class OpenAnswer {
  public $id: string
  public Total: string
  public Porcentaje: string
  public Respuesta: string
  public Pregunta: string
  public Fecha: string
  public Sesion: string

  constructor(id: string, Total: string, Porcentaje: string,
    Respuesta: string, Pregunta: string, Fecha: string, Sesion: string) {
    this.$id = id;
    this.Total = Total;
    this.Porcentaje = Porcentaje;
    this.Respuesta = Respuesta;
    this.Pregunta = Pregunta;
    this.Fecha = Fecha;
    this.Sesion = Sesion;
  }
}
