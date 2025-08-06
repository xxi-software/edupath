import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  GraduationCap,
  UserSearch,
} from "lucide-react";

export function AuthForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:3000/api/users/createUser", registerData);
      console.log(response.data);
      setIsLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Error creating user");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EduPath</h1>
          <p className="text-gray-600 mt-2">Tu camino hacia el aprendizaje</p>
        </div>

        {/* Formularios de autenticación */}
        <Card className="shadow-lg border-green-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-green-700">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-center">
              Accede a tu cuenta o crea una nueva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              {/* Formulario de inicio de sesión */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmitLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Tu contraseña"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </TabsContent>

              {/* Formulario de registro */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSubmitRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <div className="flex flex-col space-y-4">
                      {/* Opción 1: Rol de Estudiante */}
                      <label
                        htmlFor="student-role"
                        className="flex cursor-pointer items-center space-x-3 rounded-md border p-4 transition-all hover:bg-gray-50"
                      >
                        <GraduationCap className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Estudiante</h3>
                          <p className="text-sm text-gray-500">
                            Acceso a cursos y material de estudio.
                          </p>
                        </div>
                        <Input
                          // id="student-role"
                          name="role"
                          type="radio"
                          value="student"
                          checked={registerData.role === "student"}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              role: e.target.value,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>

                      {/* Opción 2: Rol de Profesor */}
                      <label
                        htmlFor="teacher-role"
                        className="flex cursor-pointer items-center space-x-3 rounded-md border p-4 transition-all hover:bg-gray-50"
                      >
                        <UserSearch className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Profesor</h3>
                          <p className="text-sm text-gray-500">
                            Crea y gestiona tus propios cursos.
                          </p>
                        </div>
                        <Input
                          id="teacher-role"
                          name="role"
                          type="radio"
                          value="teacher"
                          checked={registerData.role === "teacher"}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              role: e.target.value,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Crea una contraseña"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirmar contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirma tu contraseña"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Al registrarte, aceptas nuestros{" "}
                    <a href="#" className="text-green-600 hover:text-green-700">
                      términos y condiciones
                    </a>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Pie de página */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © 2025 EduPath. Transformando la educación digital.
        </div>
      </div>
    </div>
  );
}
