import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { LoginUsuarioUseCase } from '../LoginUsuarioUseCase';
import { makeUsuarioRepositoryMock, makeJwtServiceMock } from '../../../shared/test/mocks';
import { makeUsuario } from '../../../shared/test/factories';

jest.mock('bcrypt');
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

describe('LoginUsuarioUseCase', () => {
  const usuarioRepo = makeUsuarioRepositoryMock();
  const jwtService = makeJwtServiceMock();
  const useCase = new LoginUsuarioUseCase(usuarioRepo, jwtService);

  beforeEach(() => jest.clearAllMocks());

  const input = { email: 'teste@afya.com', senha: 'teste123' };

  it('deve retornar token quando credenciais forem válidas', async () => {
    usuarioRepo.findByEmail.mockResolvedValue(makeUsuario());
    (bcryptMock.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('jwt-token-gerado');

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    expect((result.getValue() as any).token).toBe('jwt-token-gerado');
    expect(jwtService.sign).toHaveBeenCalledWith({ email: 'teste@afya.com' });
  });

  it('deve retornar Left 401 quando usuário não for encontrado', async () => {
    usuarioRepo.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(401);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('deve retornar Left 401 quando a senha for inválida', async () => {
    usuarioRepo.findByEmail.mockResolvedValue(makeUsuario());
    (bcryptMock.compare as jest.Mock).mockResolvedValue(false);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(401);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
