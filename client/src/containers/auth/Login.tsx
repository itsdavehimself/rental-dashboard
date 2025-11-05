import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import SubmitButton from "../../components/common/SubmitButton";
import ValidatedInput from "../../components/common/ValidatedInput";
import { useAppDispatch } from "../../app/hooks";
import { fetchUser } from "../../app/slices/userSlice";
import loginTent from "../../assets/login_tent_edit.png";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

type Inputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    const subscription = watch(() => {
      if (error) setError(null);
    });
    return () => subscription.unsubscribe();
  }, [watch, error]);

  const onSubmit: SubmitHandler<Inputs> = async (data): Promise<void> => {
    if (!errors.email && !errors.password) {
      setError(null);
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        const message = Array.isArray(errorData)
          ? errorData.join(", ")
          : errorData?.message || "Login failed";
        setError(message);
        return;
      }

      setError(null);
      await dispatch(fetchUser());
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Network or server error:", err.message);
        setError("Something went wrong: " + err.message);
      } else {
        console.error("Unknown error:", err);
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white justify-center items-center gap-10 px-10">
      <img className="h-1/4 -mt-100" src={loginTent} alt="" />
      <div className="flex flex-col justify-center items-center gap-10 w-full p-10 rounded-xl sm:w-100 ring-1 ring-gray-200">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-text">AD Rentals</h1>
        </div>
        <form
          className="flex flex-col justify-center items-center w-full gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4 w-full">
            <ValidatedInput
              register={register("email", {
                required: "Please enter your email",
              })}
              error={errors.email}
              placeholder="Email"
              type="email"
            />
            <ValidatedInput
              register={register("password", {
                required: "Please enter your password",
              })}
              error={errors.password}
              placeholder="Password"
              type="password"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="self-start text-red-500 text-sm">
              {error === "Invalid credentials" ? (
                <p>Invalid credentials. Please try again.</p>
              ) : error ? (
                <div className="self-start text-red-500 text-sm space-y-1">
                  {error.split(",").map((msg, idx) => (
                    <p key={idx}>{msg.trim()}</p>
                  ))}
                </div>
              ) : errors.email?.message ? (
                <p>{errors.email.message}</p>
              ) : errors.password?.message ? (
                <p>{errors.password.message}</p>
              ) : null}
            </div>
            <SubmitButton label="Sign in" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
