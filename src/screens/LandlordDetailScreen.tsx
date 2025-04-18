import { useNavigate, useParams } from "react-router";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useRef, useState } from "react";
import {
  type PropertyInfo,
  type PropertyInfoParam,
  type LandlordDetail,
  propertyInfoParam,
} from "../schemas/landlord";
import Spinner from "../components/ui/Spinner";
import {
  formatNumber,
  genRandomID,
  getDateStr,
  getFullDateStr,
} from "../utils/funcs";
import { AnimatePresence } from "framer-motion";
import { RiDeleteBin7Line } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { MdContentCopy, MdOutlineNumbers } from "react-icons/md";
import { IoIosAddCircle, IoIosPricetag } from "react-icons/io";
import { FaRegAddressBook } from "react-icons/fa";
import { PiHouseBold } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { TbCurrencyNaira } from "react-icons/tb";
import { isAxiosError } from "axios";
import Modal from "../components/ui/Modal";
import { PROPERTY_TYPES } from "../constants/constants";
import { validate } from "../utils/validator";

type FetchState = "IDLE" | "LOADING" | "FULFILL" | "FAIL" | "SUBMITTING";

export default function LandlordDetailScreen() {
  const params = useParams();
  const navigate = useNavigate();

  const xapi = useAxiosPrivate();

  const [landlord, setLandlord] = useState<LandlordDetail>();
  const [fetchState, setFetchState] = useState<FetchState>("IDLE");
  const [error, setError] = useState("");

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleDeleteLandlord = async () => {
    try {
      await xapi.delete(`/api/landlords/${landlord?.landlordID}`);
      setShowDeleteConfirmation(false);
      navigate("/landlords");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getLandlord = async () => {
      setFetchState("LOADING");

      try {
        const resp = await xapi.get(`/api/landlords/${params.id}`);
        setFetchState("FULFILL");
        const payload = resp.data;
        setLandlord(payload);
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

    getLandlord();
  }, []);

  const handleCopy = async (value?: string) => {
    try {
      await navigator.clipboard.writeText(value || "");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showDeleteConfirmation && (
          <DeleteLandlordConfirmation
            handleClose={() => setShowDeleteConfirmation(false)}
            handleDeleteLandlord={handleDeleteLandlord}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddressForm && (
          <AddressForm
            handleClose={() => setShowAddressForm(false)}
            onSuccess={(info) => {
              if (landlord) {
                landlord.propertyInfo = [...landlord.propertyInfo, info];
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
        <div>
          {fetchState === "FULFILL" && landlord && (
            <>
              <div className="sm:flex sm:items-center sm:justify-between">
                <p className="font-semibold text-2xl capitalize text-center">{`${
                  landlord.firstName
                } ${landlord.lastName ?? ""}`}</p>
                <div className="text-xs sm:flex sm:items-center sm:justify-center gap-2">
                  <small className="font-semibold mr-3 opacity-65 text-center block my-3">
                    Added on {getDateStr(new Date(landlord.createdAt))}
                  </small>
                  <div className="flex gap-2 justify-center">
                    <button
                      className="bg-[#e7e5ff] text-[#6c63ff] p-2 rounded-xl font-semibold cursor-pointer flex items-center gap-1 transition-colors hover:bg-[#beb8ff]"
                      onClick={() => navigate("/landlords/new")}
                    >
                      <span>add new landlord</span>
                      <IoIosAddCircle />
                    </button>
                    <button
                      className="bg-red-100 text-red-600 p-2 rounded-xl font-semibold cursor-pointer flex items-center gap-1 transition-colors hover:bg-red-200"
                      onClick={() => setShowDeleteConfirmation(true)}
                    >
                      <span>delete landlord</span>
                      <RiDeleteBin7Line />
                    </button>
                  </div>
                </div>
              </div>
              <div className="my-5 border-t-1 border-gray-200 pt-[1.5em] sm:flex sm:justify-between">
                <div className="h-60 w-full">
                  <div className="flex justify-center items-center rounded sm:w-1/2 bg-gray-100 h-full">
                    <CiUser className="text-9xl" />
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
                      defaultValue={landlord.firstName}
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
                      defaultValue={landlord.lastName}
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
                      defaultValue={landlord.phone}
                    />
                    <button
                      className="cursor-pointer absolute bottom-0 right-1.5 top-[16px] h-fit"
                      onClick={() => handleCopy(landlord.phone)}
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
                      defaultValue={landlord.email}
                    />
                    <button
                      className="cursor-pointer absolute bottom-0 right-1.5 top-[16px] h-fit"
                      onClick={() => handleCopy(landlord.email)}
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
                    onClick={() => setShowAddressForm(true)}
                  >
                    <span>add another address</span>
                    <IoIosAddCircle className="text-[#6c63ff]" />
                  </button>
                </div>
                {landlord.propertyInfo.map((info) => {
                  return (
                    <PropertyInfoSummary info={info} key={genRandomID()} />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

type PropertyInfoSummaryProps = {
  info: PropertyInfo;
};

function PropertyInfoSummary({ info }: PropertyInfoSummaryProps) {
  return (
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
              <PiHouseBold />
              <span>Property Type</span>
            </p>
            <p className="font-semibold">
              {PROPERTY_TYPES[info.propertyType - 1]}
            </p>
          </div>
          <div className="py-4">
            <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
              <MdOutlineNumbers />
              <span>Flat Number</span>
            </p>
            <p className="font-semibold">{info.additionalInfo?.flatNo}</p>
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
              <span>End Date</span>
            </p>
            <p className="font-semibold">
              {getFullDateStr(new Date(info.endDate))}
            </p>
          </div>
          <div className="py-4">
            <p className="font-semibold mb-2 opacity-55 text-xs flex items-center gap-1">
              <IoIosPricetag />
              <span>Lease Price</span>
            </p>
            <p className="font-semibold flex items-center">
              <TbCurrencyNaira className="text-lg -translate-y-[.6px]" />
              <span>{formatNumber(info.leasePrice)}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 my-3"></div>
    </>
  );
}

type DeleteLandlordConfirmationProps = {
  handleClose: () => void;
  handleDeleteLandlord: () => Promise<any>;
};

function DeleteLandlordConfirmation({
  handleClose,
  handleDeleteLandlord,
}: DeleteLandlordConfirmationProps) {
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
            onClick={handleDeleteLandlord}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

type AddressFormProps = {
  handleClose: () => void;
  onSuccess: (propertyInfo: PropertyInfo) => void;
};

function AddressForm({ handleClose, onSuccess }: AddressFormProps) {
  const params = useParams();

  const xapi = useAxiosPrivate();

  const addressRef = useRef<HTMLTextAreaElement | null>(null);
  const propertyTypeRef = useRef<HTMLSelectElement | null>(null);
  const leasePriceRef = useRef<HTMLInputElement | null>(null);
  const leasePeriodRef = useRef<HTMLInputElement | null>(null);
  const startDateRef = useRef<HTMLInputElement | null>(null);

  const [fetchState, setFetchState] = useState<FetchState>("IDLE");

  const [address, setAddress] = useState("");
  const [propertyTypeStr, setPropertyTypeStr] = useState("");
  const [propertyType, setPropertyType] = useState(0);
  const [flatNo, setFlatNo] = useState("");
  const [leasePeriodStr, setLeasePeriodStr] = useState("");
  const [leasePeriod, setLeasePeriod] = useState(0);
  const [leasePriceStr, setLeasePriceStr] = useState("");
  const [leasePrice, setLeasePrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [validationErrors, setValidationErrors] = useState<
    Record<keyof PropertyInfoParam, string>
  >({
    address: "",
    propertyType: "",
    leasePeriod: "",
    leasePrice: "",
    startDate: "",
  });

  const handleLeasePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setLeasePeriodStr(parsed.toString());
      setLeasePeriod(parsed);

      if (startDate) {
        const date = new Date(startDate);
        date.setFullYear(date.getFullYear() + parsed);
        setEndDate(getDateStr(date));
      }

      return;
    }
    setLeasePeriodStr("");
  };

  const handleLeasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setLeasePriceStr(formatNumber(parsed));
      setLeasePrice(parsed);
      return;
    }
    setLeasePriceStr("");
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const date = new Date(value);
    date.setFullYear(date.getFullYear() + leasePeriod);
    setEndDate(getDateStr(date));
    setStartDate(value);
  };

  const handlePropertyTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    const parsed = parseInt(value);
    setPropertyTypeStr(value);
    if (!isNaN(parsed)) {
      setPropertyType(parsed);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationErrors({
      address: "",
      propertyType: "",
      leasePeriod: "",
      leasePrice: "",
      startDate: "",
    });

    const { errors } = validate<PropertyInfoParam>(
      {
        address,
        propertyType,
        leasePrice,
        leasePeriod,
        startDate,
      },
      propertyInfoParam
    );

    if (errors) {
      setValidationErrors(errors);

      for (const k in validationErrors) {
        if (k === "address" && errors[k]) {
          addressRef.current?.focus();
          break;
        }

        if (k === "propertyType" && errors[k]) {
          propertyTypeRef.current?.focus();
          break;
        }

        if (k === "leasePrice" && errors[k]) {
          leasePriceRef.current?.focus();
          break;
        }

        if (k === "leasePeriod" && errors[k]) {
          leasePeriodRef.current?.focus();
          break;
        }

        if (k === "startDate" && errors[k]) {
          startDateRef.current?.focus();
          break;
        }
      }

      return;
    }

    const additionalInfo: Record<string, any> = {};

    if (flatNo) {
      additionalInfo["flatNo"] = flatNo;
    }

    const data = {
      address,
      propertyType,
      leasePrice,
      leasePeriod,
      startDate,
      endDate,
      additionalInfo,
    };

    setFetchState("SUBMITTING");

    try {
      const resp = await xapi.put(`/api/landlords/${params.id}/info`, data);
      const payload = resp.data;
      setFetchState("FULFILL");
      onSuccess(payload);
      handleClose();
    } catch (err) {
      setFetchState("FAIL");
      console.error(err);
    }
  };

  return (
    <Modal handleClose={handleClose}>
      <div className="mb-5">
        <div>
          <p className="font-semibold text-center text-xl">Add New Address</p>
        </div>
        <form onSubmit={handleSubmit} className="text-sm">
          <div className="my-3">
            <label htmlFor="address_id" className="text-xs font-semibold">
              Property Address:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </label>
            <textarea
              id="address_id"
              className="border border-gray-200 outline-gray-300 bg-gray-100 rounded resize-none h-[5em] p-2 w-full"
              autoFocus
              placeholder="Enter Address"
              spellCheck="false"
              value={address}
              ref={addressRef}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
            {validationErrors.address && (
              <small className="text-red-400">
                {validationErrors.address}!
              </small>
            )}
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="w-full my-3">
              <label htmlFor="type_id" className="text-xs font-semibold">
                Property Type:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <select
                id="type_id"
                className="w-full border border-gray-200 bg-gray-100 outline-gray-300 p-[.57em] rounded cursor-pointer"
                value={propertyTypeStr}
                ref={propertyTypeRef}
                onChange={handlePropertyTypeChange}
              >
                <option>-- Select a Property Type --</option>
                {PROPERTY_TYPES.map((pt, i) => {
                  return (
                    <option value={i + 1} key={genRandomID()}>
                      {pt}
                    </option>
                  );
                })}
              </select>
              {validationErrors.propertyType && (
                <small className="text-red-400">
                  {validationErrors.propertyType}!
                </small>
              )}
            </div>
            <div className="w-full my-3">
              <label htmlFor="flatno_id" className="text-xs font-semibold">
                Flat Number:
              </label>
              <input
                type="number"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-[.6em] w-full"
                placeholder="Enter Flat Number"
                id="flatno_id"
                name="flatNo"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="w-full my-3">
              <label htmlFor="leaseprice_id" className="text-xs font-semibold">
                Lease Price:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="text"
                id="leaseprice_id"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
                placeholder="Enter Lease Price"
                ref={leasePriceRef}
                value={leasePriceStr}
                onChange={handleLeasePriceChange}
              />
              {validationErrors.leasePrice && (
                <small className="text-red-400">
                  {validationErrors.leasePrice}!
                </small>
              )}
            </div>
            <div className="w-full my-3">
              <label htmlFor="leaseperiod_id" className="text-xs font-semibold">
                Lease Period:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="text"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
                placeholder="Enter Lease Period"
                id="leaseperiod_id"
                ref={leasePeriodRef}
                value={leasePeriodStr}
                onChange={handleLeasePeriodChange}
              />
              {validationErrors.leasePeriod && (
                <small className="text-red-400">
                  {validationErrors.leasePeriod}!
                </small>
              )}
            </div>
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="w-full my-3">
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
                ref={startDateRef}
                value={startDate}
                onChange={handleStartDateChange}
              />
              {validationErrors.startDate && (
                <small className="text-red-400">
                  {validationErrors.startDate}!
                </small>
              )}
            </div>
            <div className="w-full my-3">
              <label htmlFor="end_date_id" className="text-xs font-semibold">
                End Date:
              </label>
              <input
                type="date"
                id="end_date_id"
                disabled
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full cursor-pointer"
                defaultValue={endDate}
              />
            </div>
          </div>
          <div className="mt-3">
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
