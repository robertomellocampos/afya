export interface CreatePacienteDTO {
  nome: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  sexo: "M" | "F" | "O";
  peso: number;
}
