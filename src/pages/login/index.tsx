import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/atom/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atom/form"
import { Input } from "@/components/atom/input"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { getRequestToken, validateWithLogin, createSession, getGuestSession } from "@/services/apis/auth"

// Validasi menggunakan username, bukan email
const loginSchema = z.object({
    username: z.string().min(3, {
        message: "Please enter a valid username.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
})

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // Fungsi untuk submit form login dan create session
    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            setLoading(true)
            // Step 1: Dapatkan request token
            const requestToken = await getRequestToken();

            // Step 2: Validasi token dengan login (username dan password)
            const validatedToken = await validateWithLogin(values.username, values.password, requestToken);

            // Step 3: Buat session dengan request token yang sudah tervalidasi
            const sessionId = await createSession(validatedToken);

            // Step 4: Simpan session ID ke localStorage
            localStorage.setItem('session_id', sessionId);

            // Tampilkan notifikasi berhasil
            toast({
                title: "Login Successful",
                description: "Session ID: " + sessionId,
            });

            // Navigasi ke halaman beranda
            navigate('/');
        } catch (error) {
            // Tampilkan notifikasi error
            console.error('Error during login:', error);
            toast({
                title: "Error",
                description: "Failed to log in. Please check your credentials.",
                variant: "destructive",
            });
        } finally {
            setLoading(false)
        }
    };

    // Handle guest session login when button is clicked
    const handleGuestLogin = async () => {
        try {
            setLoading(true)
            const sessionId = await getGuestSession()
            localStorage.setItem('guest_session_id', sessionId) // Save the session ID in localStorage
            toast({
                title: "Guest Session Created",
                description: "Guest session ID: " + sessionId,
            })
            navigate('/')
        } catch (error) {
            console.error('Error creating guest session:', error)
            toast({
                title: "Error",
                description: "Failed to create guest session.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    console.log(loading)

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-secondary p-6 shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="mt-2 text-sm">
                        Please sign in to your account
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your_username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Your password should be at least 8 characters long.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Loading" : "Login"}
                        </Button>
                    </form>
                    {/* Button for Guest Session Login */}
                    <Button variant={"outline"} className="w-full" disabled={loading} onClick={handleGuestLogin}>
                        {loading ? "Loading" : "Continue as guest"}
                    </Button>
                </Form>
                <div className="mt-4 text-center text-sm">
                    <a href="#" className="text-primary hover:underline">
                        Forgot your password?
                    </a>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
