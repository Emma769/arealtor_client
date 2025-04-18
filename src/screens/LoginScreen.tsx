import LoginForm from "../components/LoginForm";

export default function LoginScreen() {
  return (
    <div className="h-[80vh] pt-14 sm:grid sm:grid-cols-2">
      <div className="hidden sm:block">
        <img src="house.svg" alt="house" />
      </div>
      <LoginForm />
    </div>
  );
}
