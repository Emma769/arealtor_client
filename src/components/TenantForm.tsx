import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { useDropzone, FileWithPath } from "react-dropzone";
import { LuCloudUpload } from "react-icons/lu";
import {
  addDays,
  formatNumber,
  fst,
  genRandomID,
  getDateStr,
} from "../utils/funcs";
import type { Landlord } from "../schemas/landlord";
import Spinner from "./ui/Spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loading from "./ui/Loading";
import { validate } from "../utils/validator";
import { TenantParam, tenantParamSchema } from "../schemas/tenant";
import {
  MATURITY_DURATION,
  RENEWAL_DURATION,
  STATES,
  CLOUDINARY_KEY,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_URL,
} from "../constants/constants";

type FetchState = "IDLE" | "SUBMITTING" | "FAIL" | "FULFILL" | "LOADING";

export default function TenantForm() {
  const xapi = useAxiosPrivate();

  const navigate = useNavigate();

  const [dataUrl, setDataUrl] = useState<string | ArrayBuffer | null>(null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading produced an error");
      reader.onload = () => {
        const bin = reader.result;
        setDataUrl(bin);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
  });

  const uploadImage = async () => {
    const formdata = new FormData();
    formdata.append("file", acceptedFiles[0]);
    formdata.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formdata.append("api_key", CLOUDINARY_KEY);

    try {
      const resp = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formdata,
      });
      const payload = await resp.json();
      return payload.url;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const genderRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const nationalityRef = useRef<HTMLInputElement>(null);
  const stateOfOriginRef = useRef<HTMLSelectElement>(null);
  const occupationRef = useRef<HTMLInputElement>(null);
  const maritalStatusRef = useRef<HTMLInputElement>(null);
  const rentFeeRef = useRef<HTMLInputElement>(null);
  const landlordPhoneRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLSelectElement>(null);

  const [fetchState, setFetchState] = useState<FetchState>("IDLE");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [address, setAddress] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [noOfChildren, setNoOfChildren] = useState("");
  const [occupation, setOccupation] = useState("");
  const [employer, setEmployer] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [businessVenture, setBusinessVenture] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  const [startDate, setStartDate] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");

  const [found, setFound] = useState(false);
  const [landlordPhone, setLandlordPhone] = useState("");
  const [landlords, setLandlords] = useState<Landlord[]>([]);

  const [rentFeeStr, setRentFeeStr] = useState("");
  const [rentFee, setRentFee] = useState(0);

  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      headingRef.current?.scrollIntoView();
    }
  }, [error]);

  const [validationErrors, setValidationErrors] = useState<
    Record<keyof TenantParam, string>
  >({
    firstName: "",
    gender: "",
    dob: "",
    phone: "",
    nationality: "",
    stateOfOrigin: "",
    maritalStatus: "",
    occupation: "",
    rentFee: "",
    landlordPhone: "",
    address: "",
    startDate: "",
    maturityDate: "",
    renewalDate: "",
  });

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNationalityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNationality(e.target.value);
  };

  const handleLandlordPhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d{1,11}$/.test(value)) {
      setLandlordPhone(e.target.value);
    }
  };

  const handleStateOfOriginChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStateOfOrigin(e.target.value);
  };

  const getDateIntervals = (date: string) => {
    return [
      date,
      getDateStr(addDays(date, MATURITY_DURATION)),
      getDateStr(addDays(date, RENEWAL_DURATION)),
    ];
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddress(e.target.value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [start, maturity, renewal] = getDateIntervals(e.target.value);
    setRenewalDate(renewal);
    setMaturityDate(maturity);
    setStartDate(start);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d{1,11}$/.test(value)) {
      setPhone(value);
    }
  };

  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployer(e.target.value);
  };

  const handleOfficeAddressChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setOfficeAddress(e.target.value);
  };

  const handleBusinessAddressChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setBusinessAddress(e.target.value);
  };

  const handleBusinessVentureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBusinessVenture(e.target.value);
  };

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(e.target.value);
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDob(value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
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

  const handleMaritalStatusChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaritalStatus(e.target.value);
  };

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOccupation(e.target.value);
  };

  const handleNoOfChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoOfChildren(e.target.value);
  };

  const handleMaturityDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaturityDate(e.target.value);
  };

  const handleRenewalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRenewalDate(e.target.value);
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
    } finally {
      setFetchState("IDLE");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationErrors({
      firstName: "",
      gender: "",
      dob: "",
      phone: "",
      maritalStatus: "",
      landlordPhone: "",
      occupation: "",
      address: "",
      nationality: "",
      stateOfOrigin: "",
      startDate: "",
      maturityDate: "",
      renewalDate: "",
      rentFee: "",
    });

    const { errors } = validate<TenantParam>(
      {
        firstName,
        gender,
        dob,
        phone,
        nationality,
        stateOfOrigin,
        address,
        startDate,
        occupation,
        maritalStatus,
        maturityDate,
        renewalDate,
        landlordPhone,
        rentFee,
      },
      tenantParamSchema
    );

    if (errors) {
      setValidationErrors(errors);

      for (const k in validationErrors) {
        if (k === "firstName" && errors[k]) {
          firstNameRef.current?.focus();
          break;
        }
        if (k === "gender" && errors[k]) {
          genderRef.current?.focus();
          break;
        }
        if (k === "dob" && errors[k]) {
          dobRef.current?.focus();
          break;
        }
        if (k === "phone" && errors[k]) {
          phoneRef.current?.focus();
          break;
        }
        if (k === "nationality" && errors[k]) {
          nationalityRef.current?.focus();
          break;
        }
        if (k === "stateOfOrigin" && errors[k]) {
          stateOfOriginRef.current?.focus();
          break;
        }
        if (k === "occupation" && errors[k]) {
          occupationRef.current?.focus();
          break;
        }
        if (k === "maritalStatus" && errors[k]) {
          maritalStatusRef.current?.focus();
          break;
        }
        if (k === "rentFee" && errors[k]) {
          rentFeeRef.current?.focus();
          break;
        }
        if (k === "landlordPhone" && errors[k]) {
          landlordPhoneRef.current?.focus();
          break;
        }
        if (k === "address" && errors[k]) {
          addressRef.current?.focus();
          break;
        }
      }

      return;
    }

    if (!landlords.length) {
      return;
    }

    setFetchState("SUBMITTING");

    try {
      const additionalInfo: Record<string, any> = {
        maritalStatus,
      };

      if (businessVenture) {
        additionalInfo["businessVenture"] = businessVenture;
      }

      if (businessName) {
        additionalInfo["businessName"] = businessName;
      }

      if (businessAddress) {
        additionalInfo["businessAddress"] = businessAddress;
      }

      if (noOfChildren) {
        additionalInfo["noOfChildren"] = noOfChildren;
      }

      if (employer) {
        additionalInfo["employer"] = employer;
      }

      if (officeAddress) {
        additionalInfo["officeAddress"] = officeAddress;
      }

      const image = await uploadImage();
      const landlordID = fst(landlords).landlordID;

      const data = {
        firstName,
        lastName,
        gender,
        dob,
        email,
        phone,
        stateOfOrigin,
        nationality,
        occupation,
        additionalInfo,
        startDate,
        maturityDate,
        renewalDate,
        address,
        rentFee,
        image,
        landlordID,
      };

      const resp = await xapi.post("/api/tenants", data);
      setFetchState("FULFILL");
      const payload = resp.data;
      navigate(`/tenants/${payload.tenantID}`);
      setFirstName("");
      setLastName("");
      setGender("");
      setEmail("");
      setPhone("");
      setDob("");
      setStateOfOrigin("");
      setNationality("");
      setAddress("");
      setRentFeeStr("");
      setRentFee(0);
      setMaritalStatus("");
      setMaturityDate("");
      setRenewalDate("");
      setStartDate("");
      setEmployer("");
      setBusinessAddress("");
      setBusinessName("");
      setBusinessVenture("");
      setOccupation("");
      setOfficeAddress("");
      setNoOfChildren("");
      setLandlordPhone("");
    } catch (err) {
      console.error(err);
      setFetchState("FAIL");

      if (isAxiosError(err)) {
        if (err.status === 422) {
          console.log(err.response?.data);
          return;
        }
        const detail =
          err.response?.data?.error || err.response?.data?.data || err.message;
        setError(detail);
        return;
      }

      if (err instanceof Error) {
        setError(err.message);
        return;
      }

      setError("something went wrong");
    }
  };

  return (
    <>
      {fetchState === "LOADING" && <Loading />}
      <div>
        <div className="text-center" ref={headingRef}>
          <p className="text-2xl font-semibold mb-2">Register Tenant.</p>
          {error && (
            <div className="text-center my-0.5">
              <small className="text-xs text-red-400 capitalize">
                {error}!
              </small>
            </div>
          )}
        </div>
        <form className="text-sm pt-2" onSubmit={handleSubmit}>
          <div className="my-4 h-[10em] sm:h-[17em] sm:w-[17em] overflow-hidden">
            {dataUrl ? (
              <img
                src={dataUrl.toString()}
                alt="tenant image"
                className="aspect-auto border border-gray-200 rounded object-cover"
              />
            ) : (
              <div
                {...getRootProps()}
                className="border border-gray-200 text-gray-600 cursor-pointer p-2 h-[100%] w-full rounded flex items-center justify-center flex-col bg-gray-100"
              >
                <input {...getInputProps()} />
                <LuCloudUpload className="text-4xl" />
              </div>
            )}
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="my-4 w-full">
              <label htmlFor="firstname_id" className="text-xs font-semibold">
                Firstname:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="text"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
                id="firstname_id"
                placeholder="Enter Firstname"
                autoFocus
                ref={firstNameRef}
                value={firstName}
                onChange={handleFirstNameChange}
                autoComplete="off"
                spellCheck={false}
              />
              {validationErrors.firstName && (
                <small className="text-red-400">
                  {validationErrors.firstName}!
                </small>
              )}
            </div>
            <div className="my-4 w-full">
              <label htmlFor="lastname_id" className="text-xs font-semibold">
                Lastname:
              </label>
              <input
                type="text"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
                id="lastname_id"
                placeholder="Enter Lastname"
                value={lastName}
                onChange={handleLastNameChange}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
          <div className="my-4">
            <p className="pb-2 text-xs font-semibold">
              Gender:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </p>
            <label htmlFor="gender_male_id" className="pr-1">
              Male
            </label>
            <input
              type="radio"
              name="gender"
              id="gender_male_id"
              ref={genderRef}
              className="translate-y-0.5"
              defaultValue="male"
              onChange={handleGenderChange}
            />
            <label htmlFor="gender_female_id" className="ml-4 pr-1">
              Female
            </label>
            <input
              type="radio"
              name="gender"
              id="gender_female_id"
              ref={genderRef}
              className="translate-y-0.5"
              defaultValue="female"
              onChange={handleGenderChange}
            />
            <br />
            {validationErrors.gender && (
              <small className="text-red-400">{validationErrors.gender}!</small>
            )}
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="my-4 w-full">
              <label htmlFor="dob_id" className="text-xs font-semibold">
                Date of Birth:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="date"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full cursor-pointer"
                value={dob}
                ref={dobRef}
                id="dob_id"
                onChange={handleDobChange}
              />
              {validationErrors.dob && (
                <small className="text-red-400">{validationErrors.dob}!</small>
              )}
            </div>
            <div className="my-4 w-full">
              <label htmlFor="email_id" className="text-xs font-semibold">
                Email:
              </label>
              <input
                type="text"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
                id="email_id"
                placeholder="Enter Email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="my-4 w-full">
              <label htmlFor="phone_id" className="text-xs font-semibold">
                Phone:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="text"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-2 w-full"
                id="phone_id"
                placeholder="Enter Phone"
                value={phone}
                ref={phoneRef}
                onChange={handlePhoneChange}
                autoComplete="off"
              />
              {validationErrors.phone && (
                <small className="text-red-400">
                  {validationErrors.phone}!
                </small>
              )}
            </div>
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="my-4 w-full">
              <label htmlFor="nationality_id" className="text-xs font-semibold">
                Nationality:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="text"
                className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-[.6em] w-full"
                id="nationality_id"
                placeholder="Enter Nationality"
                value={nationality}
                ref={nationalityRef}
                onChange={handleNationalityChange}
              />
              {validationErrors.nationality && (
                <small className="text-red-400">
                  {validationErrors.nationality}!
                </small>
              )}
            </div>
            <div className="my-4 w-full">
              <label
                htmlFor="state_of_origin_id"
                className="text-xs font-semibold"
              >
                State of Origin:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <select
                id="state_of_origin_id"
                className="border border-gray-200 w-full p-[.57em] rounded bg-gray-100 outline-gray-300 cursor-pointer"
                value={stateOfOrigin}
                ref={stateOfOriginRef}
                onChange={handleStateOfOriginChange}
              >
                <option>-- Pick a State --</option>
                {STATES.map((state) => {
                  return (
                    <option value={state} key={genRandomID()}>
                      {state}
                    </option>
                  );
                })}
              </select>
              {validationErrors.stateOfOrigin && (
                <small className="text-red-400">
                  {validationErrors.stateOfOrigin}!
                </small>
              )}
            </div>
          </div>
          <div className="my-4">
            <p className="pb-2 text-xs font-semibold">
              Marital State:
              <span className="text-red-400 inline-block translate-y-1">*</span>
            </p>
            <label htmlFor="marital_status_married_id" className="pr-1">
              Married
            </label>
            <input
              type="radio"
              name="maritalStatus"
              className="translate-y-0.5"
              id="marital_status_married_id"
              ref={maritalStatusRef}
              defaultValue="married"
              onChange={handleMaritalStatusChange}
            />
            <label htmlFor="marital_status_single_id" className="ml-4 pr-1">
              Single
            </label>
            <input
              type="radio"
              name="maritalStatus"
              className="translate-y-0.5"
              ref={maritalStatusRef}
              defaultValue="single"
              id="marital_status_single_id"
              onChange={handleMaritalStatusChange}
            />
            <br />
            {validationErrors.maritalStatus && (
              <small className="text-red-400">
                {validationErrors.maritalStatus}!
              </small>
            )}
          </div>
          <div className="my-4 pt-3">
            <label
              htmlFor="no_of_children_id"
              className="text-xs font-semibold"
            >
              No. of Children (if any):
            </label>
            <input
              type="number"
              className="border border-gray-200 w-full p-2 bg-gray-100 rounded"
              id="no_of_children_id"
              placeholder="Enter No. of Children"
              name="noOfChildren"
              value={noOfChildren}
              onChange={handleNoOfChildrenChange}
            />
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="my-4 w-full">
              <label htmlFor="occupation_id" className="text-xs font-semibold">
                Occupation:
                <span className="text-red-400 inline-block translate-y-1">
                  *
                </span>
              </label>
              <input
                type="text"
                className="border border-gray-200 bg-gray-100 outline-gray-300 rounded p-2 w-full"
                placeholder="Enter Occupation"
                value={occupation}
                ref={occupationRef}
                onChange={handleOccupationChange}
                id="occupation_id"
              />
              {validationErrors.occupation && (
                <small className="text-red-400">
                  {validationErrors.occupation}!
                </small>
              )}
            </div>
            <div className="my-4 w-full">
              <label htmlFor="employer_id" className="text-xs font-semibold">
                Employer (if any):
              </label>
              <input
                type="text"
                className="border border-gray-200 bg-gray-100 outline-gray-300 rounded p-2 w-full"
                placeholder="Enter Employer"
                value={employer}
                onChange={handleEmployerChange}
                id="employer_id"
              />
            </div>
          </div>
          <div className="my-4">
            <label
              htmlFor="office_address_id"
              className="text-xs font-semibold"
            >
              Office Address (if applicable):
            </label>
            <textarea
              id="office_address_id"
              className="border border-gray-200 bg-gray-100 outline-gray-300 rounded p-2 w-full h-[5em] resize-none"
              spellCheck="false"
              placeholder="Enter Office Address"
              value={officeAddress}
              onChange={handleOfficeAddressChange}
            ></textarea>
          </div>
          <div className="sm:flex sm:gap-2">
            <div className="my-4 w-full">
              <label
                htmlFor="business_venture_id"
                className="text-xs font-semibold"
              >
                Business Venture (if applicable):
              </label>
              <input
                type="text"
                className="border border-gray-200 bg-gray-100 outline-gray-300 rounded p-2 w-full"
                value={businessVenture}
                onChange={handleBusinessVentureChange}
                placeholder="Enter Business Venture"
                id="business_venture_id"
              />
            </div>
            <div className="my-4 w-full">
              <label
                htmlFor="business_name_id"
                className="text-xs font-semibold"
              >
                Business Name (if applicable):
              </label>
              <input
                type="text"
                id="business_name_id"
                value={businessName}
                onChange={handleBusinessNameChange}
                placeholder="Enter Business Name"
                className="border border-gray-200 bg-gray-100 outline-gray-300 rounded p-2 w-full"
              />
            </div>
          </div>
          <div className="my-4">
            <label
              htmlFor="business_address_id"
              className="text-xs font-semibold"
            >
              Business Address (if applicable):
            </label>
            <textarea
              id="business_address_id"
              className="border border-gray-200 bg-gray-100 outline-gray-300 rounded p-2 w-full h-[5em] resize-none"
              spellCheck="false"
              value={businessAddress}
              onChange={handleBusinessAddressChange}
              placeholder="Enter Business Address"
            ></textarea>
          </div>
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
                ref={rentFeeRef}
                value={rentFeeStr}
                onChange={handleRentFeeChange}
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
                ref={landlordPhoneRef}
                autoComplete="off"
                value={landlordPhone}
                onChange={handleLandlordPhoneChange}
                onBlur={handleGetLandlord}
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
              ref={addressRef}
              value={address}
              onChange={handleAddressChange}
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
              className="border border-[#6c63ff] flex items-center justify-center p-2 rounded cursor-pointer bg-[#6c63ff] w-[7em] hover:bg-[#3f3d56] hover:border-[#3f3d56] text-white font-semibold transition-colors"
              disabled={fetchState === "SUBMITTING"}
            >
              {fetchState === "SUBMITTING" ? (
                <Spinner />
              ) : (
                <span>Register</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
