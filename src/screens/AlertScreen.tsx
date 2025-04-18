import { GrAnnounce } from "react-icons/gr";

export default function AlertScreen() {
  return (
    <div className="flex items-center gap-2 justify-center mt-10">
      <GrAnnounce className="text-3xl" />
      <p className="text-3xl font-semibold">Coming Soon!</p>
    </div>
  );
}
