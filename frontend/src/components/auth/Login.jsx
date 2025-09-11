import { useState } from "react";
import { Loader2 } from "lucide-react";
import useLogin from "../../hooks/useLogin";

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
    <div className="flex flex-col justify-center items-center h-[calc(100vh-8rem)]">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Login</legend>

          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoFocus
            required
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            required
          />

          <button type="submit" className="btn btn-neutral mt-4" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2" /> : "Login"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
