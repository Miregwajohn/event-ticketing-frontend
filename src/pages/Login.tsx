import { Link, useNavigate } from "react-router-dom";
import  Footer  from "../component/common/Footer";
import  Navbar  from "../component/common/Navbar";
import loginImg from "../../src/assets/register.jpg";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { userApi } from "../features/api/userApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";


type UserLoginFormValues = {
  email: string;
  password: string;
};

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginFormValues>();

  const [loginUser, { isLoading }] = userApi.useLoginUserMutation();

  const onSubmit = async (data: UserLoginFormValues) => {
    const loadingToastId = toast.loading("Logging you in...");
    try {
      const res = await loginUser(data).unwrap();
      dispatch(setCredentials(res));
      toast.success(res?.message, { id: loadingToastId });

      if (res.userType === "admin") {
        navigate("/admindashboard/analytics");
      } else {
        navigate("/dashboard/me");
      }
    } catch (err: any) {
      toast.error(
        "Login failed: " + (err.data?.message || err.message || err.error || err)
      );
      toast.dismiss(loadingToastId);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center py-10">
        <div className="grid sm:grid-cols-2 gap-10 bg-white rounded-3xl overflow-hidden w-full max-w-5xl shadow-lg">
          {/* Image Section */}
          <div className="hidden sm:flex items-center justify-center bg-gradient-to-tr from-blue-200 via-pink-100 to-white">
            <img src={loginImg} alt="Login" width={400} className="rounded-2xl" />
          </div>

          {/* Form Section */}
          <div className="flex items-center justify-center p-8">
            <form
              className="w-full max-w-md space-y-6 bg-white rounded-2xl p-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-green-600 mb-2">Login</h2>
                <p className="text-gray-500">Welcome back to TicketKenya</p>
              </div>

              {/* Email */}
              <label className="block">
                <span className="text-gray-700">Email</span>
                <input
                  type="email"
                  className="input input-bordered border-2 w-full mt-1"
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-red-600 text-sm">Email is required</span>
                )}
              </label>

              {/* Password */}
              <label className="block">
                <span className="text-gray-700">Password</span>
                <input
                  type="password"
                  className="input input-bordered border-2 w-full mt-1"
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="text-red-600 text-sm">Password is required</span>
                )}
              </label>

              {/* Login Button */}
              <button
                type="submit"
  className="btn bg-info text-white border-none hover:bg-amber-600 transition-colors btn-block mt-4 shadow-md hover:scale-105"
              >
                {isLoading ? (
                  <span className="loading loading-spinner text-blue-500"></span>
                ) : (
                  <>
                    
                    Login
                  </>
                )}
              </button>

              {/* Additional Links */}
              <div className="flex justify-between text-sm mt-4">
                <Link to="/forgot-password" className="text-green-500 hover:underline">
                  Forgot Password?
                </Link>
                <Link to="/register" className="text-green-500 hover:underline">
                  Need an Account?
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-blue-500 hover:underline">
                   Go to Homepage
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <hr className="mt-6" />
      <Footer />
    </>
  );
};
