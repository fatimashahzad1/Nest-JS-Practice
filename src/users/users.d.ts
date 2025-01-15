interface User {
  name: string;
  email: string;
}

interface CreateUserResponse {
  success: string;
  message: string;
  statusCode: number;
  user: {
    name: string;
    email: string;
  };
}
