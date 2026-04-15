import { faker } from '@faker-js/faker/locale/pt_BR';

// CPFs válidos para testes (gerados e validados previamente)
const cpfsValidos = [
  '07719718500',
  '52998224725',
  '27508453708',
  '06087760079',
];

function gerarEmailUnico(base = 'candidato'): string {
  const timestamp = Date.now();
  return `${base}+${timestamp}@teste.com`;
}

function cpfAleatorio(): string {
  return cpfsValidos[Math.floor(Math.random() * cpfsValidos.length)];
}

export const dadosValidos = {
  cpf: '93359024036',
  nome: faker.person.firstName(),
  sobrenome: faker.person.lastName(),
  nomeSocial: faker.person.firstName(),
  email: gerarEmailUnico(),
  celular: '11' + faker.string.numeric(9),
  telefone: '11' + faker.string.numeric(8),
  cep: '01310100',              // CEP real: Av. Paulista – SP
  endereco: 'Avenida Paulista',
  complemento: `Apto ${faker.string.numeric(2)}`,
  bairro: 'Bela Vista',
  cidade: 'São Paulo',
  estado: 'SP',
  pais: 'Brasil',
};

export const dadosInvalidos = {
  email: 'joao@',
  telefone: '00000000000',
  cpf: '111.111.111-11',
  cepInexistente: '00000000',
  cepCurto: '1234',
  nomeIncompleto: 'Ana',
};

export const niveis = {
  graduacao: 'Graduação',
  posGraduacao: 'Pós-Graduação',
  tecnico: 'Técnico',
  extensao: 'Extensão',
};

export const cursos = {
  graduacao: 'Administração',
  posGraduacao: 'Especialização em Direito',
  tecnico: 'Técnico em Enfermagem',
}