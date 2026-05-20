import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { RegisterUsuarioUseCase } from '../RegisterUsuarioUseCase';
import { makeUsuarioRepositoryMock } from '../../../shared/test/mocks';
import { makeUsuario } from '../../../shared/test/factories';

jest.mock('bcrypt');
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

describe('RegisterUsuarioUseCase', () => {
  const usuarioRepo = makeUsuarioRepositoryMock();
  const useCase = new RegisterUsuarioUseCase(usuarioRepo);

  beforeEach(() => jest.clearAllMocks());

  const input = {
    nome: 'Dr. Novo',
    email: 'novo@afya.com',
    senha: 'senha123',
  };

  it('deve registrar usuário com sucesso', async () => {
    const usuario = makeUsuario({ email: 'novo@afya.com' });
    usuarioRepo.findByEmail.mockResolvedValue(null);
    (bcryptMock.hash as jest.Mock).mockResolvedValue('hashed_password');
    usuarioRepo.create.mockResolvedValue(usuario);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    const value = result.getValue() as any;
    expect(value.email).toBe(usuario.email);
    expect(value.senha).toBeUndefined();
    expect(bcryptMock.hash).toHaveBeenCalledWith('senha123', 10);
  });

  it('deve retornar Left 409 quando email já estiver cadastrado', async () => {
    usuarioRepo.findByEmail.mockResolvedValue(makeUsuario());

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(409);
    expect(usuarioRepo.create).not.toHaveBeenCalled();
  });
});
