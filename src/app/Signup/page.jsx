"use client";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import apis from "../apis/apis";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



export default function SignUp() {
  const router = useRouter();
  const { setValue, register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(apis.userSignup, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      setTimeout(() => {
        router.push('/login');
      }, 2200);
    } catch (error) {
      toast.error(error.response?.data?.message , {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm mt-20">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" {...register("firstName", { required: true })} />
                {errors.firstName && <span className='text-red-600'>This first name is required</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" {...register("lastName", { required: true })} />
                {errors.lastName && <span className='text-red-600'>This last name is required</span>}
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password", { required: true })} />
              {errors.password && <span className='text-red-600'>This password is required</span>}
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
