import { Link } from "react-router-dom";
import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";
const loginImg = "https://res.cloudinary.com/dtuiikffe/image/upload/v1753580809/register_qfrhbj.webp";
import { useForm } from "react-hook-form";
import { userApi } from "../features/api/userApi";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

type UserRegisterFormValues = {
  firstname: string;
  lastname: string;
  contactPhone: string;
  email: string;
  password: string;
};

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormValues>();

  const [registerUser, { isLoading }] = userApi.useRegisterUserMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: UserRegisterFormValues) => {
    const loadingToastId = toast.loading("Creating Account...");
    try {
      const res = await registerUser(data).unwrap();
      toast.success(res?.message || "Registration successful", {
        id: loadingToastId,
      });
      navigate("/login", {
        state: {
          email: data.email,
          password: data.password,
        },
        replace: true,
      });
    } catch (err: any) {
      toast.error(
        "Failed to Register: " +
          (err.data?.message || err.message || err.error || err)
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
          {/* Form Section */}
          <div className="flex items-center justify-center p-8">
            <form
              className="w-full max-w-md space-y-6 bg-white rounded-2xl p-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-green-600 mb-2">
                  Register
                </h2>
                <p className="text-gray-500">Create your account</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700" htmlFor="firstname">
                    First Name
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    placeholder="First Name"
                    {...register("firstname", { required: true })}
                    className="input input-bordered w-full mt-1"
                  />
                  {errors.firstname && (
                    <p className="text-red-600 text-sm">First name is required</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700" htmlFor="lastname">
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    placeholder="Last Name"
                    {...register("lastname", { required: true })}
                    className="input input-bordered w-full mt-1"
                  />
                  {errors.lastname && (
                    <p className="text-red-600 text-sm">Last name is required</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="contactPhone">
                  Contact Phone
                </label>
                <input
                  id="contactPhone"
                  type="text"
                  placeholder="+2547XXXXXXX"
                  {...register("contactPhone", { required: true })}
                  className="input input-bordered w-full mt-1"
                />
                {errors.contactPhone && (
                  <p className="text-red-600 text-sm">Phone is required</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                  className="input input-bordered w-full mt-1"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">Email is required</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                  className="input input-bordered w-full mt-1"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">Password is required</p>
                )}
              </div>

              <button
                type="submit"
                className="btn bg-info text-white border-none hover:bg-amber-500 transition-colors btn-block mt-4 shadow-md hover:scale-105"
              >
                {isLoading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <>Register</>
                )}
              </button>

              <div className="flex justify-between text-sm mt-4">
                <Link to="/" className="text-blue-500 hover:underline">
                  Home
                </Link>
                <Link to="/login" className="text-green-500 hover:underline">
                  Already have an account?
                </Link>
              </div>
            </form>
          </div>
          {/* Image Section */}
          <div className="hidden sm:block bg-gradient-to-tr from-blue-200 via-pink-100 to-white">
            <div className="h-full flex items-center justify-center p-6">
              <img
                src={loginImg}
                alt="Register"
                className="w-full h-auto max-w-[600px] rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
