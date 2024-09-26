"use client"; // If you're using client components in Next.js

import Image from "next/image";
import Link from "next/link";
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios"; // Ensure axios is imported
import apis from "@/app/apis/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


export default function Page() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
        const response = await axios.post(apis.userLogin, {
            email: data.email,
            password: data.password,
        });

        // Check if response is successful
        if (response) {
            console.log("User ID:", response?.data?.user?._id);
            
            // Store token in cookies and user ID in local storage
            Cookies.set('token', response?.data?.token, { expires: 7 });
            localStorage.setItem("userId", response?.data?.user?._id);

            toast.success('Login successful');

            // Delay navigation to the user media page
            setTimeout(() => {
                router.push('/usermedia');
            }, 2000);
        }
    } catch (error) {
        console.error("Login error:", error);
        toast.error(error?.response?.data?.message || 'An error occurred during login');
    }
};

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center">
        <Card className="mx-auto max-w-sm mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Enter your information to log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email", { required: true })}
                  />
                  {errors.email && <span className='text-red-600'>Email is required</span>}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", { required: true })}
                  />
                  {errors.password && <span className='text-red-600'>Password is required</span>}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/Signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/assets/img/AcountLogin.png"
          alt="Image"
          width={1920}
          height={1080}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale p-4"
        />
      </div>
    </div>
  );
}
