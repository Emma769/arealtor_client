import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Spinner from "./ui/Spinner";
import { formatNumber, genRandomID } from "../utils/funcs";
import { Landlord } from "../schemas/landlord";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { BiFilter } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import { CgUser } from "react-icons/cg";
import { TbCurrencyNaira } from "react-icons/tb";
import { FaCaretUp } from "react-icons/fa";
import FilterForm from "./FilterForm";

export default function LandlordList() {
  const [searchParams] = useSearchParams();
  const xapi = useAxiosPrivate();

  const [showFilterForm, setShowFilterForm] = useState(false);

  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const page = useRef(1);

  const getLandlords = async (page: number = 1) => {
    setLoading(true);

    const firstName = searchParams.get("name") || "";
    const phone = searchParams.get("phone") || "";
    const address = searchParams.get("address") || "";

    try {
      const resp = await xapi.get(
        `/api/landlords?page=${page}&first_name=${firstName}&phone=${phone}&address=${address}`
      );
      const payload = resp.data;
      setLoading(false);
      setLandlords((prev) => [...prev, ...payload.data]);
      setHasNextPage(payload.metadata.hasNextPage);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    getLandlords();
  }, []);

  const lastLandlordRef = useIntersectionObserver<HTMLDivElement>(() => {
    page.current++;

    if (hasNextPage) {
      getLandlords(page.current);
    }
  }, [hasNextPage, !loading]);

  const handleDownloadXlsx = async () => {
    try {
      const resp = await xapi.get("/api/landlords/xlsx", {
        responseType: "blob",
      });

      const url = URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "landlords.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="my-5">
        <div>
          <div className="flex justify-end gap-2">
            <button
              className="cursor-pointer transition-colors hover:text-[#6c63ff] hover:bg-[#e7e5ff] p-2 rounded-full"
              onClick={() => setShowFilterForm((prev) => !prev)}
              title="filter"
            >
              <BiFilter className="text-xl" />
            </button>
            <button
              className="cursor-pointer transition-colors hover:text-[#6c63ff] hover:bg-[#e7e5ff] p-2 rounded-full"
              onClick={handleDownloadXlsx}
              title="download csv"
            >
              <HiOutlineDownload className="text-xl" />
            </button>
          </div>
          <FilterForm show={showFilterForm} />
        </div>
        <div>
          <>
            {!landlords.length && !loading ? (
              <div className="font-semibold text-xl mt-4">
                No Landlords Registered!
              </div>
            ) : (
              <div className="md:grid md:grid-cols-3 md:gap-4 sm:grid sm:gap-4 sm:grid-cols-2 text-sm">
                {landlords.map((landlord, i, landlords) => {
                  return (
                    <div
                      key={genRandomID()}
                      className="shadow-sm rounded h-80 p-3 bg-[#e7e5ff] my-4 hover:scale-105 transition-transform"
                      ref={landlords.length - 1 === i ? lastLandlordRef : null}
                    >
                      <LandlordItem landlord={landlord} />
                    </div>
                  );
                })}
              </div>
            )}
          </>
          {loading && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

type LandlordItemProps = {
  landlord: Landlord;
};

function LandlordItem({ landlord }: LandlordItemProps) {
  const timeElapsed =
    new Date(landlord.endDate).getFullYear() - new Date().getFullYear();

  return (
    <Link to={`/landlords/${landlord.landlordID}`}>
      <div className="h-full">
        <CgUser className="text-3xl text-gray-500" />
        <div className="my-5 flex items-center justify-between">
          <p className="font-semibold capitalize">
            {`${landlord.firstName} ${landlord?.lastName || ""}`}
          </p>
          <p className="text-[11px] opacity-55 font-semibold translate-y-[1.5px]">
            {landlord.phone}
          </p>
        </div>
        <div className="my-10">
          <p className="font-semibold text-3xl flex items-center">
            <TbCurrencyNaira className="text-4xl -translate-y-[.6px]" />
            <span>{formatNumber(landlord.leasePrice)}</span>
          </p>
        </div>
        <div className="font-semibold text-green-600 flex items-center">
          +{timeElapsed}
          <span>
            <FaCaretUp />
          </span>
        </div>
        <div className="mt-12">
          <div className="flex justify-between font-semibold">
            <small>{new Date(landlord.startDate).getFullYear()}</small>
            <small>{new Date(landlord.endDate).getFullYear()}</small>
          </div>
          <div className="flex justify-center">
            <div className="w-6 h-6 bg-[#baf8c8]"></div>
            <div className="w-6 h-6 bg-[#b7fbc9]"></div>
            <div className="w-6 h-6 bg-[#88ea87]"></div>
            <div className="w-6 h-6 bg-[#e9d8fc]"></div>
            <div className="w-6 h-6 bg-[#e28fcb]"></div>
            <div className="w-6 h-6 bg-[#fefe91]"></div>
            <div className="w-6 h-6 bg-[#e9d8fb]"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}
