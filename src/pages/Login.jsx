import { useState } from "react";
import useLogin from "../hooks/useLogin";
import { LoginForm } from "../components/LoginForm";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loginMutation, isPending } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginMutation({ email: formData.email, password: formData.password });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-base-200 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          onSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          isPending={isPending}
        />
      </div>
    </div>
  );
};

export default Login;
