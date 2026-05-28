import LoginFormWithBg from "@/components/DataForm/login";

export default function Page() {
  return (
    <main
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-10 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.82), rgba(2,6,23,0.88)), url('/images/black-sport-car-dark-background-3d-render_68747-359.avif')",
      }}
    >
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-400/10 blur-3xl rounded-full"></div>

      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[3px]"></div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-6xl">
        <LoginFormWithBg />
      </div>
    </main>
  );
}