import Spinner from "./Spinner";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full grid items-center justify-center bg-gray-300 opacity-50">
      <Spinner />
    </div>
  );
}
