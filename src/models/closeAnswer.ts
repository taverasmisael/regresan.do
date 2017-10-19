export class CloseAnswer {
  constructor(
    public $id: string,
    public Total: number,
    public Porcentaje: number,
    public Pregunta: string,
    public Respuesta: string,
    public Respuestas: RespuestaType
  ) {}
}

type RespuestaType = {
  $id: string
  respuesta: string
  usuario: string[]
}
