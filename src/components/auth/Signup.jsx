import { useState } from "react";
import { Link } from "react-router-dom";
import useSignUp from "../../hooks/useSignUp";

const Signup = () => {
  const { signUpMutation, isPending } = useSignUp();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPending) return;

    signUpMutation({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName
    });
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-8rem)] -translate-y-20">
      <motion.form
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
      >
        <legend className="fieldset-legend flex items-center justify-center">
          <h1 className="text-xl">Create your account</h1>
        </legend>

        <label className="label">Name</label>
        <input
          type="text"
          name="fullName"
          className="input"
          placeholder="Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          className="input"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          className="input"
          placeholder="•••••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-neutral mt-4" disabled={isPending}>
          {isPending ? "Signing up..." : "Signup"}
        </button>

        <div className="text-center">
          <p className="mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default Signup;