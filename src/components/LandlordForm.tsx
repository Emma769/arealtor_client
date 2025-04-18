import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Spinner from "./ui/Spinner";
import { validate } from "../utils/validator";
import { formatNumber, genRandomID, getDateStr } from "../utils/funcs";
import { type LandlordParam, landlordParamSchema } from "../schemas/landlord";
import { PROPERTY_TYPES } from "../constants/constants";

type FetchState = "IDLE" | "SUBMITTING" | "FULFILL" | "FAIL";

export default function LandlordForm() {
  const xapi = useAxiosPrivate();

  const navigate = useNavigate();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const leasePriceRef = useRef<HTMLInputElement>(null);
  const leasePeriodRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const propertyTypeRef = useRef<HTMLSelectElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [leasePriceStr, setLeasePriceStr] = useState("");
  const [leasePrice, setLeasePrice] = useState(0);
  const [leasePeriodStr, setLeasePeriodStr] = useState("");
  const [leasePeriod, setLeasePeriod] = useState(0);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [propertyTypeStr, setPropertyTypeStr] = useState("");
  const [propertyType, setPropertyType] = useState(0);
  const [address, setAddress] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const date = new Date(value);
    date.setFullYear(date.getFullYear() + leasePeriod);
    setEndDate(getDateStr(date));
    setStartDate(value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d{1,11}$/.test(value)) {
      setPhone(value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
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

  const handleFlatNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlatNo(e.target.value);
  };

  const [fetchState, setFetchState] = useState<FetchState>("IDLE");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<keyof LandlordParam, string>
  >({
    address: "",
    firstName: "",
    phone: "",
    propertyType: "",
    leasePeriod: "",
    leasePrice: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationErrors({
      address: "",
      firstName: "",
      phone: "",
      propertyType: "",
      leasePeriod: "",
      leasePrice: "",
      startDate: "",
      endDate: "",
    });

    const { errors } = validate<LandlordParam>(
      {
        firstName,
        phone,
        address,
        propertyType,
        leasePrice,
        leasePeriod,
        startDate,
        endDate,
      },
      landlordParamSchema
    );

    if (errors) {
      setValidationErrors(errors);

      for (const k in validationErrors) {
        if (k === "firstName" && errors[k]) {
          firstNameRef.current?.focus();
          break;
        }

        if (k === "phone" && errors[k]) {
          phoneRef.current?.focus();
          break;
        }

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

        if (k === "endDate" && errors[k]) {
          endDateRef.current?.focus();
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
      firstName,
      lastName,
      phone,
      email,
      address,
      propertyType,
      additionalInfo,
      leasePrice,
      leasePeriod,
      startDate,
      endDate,
    };

    setFetchState("SUBMITTING");

    try {
      const resp = await xapi.post("/api/landlords", data);
      setFetchState("FULFILL");
      const payload = resp.data;
      navigate(`/landlords/${payload.landlordID}`);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setLeasePeriodStr("");
      setLeasePeriod(0);
      setLeasePriceStr("");
      setLeasePrice(0);
      setPropertyTypeStr("");
      setPropertyType(0);
      setFlatNo("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.log(error);
      setFetchState("FAIL");
      if (isAxiosError(error)) {
        if (error.status === 422) {
          console.log(error.response?.data);
          return;
        }
        const message =
          error.response?.data?.error ||
          error.response?.data?.data ||
          error.message;
        setError(message);
        return;
      }
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("something went wrong");
    }
  };

  return (
    <div>
      <div className="text-center">
        <p className="text-2xl font-semibold mb-2">Register Investor.</p>
        {error && (
          <small className="text-xs text-red-400 capitalize">{error}!</small>
        )}
      </div>
      <form onSubmit={handleSubmit} className="text-sm pt-2">
        <div className="sm:flex sm:gap-2">
          <div className="w-full my-4">
            <label htmlFor="firstname_id" className="text-xs font-semibold">
              Firstname:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
              ref={firstNameRef}
              placeholder="Enter Firstname"
              id="firstname_id"
              autoFocus
              value={firstName}
              onChange={handleFirstNameChange}
            />
            {validationErrors && validationErrors.firstName && (
              <small className="text-red-400">
                {validationErrors.firstName}!
              </small>
            )}
          </div>
          <div className="w-full my-4">
            <label htmlFor="lastname_id" className="text-xs font-semibold">
              Lastname:
            </label>
            <input
              type="text"
              className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
              placeholder="Enter Lastname"
              id="lastname_id"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </div>
        </div>
        <div className="sm:flex sm:gap-2">
          <div className="w-full my-4">
            <label htmlFor="phone_id" className="text-xs font-semibold">
              Phone:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </label>
            <input
              type="tel"
              className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
              placeholder="Enter Phone"
              ref={phoneRef}
              id="phone_id"
              value={phone}
              onChange={handlePhoneChange}
            />
            {validationErrors && validationErrors.phone && (
              <small className="text-red-400">{validationErrors.phone}!</small>
            )}
          </div>
          <div className="w-full my-4">
            <label htmlFor="email_id" className="text-xs font-semibold">
              Email:
            </label>
            <input
              type="email"
              className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
              placeholder="Enter Email"
              id="email_id"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <div className="my-4">
          <label htmlFor="address_id" className="text-xs font-semibold">
            Property Address:
            <span className="text-red-400 inline-block translate-y-1">*</span>
          </label>
          <textarea
            id="address_id"
            className="border border-gray-200 outline-gray-300 bg-gray-100 rounded resize-none h-[5em] p-2 w-full"
            placeholder="Enter Address"
            spellCheck="false"
            ref={addressRef}
            value={address}
            onChange={handleAddressChange}
          ></textarea>
          {validationErrors && validationErrors.address && (
            <small className="text-red-400">{validationErrors.address}!</small>
          )}
        </div>
        <div className="sm:flex sm:gap-2">
          <div className="w-full my-4">
            <label htmlFor="type_id" className="text-xs font-semibold">
              Property Type:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </label>
            <select
              id="type_id"
              className="w-full border border-gray-200 bg-gray-100 outline-gray-300 p-[.57em] rounded cursor-pointer"
              ref={propertyTypeRef}
              value={propertyTypeStr}
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
            {validationErrors && validationErrors.propertyType && (
              <small className="text-red-400">
                {validationErrors.propertyType}!
              </small>
            )}
          </div>
          <div className="w-full my-4">
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
              onChange={handleFlatNoChange}
            />
          </div>
        </div>
        <div className="sm:flex sm:gap-2">
          <div className="w-full my-4">
            <label htmlFor="leaseprice_id" className="text-xs font-semibold">
              Lease Price:
              <span className="text-red-400 inline-block translate-y-1">*</span>
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
            {validationErrors && validationErrors.leasePrice && (
              <small className="text-red-400">
                {validationErrors.leasePrice}!
              </small>
            )}
          </div>
          <div className="w-full my-4">
            <label htmlFor="leaseperiod_id" className="text-xs font-semibold">
              Lease Period:
              <span className="text-red-400 inline-block translate-y-1">*</span>
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
            {validationErrors && validationErrors.leasePeriod && (
              <small className="text-red-400">
                {validationErrors.leasePeriod}!
              </small>
            )}
          </div>
        </div>
        <div className="sm:flex sm:gap-2">
          <div className="w-full my-4">
            <label htmlFor="start_date_id" className="text-xs font-semibold">
              Start Date:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </label>
            <input
              type="date"
              id="start_date_id"
              ref={startDateRef}
              value={startDate}
              onChange={handleStartDateChange}
              className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full cursor-pointer"
            />
            {validationErrors && validationErrors.startDate && (
              <small className="text-red-400">
                {validationErrors.startDate}!
              </small>
            )}
          </div>
          <div className="w-full my-4">
            <label htmlFor="end_date_id" className="text-xs font-semibold">
              End Date:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </label>
            <input
              type="date"
              id="end_date_id"
              ref={endDateRef}
              disabled
              defaultValue={endDate}
              className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full cursor-pointer"
            />
            {validationErrors && validationErrors.endDate && (
              <small className="text-red-400">
                {validationErrors.endDate}!
              </small>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            className="border border-[#6c63ff] flex items-center justify-center p-2 rounded cursor-pointer bg-[#6c63ff] w-[7em] hover:bg-[#3f3d56] hover:border-[#3f3d56] text-white font-semibold transition-colors"
            disabled={fetchState === "SUBMITTING"}
          >
            {fetchState === "SUBMITTING" ? <Spinner /> : <span>Register</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
