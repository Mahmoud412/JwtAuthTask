class AuthError extends Error {
  code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

export default AuthError;
