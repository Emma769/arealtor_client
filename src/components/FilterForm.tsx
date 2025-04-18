import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

type FilterFormProps = {
  show: boolean;
};

export default function FilterForm({ show }: FilterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [showFirstNameClearBtn, setShowFirstNameClearBtn] = useState(false);
  const [phone, setPhone] = useState("");
  const [showPhoneClearBtn, setShowPhoneClearBtn] = useState(false);
  const [address, setAddress] = useState("");
  const [showAddressClearBtn, setShowAddressClearBtn] = useState(false);

  const firstNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (show) {
      firstNameRef.current?.focus();
    }
  }, [show]);

  useEffect(() => {
    if (firstName) {
      setShowFirstNameClearBtn(true);
    } else {
      setShowFirstNameClearBtn(false);
    }
  }, [firstName]);

  useEffect(() => {
    if (phone) {
      setShowPhoneClearBtn(true);
    } else {
      setShowPhoneClearBtn(false);
    }
  }, [phone]);

  useEffect(() => {
    if (address) {
      setShowAddressClearBtn(true);
    } else {
      setShowAddressClearBtn(false);
    }
  }, [address]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d{1,11}$/.test(value)) {
      setPhone(value);
    }
  };

  return (
    <div className={`filter-form ${show ? "show-form" : "hide-form"}`}>
      <div className="my-1">
        <form className="text-xs sm:flex sm:gap-2">
          <div className="relative w-full">
            <label htmlFor="name_id" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded p-3 bg-gray-100 px-8 outline-gray-300 w-full"
              placeholder="Search"
              ref={firstNameRef}
              id="name_id"
              name="name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <IoSearchOutline className="text-xl absolute top-7 left-3 text-gray-400" />
            {showFirstNameClearBtn && (
              <button
                tabIndex={1}
                className="cursor-pointer"
                type="button"
                onClick={() => setFirstName("")}
              >
                <MdOutlineCancel className="text-sm absolute top-[30px] hover:text-gray-600 transition-colors right-3 text-gray-500" />
              </button>
            )}
          </div>
          <div className="relative w-full">
            <label htmlFor="phone_id" className="font-semibold">
              Phone
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded p-3 bg-gray-100 pl-8 outline-gray-300 w-full"
              placeholder="Search"
              id="phone_id"
              value={phone}
              onChange={handlePhoneChange}
              name="phone"
            />
            <IoSearchOutline className="text-xl absolute top-7 left-3 text-gray-400" />
            {showPhoneClearBtn && (
              <button
                tabIndex={1}
                className="cursor-pointer"
                onClick={() => setPhone("")}
                type="button"
              >
                <MdOutlineCancel className="text-sm absolute top-[30px] hover:text-gray-600 transition-colors right-3 text-gray-500" />
              </button>
            )}
          </div>
          <div className="relative w-full">
            <label htmlFor="address_id" className="font-semibold">
              Address
            </label>
            <input
              type="text"
              id="address_id"
              className="border border-gray-200 rounded p-3 bg-gray-100 pl-8 outline-gray-300 w-full"
              placeholder="Search"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <IoSearchOutline className="text-xl absolute top-7 left-3 text-gray-400" />
            {showAddressClearBtn && (
              <button
                tabIndex={1}
                className="cursor-pointer"
                type="button"
                onClick={() => setAddress("")}
              >
                <MdOutlineCancel className="text-sm absolute top-[30px] hover:text-gray-600 transition-colors right-3 text-gray-500" />
              </button>
            )}
          </div>
          <button type="submit"></button>
        </form>
      </div>
    </div>
  );
}
