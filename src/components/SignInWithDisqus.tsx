import React from "react";

const SignInWithDisqus: React.FC = () => {
  const clientId = (import.meta as any).env.VITE_DISQUS_PUBLIC_KEY;
  const redirectUri = (import.meta as any).env.VITE_DISQUS_REDIRECT_URI;
  const scope = "read";
  const responseType = "code";

  const authUrl = `https://disqus.com/api/oauth/2.0/authorize/?client_id=${clientId}&scope=${scope}&response_type=${responseType}&redirect_uri=${redirectUri}`;

  const handleLogin = () => {
    window.open(authUrl, "_blank", "width=500,height=600");
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-disqus text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition"
    >
      Sign in with Disqus
    </button>
  );
};

export default SignInWithDisqus;
