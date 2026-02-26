export function LoginForm({ onSubmit, formData, handleChange, isPending }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <form className="py-22 px-12" onSubmit={onSubmit}>
            <div className="space-y-12">
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-base-content/70">Login to your account</p>
              </div>

              <div>
                <div className="space-y-2">
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    className="input input-bordered w-full"
                    value={formData?.email || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full"
                    value={formData?.password || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                {isPending ? "Loading..." : "Login"}
              </button>

     
            </div>
          </form>

          <div className="bg-base-200 relative hidden md:block">
            <img
              src="/LoginImage.webp"
              alt="Login illustration"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-base-content/60 px-6">
        By clicking continue, you agree to our{" "}
        <a href="#" className="link">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="link">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
