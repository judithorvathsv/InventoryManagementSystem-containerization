import { NavLink } from "react-router-dom";
import storage from "../../public/images/storage.jpg";
const Login = () => {
  return (
    <article className="flex max-h-screen">
      <img
        src={storage}
        alt="storage image"
        className="hidden md:block w-1/2 lg:w-1/2 h-[calc(100vh-5.5rem)] object-cover p-1"
      />

      <article className="flex flex-col items-center justify-center w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
        <h2 className="mb-4 text-center title">Login</h2>

        <section className="flex flex-col mb-4 w-full items-center">
          <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col">
            <label className="text-left label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="input input-bordered flex items-center gap-2 w-full"
            />
          </div>
        </section>

        <section className="flex flex-col mb-4 w-full items-center">
          <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col">
            <label className="text-left label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input input-bordered flex items-center gap-2 w-full"
            />
          </div>
        </section>
        <NavLink className="mt-4 blue-button all-button" to="/products">
          Login
        </NavLink>
      </article>
    </article>
  );
};

export default Login;
