import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Spinner from "./ui/Spinner";
import { Tenant } from "../schemas/tenant";
import {
  formatNumber,
  genRandomID,
  getDaysBetween,
  isAfter,
} from "../utils/funcs";
import { Link, useSearchParams } from "react-router";
import { CgUser } from "react-icons/cg";
import { TbCurrencyNaira } from "react-icons/tb";
import { IoTodayOutline } from "react-icons/io5";
import { BiFilter } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import FilterForm from "./FilterForm";
import { MdLocationCity } from "react-icons/md";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

export function TenantList() {
  const [searchParams] = useSearchParams();
  const xapi = useAxiosPrivate();

  const page = useRef(1);

  const [showFilterForm, setShowFilterForm] = useState(false);

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const getTenants = async (page: number = 1) => {
    setLoading(true);

    const firstName = searchParams.get("name") || "";
    const phone = searchParams.get("phone") || "";
    const address = searchParams.get("address") || "";

    try {
      const resp = await xapi.get(
        `/api/tenants?page=${page}&first_name=${firstName}&phone=${phone}&address=${address}`
      );
      const payload = resp.data;
      setLoading(false);
      setTenants((prev) => [...prev, ...payload.data]);
      setHasNextPage(payload.metadata.hasNextPage);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenants();
  }, []);

  const lastTenantRef = useIntersectionObserver<HTMLDivElement>(() => {
    page.current++;

    if (hasNextPage) {
      getTenants(page.current);
    }
  }, [hasNextPage, !loading]);

  const handleDownloadXlsx = async () => {
    try {
      const resp = await xapi.get("/api/tenants/xlsx", {
        responseType: "blob",
      });

      const url = URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tenants.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  const checkRentExpiration = (tenant: Tenant) =>
    isAfter(new Date(), new Date(tenant.maturityDate)) &&
    !isAfter(new Date(), new Date(tenant.renewalDate))
      ? "warn"
      : isAfter(new Date(), new Date(tenant.renewalDate))
      ? "danger"
      : "valid";

  return (
    <>
      <>
        <div>
          <div className="flex justify-end gap-2">
            <button
              className="cursor-pointer transition-colors hover:text-[#6c63ff] hover:bg-[#e7e5ff] p-2 rounded-full"
              onClick={() => setShowFilterForm((prev) => !prev)}
            >
              <BiFilter className="text-xl" />
            </button>
            <button
              className="cursor-pointer transition-colors hover:text-[#6c63ff] hover:bg-[#e7e5ff] p-2 rounded-full"
              onClick={handleDownloadXlsx}
            >
              <HiOutlineDownload className="text-xl" />
            </button>
          </div>
          <FilterForm show={showFilterForm} />
        </div>
        {!tenants.length && !loading ? (
          <div className="font-semibold text-xl">No Tenants Registered!</div>
        ) : (
          <div className="md:grid md:grid-cols-3 md:gap-4 sm:grid sm:gap-4 sm:grid-cols-2 text-sm">
            {tenants.map((tenant, i, tenants) => {
              return (
                <div
                  key={genRandomID()}
                  className={`${"tenant-item"} ${checkRentExpiration(tenant)}`}
                  ref={tenants.length - 1 === i ? lastTenantRef : null}
                >
                  <TenantItem tenant={tenant} />
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </>
    </>
  );
}

type TenantItemProps = {
  tenant: Tenant;
};

function TenantItem({ tenant }: TenantItemProps) {
  return (
    <Link to={`/tenants/${tenant.tenantID}`}>
      <div className="h-full">
        <CgUser className="text-3xl text-gray-500" />
        <div className="my-5 flex items-center justify-between">
          <p className="font-semibold capitalize">
            {`${tenant.firstName} ${tenant?.lastName || ""}`}
          </p>
          <p className="text-[11px] opacity-55 font-semibold translate-y-[1.5px]">
            {tenant.phone}
          </p>
        </div>
        <div className="my-10">
          <p className="font-semibold text-3xl flex items-center">
            <TbCurrencyNaira className="text-4xl -translate-y-[.6px]" />
            <span>{formatNumber(tenant.rentFee)}</span>
          </p>
        </div>
        <div className="font-semibold flex justify-between items-center text-green-600">
          <div className="flex items-center gap-1">
            <span>
              {`${getDaysBetween(new Date(), new Date(tenant.renewalDate))}`}
            </span>
            <IoTodayOutline className="-translate-y-[1px]" />
          </div>
          <div>
            <MdLocationCity className="text-lg" title={tenant.address} />
          </div>
        </div>
        <div className="mt-12">
          <div className="flex justify-center">
            <div className="w-6 h-6 bg-[#baf8c8] relative">
              <small className="font-semibold absolute -top-4 -left-5">
                {new Date(tenant.startDate).getFullYear()}
              </small>
            </div>
            <div className="w-6 h-6 bg-[#b7fbc9]"></div>
            <div className="w-6 h-6 bg-[#88ea87]"></div>
            <div className="w-6 h-6 bg-[#e9d8fc]"></div>
            <div className="w-6 h-6 bg-[#e28fcb]"></div>
            <div className="w-6 h-6 bg-[#fefe91]"></div>
            <div className="w-6 h-6 bg-[#e9d8fb] relative">
              <small className="font-semibold absolute -top-4 left-5">
                {new Date(tenant.renewalDate).getFullYear()}
              </small>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
