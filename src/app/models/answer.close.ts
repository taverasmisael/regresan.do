export class CloseAnswer {
  public $id: string
  public Total: number
  public Porcentaje: number
  public Pregunta: string
  public Respuesta: string
  public Respuestas: {
    $id: string,
    respuesta: string,
    usuario: string[]
  }
}
