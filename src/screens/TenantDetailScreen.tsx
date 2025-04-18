import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  RentInfo,
  RentInfoParam,
  rentInfoParamSchema,
  type TenantDetail,
} from "../schemas/tenant";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  addDays,
  formatNumber,
  genRandomID,
  getDateStr,
  getFullDateStr,
} from "../utils/funcs";
import { IoIosAddCircle, IoIosPricetag } from "react-icons/io";
import { RiDeleteBin7Line } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { MdContentCopy, MdOutlinePhoneIphone } from "react-icons/md";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import { AnimatePresence } from "framer-motion";
import { FaRegAddressBook } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { TbCurrencyNaira } from "react-icons/tb";
import { Landlord, LandlordDetail } from "../schemas/landlord";
import { PiUserFocusBold } from "react-icons/pi";
import { GrValidate } from "react-icons/gr";
import { isAxiosError } from "axios";
import { MATURITY_DURATION, RENEWAL_DURATION } from "../constants/constants";
import { validate } from "../utils/validator";

type FetchState = "IDLE" | "LOADING" | "FAIL" | "FULFILL" | "SUBMITTING";

export default function TenantDetailScreen() {
  const xapi = useAxiosPrivate();

  const params = useParams();
  const navigate = useNavigate();

  const [fetchState, setFetchState] = useState<FetchState>("IDLE");
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRentInfoForm, setShowRentInfoForm] = useState(false);

  const [tenant, setTenant] = useState<TenantDetail>();

  useEffect(() => {
    const getTenant = async () => {
      setFetchState("LOADING");
      try {
        const resp = await xapi.get(`/api/tenants/${params.id}`);
        setFetchState("FULFILL");
        setTenant(resp.data);
      } catch (err) {
        setFetchState("FAIL");
        console.error(err);

        if (isAxiosError(err)) {
          const detail =
            err.response?.data?.error ||
            err.response?.data?.data ||
            err.message;
          setError(detail);
          return;
        }

        if (err instanceof Error) {
          setError(err.message);
          return;
        }

        setError("Something went wrong");
      }
    };

    getTenant();
  }, []);

  const handleCopy = async (value?: string) => {
    try {
      await navigator.clipboard.writeText(value || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTenant = async () => {
    try {
      await xapi.delete(`/api/tenants/${tenant?.tenantID}`);
      setShowDeleteConfirmation(false);
      navigate("/tenants");
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenShowDeleteConfirm = () => setShowDeleteConfirmation(true);
  const handleOpenShowRentInfo = () => setShowRentInfoForm(true);

  return (
    <>
      <AnimatePresence>
        {showDeleteConfirmation && (
          <DeleteTenantConfirmation
            handleClose={() => setShowDeleteConfirmation(false)}
            handleDeleteTenant={handleDeleteTenant}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRentInfoForm && (
          <RentInfoForm
            handleClose={() => setShowRentInfoForm(false)}
            onSuccess={(info) => {
              if (tenant) {
                tenant.rentInfo = [...tenant.rentInfo, info];
              }
            }}
          />
        )}
      </AnimatePresence>
      <div className="mt-5">
        {fetchState === "FAIL" && (
          <div className="text-red-400 capitalize font-semibold">{error}!</div>
        )}
        {fetchState === "LOADING" && (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        )}
        {fetchState === "FULFILL" && tenant && (
          <>
            <div className="sm:flex sm:items-center sm:justify-between">
              <p className="font-semibold text-2xl capitalize text-center">{`${
                tenant.firstName
              } ${tenant.lastName ?? ""}`}</p>
              <div className="text-xs sm:flex sm:items-center sm:justify-center gap-2">
                <small className="font-semibold mr-3 opacity-65 text-center block my-3">
                  Added on {getDateStr(new Date(tenant.createdAt))}
                </small>
                <div className="flex gap-2 justify-center">
                  <button
                    className="btn-primary"
                    onClick={() => navigate("/tenants/new")}
                  >
                    <span>add new tenant</span>
                    <IoIosAddCircle />
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleOpenShowDeleteConfirm}
                  >
                    <span>delete tenant</span>
                    <RiDeleteBin7Line />
                  </button>
                </div>
              </div>
            </div>
            <div className="my-5 border-t-1 border-gray-200 pt-[1.5em] sm:flex sm:justify-between">
              <div className="h-60 w-full">
                <div className="flex justify-center items-center rounded sm:w-1/2 bg-gray-100 h-full overflow-hidden">
                  {tenant.image ? (
                    <img
                      src={tenant.image}
                      alt={`${tenant.firstName}'s profile picture`}
                    />
                  ) : (
                    <CiUser className="text-9xl" />
                  )}
                </div>
              </div>
              <div className="text-xs w-full mt-5">
                <div className="w-full relative mb-2">
                  <label className="font-semibold opacity-55 capitalize block h-0 translate-y-2 translate-x-3 text-[.8em]">
                    firstname
                  </label>
                  <input
                    type="text"
                    className="bg-gray-100 p-3 pb-2 pt-5 rounded w-full"
                    disabled
                    defaultValue={tenant.firstName}
                  />
                </div>
                <div className="w-full relative mb-2">
                  <label className="font-semibold opacity-55 capitalize h-0 block translate-y-2 translate-x-3 text-[.8em]">
                    lastname
                  </label>
                  <input
                    type="text"
                    className="bg-gray-100 p-3 pb-2 pt-5 rounded w-full"
                    disabled
                    defaultValue={tenant.lastName}
                  />
                </div>
                <div className="w-full relative mb-2">
                  <label className="font-semibold opacity-55 capitalize h-0 block translate-y-2 translate-x-3 text-[.8em]">
                    phone
                  </label>
                  <input
                    type="text"
                    className="bg-gray-100 p-3 pb-2 pt-5 rounded w-full"
                    disabled
                    defaultValue={tenant.phone}
                  />
                  <button
                    className="cursor-pointer absolute bottom-0 right-1.5 top-[16px] h-fit"
                    onClick={() => handleCopy(tenant.phone)}
                  >
                    <MdContentCopy className="text-gray-600" />
                  </button>
                </div>
                <div className="w-full relative mb-2">
                  <label className="font-semibold opacity-55 capitalize h-0 block translate-y-2 translate-x-3 text-[.8em]">
                    email
                  </label>
                  <input
                    type="text"
                    className="bg-gray-100 p-3 pb-2 pt-5 rounded w-full"
                    disabled
                    defaultValue={tenant.email}
                  />
                  <button
                    className="cursor-pointer absolute bottom-0 right-1.5 top-[16px] h-fit"
                    onClick={() => handleCopy(tenant.email)}
                  >
                    <MdContentCopy className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div className="flex justify-end text-xs">
                <button
                  className="bg-[#e7e5ff] text-[#6c63ff] flex items-center gap-1 py-2 px-3 font-semibold rounded-xl cursor-pointer transition-colors hover:bg-[#beb8ff]"
                  onClick={handleOpenShowRentInfo}
                >
                  <span>rent another property</span>
                  <IoIosAddCircle className="text-[#6c63ff]" />
                </button>
              </div>
              <RentInfoSummary info={tenant.rentInfo} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

type DeleteTenantConfirmationProps = {
  handleClose: () => void;
  handleDeleteTenant: () => Promise<void>;
};

function DeleteTenantConfirmation({
  handleClose,
  handleDeleteTenant,
}: DeleteTenantConfirmationProps) {
  return (
    <Modal handleClose={handleClose}>
      <div className="text-sm font-semibold text-center">
        Are you sure?
        <div className="mt-9 flex justify-center gap-4 text-xs">
          <button
            className="bg-red-200 text-red-600 px-3 py-2 rounded-xl cursor-pointer transition-colors hover:bg-red-300"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#e7e5ff] text-[#6c63ff] px-3 py-2 rounded-xl cursor-pointer transition-colors hover:bg-[#beb8ff]"
            onClick={handleDeleteTenant}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

type RentInfoFormProps = {
  handleClose: () => void;
  onSuccess: (rentInfo: RentInfo) => void;
};

function RentInfoForm({ handleClose, onSuccess }: RentInfoFormProps) {
  const params = useParams();

  const xapi = useAxiosPrivate();

  const [fetchState, setFetchState] = useState<FetchState>("IDLE");
  const [error, setError] = useState("");

  const [address, setAddress] = useState("");

  const [startDate, setStartDate] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");

  const [found, setFound] = useState(false);
  const [landlordPhone, setLandlordPhone] = useState("");
  const [landlords, setLandlords] = useState<Landlord[]>([]);

  const [rentFeeStr, setRentFeeStr] = useState("");
  const [rentFee, setRentFee] = useState(0);

  const [validationErrors, setValidationErrors] = useState<
    Record<keyof RentInfoParam, string>
  >({
    address: "",
    maturityDate: "",
    renewalDate: "",
    startDate: "",
    rentFee: "",
    landlordPhone: "",
  });

  const handleLandlordPhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d{1,11}$/.test(value)) {
      setLandlordPhone(e.target.value);
    }
  };

  const getDateIntervals = (date: string) => {
    return [
      date,
      getDateStr(addDays(date, MATURITY_DURATION)),
      getDateStr(addDays(date, RENEWAL_DURATION)),
    ];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [start, maturity, renewal] = getDateIntervals(e.target.value);
    setRenewalDate(renewal);
    setMaturityDate(maturity);
    setStartDate(start);
  };

  const handleMaturityDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaturityDate(e.target.value);
  };

  const handleRenewalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRenewalDate(e.target.value);
  };

  const handleRentFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setRentFeeStr(formatNumber(parsed));
      setRentFee(parsed);
      return;
    }
    setRentFeeStr("");
  };

  const handleChangeAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddress(e.target.value);
  };

  const handleGetLandlord = async () => {
    if (!landlordPhone) return;

    setFetchState("LOADING");
    try {
      const resp = await xapi.get(`/api/landlords?phone=${landlordPhone}`);
      const payload = resp.data;
      if (payload?.data.length > 0) {
        setFetchState("FULFILL");
        setLandlords(payload?.data);
        setFound(true);
        return;
      }
      throw new Error("No landlord found");
    } catch (error) {
      console.error(error);
      setFetchState("FAIL");
      if (isAxiosError(error)) {
        const detail =
          error.response?.data?.error ||
          error.response?.data?.data ||
          error.message;
        setError(detail);
        return;
      }
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("Something went wrong");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationErrors({
      address: "",
      startDate: "",
      maturityDate: "",
      renewalDate: "",
      landlordPhone: "",
      rentFee: "",
    });

    const { errors } = validate(
      { address, startDate, renewalDate, rentFee, maturityDate, landlordPhone },
      rentInfoParamSchema
    );

    if (errors) {
      setValidationErrors(errors);
      return;
    }

    const landlordID = landlords[0].landlordID;

    const data = {
      address,
      startDate,
      maturityDate,
      renewalDate,
      rentFee,
      landlordID,
    };

    setFetchState("SUBMITTING");

    try {
      const resp = await xapi.put(`/api/tenants/${params.id}/info`, data);
      setFetchState("FULFILL");
      const payload = resp.data;
      onSuccess(payload);
      handleClose();
    } catch (err) {
      console.error(err);
      setFetchState("FAIL");
    }
  };

  return (
    <Modal handleClose={handleClose}>
      <div className="mb-5">
        <div className="h-14">
          <p className="font-semibold text-center text-xl">
            Add Rent Information
          </p>
          <div className="grid place-content-center pt-2">
            {fetchState === "LOADING" && <Spinner />}
            {fetchState === "FAIL" && error && (
              <small className="text-red-400">{error}!</small>
            )}
          </div>
        </div>
        <form className="text-sm" onSubmit={handleSubmit}>
          <div className="sm:flex sm:gap-2">
            <div className="my-4 w-full">
              <label htmlFor="rent_price_id" className="text-xs font-semibold">
                Rent Price:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="text"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
                id="rent_price_id"
                autoComplete="off"
                placeholder="Enter Rent Price"
                value={rentFeeStr}
                onChange={handleRentFeeChange}
                autoFocus
              />
              {validationErrors.rentFee && (
                <small className="text-red-400">
                  {validationErrors.rentFee}!
                </small>
              )}
            </div>
            <div className="my-4 w-full">
              <label
                htmlFor="investor_phone_id"
                className="text-xs font-semibold"
              >
                Investor Phone:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="text"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
                id="investor_phone_id"
                placeholder="Enter Investor Phone"
                value={landlordPhone}
                onChange={handleLandlordPhoneChange}
                onBlur={handleGetLandlord}
                autoComplete="off"
              />
              {validationErrors.landlordPhone && (
                <small className="text-red-400">
                  {validationErrors.landlordPhone}!
                </small>
              )}
            </div>
          </div>
          <div className="my-4">
            <label htmlFor="street_id" className="text-xs font-semibold">
              Select Street:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </label>
            <select
              id="street_id"
              className="border border-gray-200 rounded p-2 bg-gray-100 w-full outline-gray-300 cursor-pointer"
              disabled={!found}
              value={address}
              onChange={handleChangeAddress}
            >
              <option>-- Pick an Address --</option>
              {landlords.map((landlord) => {
                return (
                  <option
                    value={`${landlord.address} ${
                      landlord.additionalInfo?.flatNo
                        ? "- Flat " + landlord.additionalInfo.flatNo
                        : ""
                    }`}
                    key={genRandomID()}
                  >
                    {`${landlord.address} ${
                      landlord.additionalInfo?.flatNo
                        ? "- Flat " + landlord.additionalInfo.flatNo
                        : ""
                    }`}
                  </option>
                );
              })}
            </select>
            {validationErrors.address && (
              <small className="text-red-400">
                {validationErrors.address}!
              </small>
            )}
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="my-4 w-full">
              <label htmlFor="start_date_id" className="text-xs font-semibold">
                Start Date:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="date"
                id="start_date_id"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full cursor-pointer"
                value={startDate}
                onChange={handleStartDateChange}
              />
              {validationErrors.startDate && (
                <small className="text-red-400">
                  {validationErrors.startDate}!
                </small>
              )}
            </div>
            <div className="my-4 w-full">
              <label
                htmlFor="maturity_date_id"
                className="text-xs font-semibold"
              >
                Maturity Date:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="date"
                id="maturity_date_id"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full cursor-pointer"
                value={maturityDate}
                onChange={handleMaturityDateChange}
              />
              {validationErrors.maturityDate && (
                <small className="text-red-400">
                  {validationErrors.maturityDate}!
                </small>
              )}
            </div>
            <div className="my-4 w-full">
              <label
                htmlFor="renewal_date_id"
                className="text-xs font-semibold"
              >
                Renewal Date:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="date"
                id="renewal_date_id"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full cursor-pointer"
                value={renewalDate}
                onChange={handleRenewalDateChange}
              />
              {validationErrors.renewalDate && (
                <small className="text-red-400">
                  {validationErrors.renewalDate}!
                </small>
              )}
            </div>
          </div>
          <div className="mt-4">
            <button
              className="bg-[#e7e5ff] text-[#6c63ff] w-20 px-3 py-2 font-semibold rounded-xl cursor-pointer transition-colors hover:bg-[#beb8ff] flex justify-center"
              disabled={fetchState === "SUBMITTING"}
            >
              {fetchState === "SUBMITTING" ? (
                <Spinner />
              ) : (
                <p className="flex items-center justify-center gap-1">
                  <span>Add</span>
                  <IoIosAddCircle className="text-lg" />
                </p>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

type RentInfoSummaryProps = {
  info: RentInfo[];
};

const RentInfoSummary = React.memo(({ info }: RentInfoSummaryProps) => {
  return info.map((rentInfo) => {
    return <RentInfoDetail info={rentInfo} key={genRandomID()} />;
  });
});

type RentInfoDetailProps = {
  info: RentInfo;
};

function RentInfoDetail({ info }: RentInfoDetailProps) {
  const xapi = useAxiosPrivate();

  const [fetchState, setFetchState] = useState<FetchState>("IDLE");
  const [landlord, setLandlord] = useState<LandlordDetail>();

  const getLandlordInfo = useCallback(async () => {
    setFetchState("LOADING");
    try {
      const resp = await xapi.get(`/api/landlords/${info.landlordID}`);
      setFetchState("FULFILL");
      const payload = resp.data;
      setLandlord(payload);
    } catch (err) {
      console.error(err);
      setFetchState("FAIL");
    }
  }, []);

  useEffect(() => {
    getLandlordInfo();
  }, []);

  const foundInfo = landlord?.propertyInfo.find(
    (i) => i.address === info.address.split("-")[0].trim()
  );

  return (
    <>
      {fetchState === "LOADING" && (
        <div className="flex items-center justify-center pt-5">
          <Spinner />
        </div>
      )}
      {fetchState === "FULFILL" && landlord && (
        <>
          <div className="text-sm flex justify-between mt-2">
            <div className="w-full pr-2">
              <div className="py-4">
                <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
                  <FaRegAddressBook />
                  <span>Address</span>
                </p>
                <p className="font-semibold">{info.address}</p>
              </div>
              <div className="py-4">
                <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
                  <PiUserFocusBold className="text-[16px]" />
                  <span>Property Investor</span>
                </p>
                <p className="font-semibold">{`${landlord?.firstName} ${
                  landlord?.lastName || ""
                }`}</p>
              </div>
              <div className="py-4">
                <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
                  <MdOutlinePhoneIphone className="text-[15px]" />
                  <span>Investor's Phone</span>
                </p>
                <p className="font-semibold">{landlord?.phone}</p>
              </div>
              <div className="py-4">
                <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
                  <GrValidate className="text-[15px]" />
                  <span>Validity Period</span>
                </p>
                <p className="font-semibold">
                  {new Date(foundInfo!.endDate).getFullYear() -
                    new Date().getFullYear()}{" "}
                  years
                </p>
              </div>
            </div>
            <div className="w-full border-l border-gray-200 pl-4">
              <div className="py-4">
                <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
                  <SlCalender />
                  <span>Start Date</span>
                </p>
                <p className="font-semibold">
                  {getFullDateStr(new Date(info.startDate))}
                </p>
              </div>
              <div className="py-4">
                <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
                  <SlCalender />
                  <span>Maturity Date</span>
                </p>
                <p className="font-semibold">
                  {getFullDateStr(new Date(info.maturityDate))}
                </p>
              </div>
              <div className="py-4">
                <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
                  <SlCalender />
                  <span>Renewal Date</span>
                </p>
                <p className="font-semibold">
                  {getFullDateStr(new Date(info.renewalDate))}
                </p>
              </div>
              <div className="py-4">
                <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
                  <IoIosPricetag />
                  <span>Rent Fee</span>
                </p>
                <p className="font-semibold flex items-center">
                  <TbCurrencyNaira className="text-lg -translate-y-[.6px]" />
                  <span>{formatNumber(info.rentFee)}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 my-3"></div>
        </>
      )}
    </>
  );
}
