import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function MagicLogin() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/magic/${token}`)
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Invalid link");
        }
        return res.json();
      })
      .then(data => {
        const student = data.student;
        const sessionData = JSON.stringify(student);
        localStorage.setItem("pca_session", sessionData);
        setStatus("success");
        setTimeout(() => navigate(`/dashboard/${student.id}`), 1500);
      })
      .catch(err => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Signing you in…</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-800 font-bold text-lg">Welcome back!</p>
            <p className="text-gray-500 text-sm mt-1">Redirecting to your dashboard…</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-800 font-bold text-lg">Link expired or invalid</p>
            <p className="text-gray-500 text-sm mt-1">{errorMsg}</p>
            <button onClick={() => navigate("/login")} className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
