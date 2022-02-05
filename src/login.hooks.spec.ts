import { renderHook } from '@testing-library/react-hooks';
import { Credential, User } from 'model';
import { act } from 'react-test-renderer';
import { useLogin } from './login.hooks';
import * as api from './api';

describe('useLogin specs', () => {
  it('should update credential when it calls setCredential', () => {
    // Arrange
    const newCredential: Credential = { name: 'admin', password: 'test' };

    // Act
    const { result } = renderHook(() => useLogin());
    act(() => result.current.setCredential(newCredential));

    // Assert
    expect(result.current.credential).toEqual(newCredential);
    expect(result.current.setCredential).toEqual(expect.any(Function));
  });

  it('should return user equals null and onLogin function', () => {
    // Act
    const { result } = renderHook(() => useLogin());

    // Assert
    expect(result.current.user).toBeNull();
    expect(result.current.onLogin).toEqual(expect.any(Function));
  });

  it('should update user when it send valid credentials using onLogin', async () => {
    // Arrange
    const adminUser: User = { email: 'admin@email.com', role: 'admin' };
    const loginStub = jest.spyOn(api, 'login').mockResolvedValue(adminUser);

    // Act
    const { result, waitForNextUpdate } = renderHook(() => useLogin());

    act(() => {
      result.current.onLogin();
    });

    await waitForNextUpdate();

    // Assert
    expect(loginStub).toHaveBeenCalled();
    expect(result.current.user).toEqual(adminUser);
  });
});
