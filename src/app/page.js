import GoogleButton from "@/components/ui/GoogleButton";
import Logo from "@/components/ui/Logo";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <header className="flex justify-between mx-10 my-5 max-w-screen-2xl">
        <Logo />
        <GoogleButton />
      </header>
      <main>
        <h1 className="text-5xl font-bold text-center my-28" style={{
          backgroundImage: "linear-gradient(90deg, #4a90e2, #a2de96)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}>
          Welcome to Document Hub <br />
          Effortless Collaboration for Teams
        </h1>
        <p className="text-2xl text-center mx-10" style={{
          WebkitTextStroke: "1px black",
          textStroke: "3px black",
          color: "white",
        }}>
          {"We transforms the way you work with documents. Whether you're part of a team or working solo, our platform makes collaboration smooth and intuitive. Manage, edit, and share your files with ease."}
        </p>

      </main>
    </div>
  );
}
