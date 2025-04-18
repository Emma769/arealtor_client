import { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { TbInfoTriangle } from "react-icons/tb";
import { Link } from "react-router";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Spinner from "../components/ui/Spinner";

type FetchState = "IDLE" | "FETCHING" | "FULFILL" | "FAIL";

export default function LogScreen() {
  const xapi = useAxiosPrivate();

  const [landlordTotal, setLandlordTotal] = useState(0);
  const [tenantTotal, setTenantTotal] = useState(0);
  const [fetchState, setFetchState] = useState<FetchState>("IDLE");

  useEffect(() => {
    const getLandlordTotal = async () => {
      const resp = await xapi.get("/api/landlords/count");
      const payload = resp.data;
      return payload;
    };
    const getTenantTotal = async () => {
      const resp = await xapi.get("/api/tenants/count");
      const payload = resp.data;
      return payload;
    };

    (async () => {
      setFetchState("FETCHING");

      try {
        const [landlordResult, tenantResult] = await Promise.all([
          getLandlordTotal(),
          getTenantTotal(),
        ]);
        setFetchState("FULFILL");
        setLandlordTotal(landlordResult?.total);
        setTenantTotal(tenantResult?.total);
      } catch (err) {
        setFetchState("FAIL");
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="h-[90vh]">
      <div className="mb-8">
        <p className="text-2xl font-semibold text-center">View Logs.</p>
      </div>
      {fetchState === "FETCHING" && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {fetchState === "FULFILL" && (
        <div className="py-5">
          <div className="sm:flex sm:gap-4">
            <div className="border border-gray-200 w-full shadow rounded h-72 my-4 flex flex-col">
              <div className="px-4 py-7">
                <p className="font-semibold text-sm capitalize opacity-85 flex items-center gap-x-1">
                  <span>landlord</span>
                  <TbInfoTriangle className="text-red-400" />
                </p>
              </div>
              <div className="p-4 mt-4 flex items-center gap-2">
                <span className="text-3xl font-semibold text-[#6c63ff]">
                  {landlordTotal}
                </span>
                <span className="font-semibold -translate-x-1 text-[#6c63ff]">
                  +
                </span>
                <small className="font-semibold inline-block opacity-65">
                  Total Landlords
                </small>
              </div>
              <div className="mt-auto w-full font-semibold text-xs px-4 flex justify-end items-center bg-[#e7e5ff] h-20">
                <Link to="/landlords" className="detail-link">
                  <span>Details</span>
                  <IoIosArrowRoundForward />
                </Link>
              </div>
            </div>
            <div className="border border-gray-200 w-full shadow rounded h-72 my-4 flex flex-col">
              <div className="px-4 py-7">
                <p className="font-semibold text-sm capitalize opacity-85 flex items-center gap-x-1">
                  <span>tenant</span>
                  <TbInfoTriangle className="text-red-400" />
                </p>
              </div>
              <div className="p-4 mt-4 flex items-center gap-2">
                <span className="text-3xl font-semibold text-[#6c63ff]">
                  {tenantTotal}
                </span>
                <span className="font-semibold -translate-x-1 text-[#6c63ff]">
                  +
                </span>
                <small className="font-semibold inline-block opacity-65">
                  Total Tenants
                </small>
              </div>
              <div className="mt-auto w-full font-semibold text-xs px-4 flex justify-end items-center bg-[#e7e5ff] h-20">
                <Link to="/tenants" className="detail-link">
                  <span>Details</span>
                  <IoIosArrowRoundForward />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
