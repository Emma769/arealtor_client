import {
  HiOutlineMail,
  HiOutlineSave,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { TbInfoTriangle } from "react-icons/tb";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const wrapperVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.3,
      when: "beforeChildren",
    },
  },
};

const childVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HomeScreen() {
  const navigate = useNavigate();

  const goto = (path: string) => navigate(path);

  return (
    <motion.div
      variants={wrapperVariant}
      initial="hidden"
      animate="visible"
      className="pt-1 pb-10 sm:grid sm:grid-cols-2 sm:gap-x-4"
    >
      <motion.div
        variants={childVariant}
        className="h-96 rounded-xl my-2 bg-[#e2dbf9] p-8 flex flex-col justify-between"
      >
        <HiOutlineSave className="text-2xl" />
        <div>
          <p className="font-semibold text-xl">Register a Investor</p>
          <div className="mt-4">
            <TbInfoTriangle className="text-red-400" />
            <small className="text-[12px] opacity-85">
              Register a investor on the platform. Provide information relevant
              to a investor.
            </small>
          </div>
        </div>
        <button
          className="p-3 bg-[#3f3d56] text-white rounded-xl font-semibold cursor-pointer active:translate-y-[.9px]"
          onClick={() => goto("landlords/new")}
        >
          Register Investor
        </button>
      </motion.div>
      <motion.div
        variants={childVariant}
        className="h-96 rounded-xl my-2 bg-[#cff8cc] p-8 flex flex-col justify-between"
      >
        <HiOutlineSave className="text-2xl" />
        <div>
          <p className="font-semibold text-xl">Register a Tenant</p>
          <div className="mt-4">
            <TbInfoTriangle className="text-red-400" />
            <small className="text-[12px] opacity-85">
              Register a tenant on the platform. Provide information relevant to
              the tenant/occupant of registered property.
            </small>
          </div>
        </div>
        <button
          className="p-3 bg-[#3f3d56] text-white rounded-xl font-semibold cursor-pointer active:translate-y-[.9px]"
          onClick={() => goto("tenants/new")}
        >
          Register Tenant
        </button>
      </motion.div>
      <motion.div
        variants={childVariant}
        className="h-96 rounded-xl my-2 bg-[#f4cbcb] p-8 flex flex-col justify-between"
      >
        <HiOutlineViewGrid className="text-2xl" />
        <div>
          <p className="font-semibold text-xl">View Logs</p>
          <div className="mt-4">
            <TbInfoTriangle className="text-red-400" />
            <small className="text-[12px] opacity-85">
              View information log on registered properties with active
              occupants
            </small>
          </div>
        </div>
        <button
          className="p-3 bg-[#3f3d56] text-white rounded-xl font-semibold cursor-pointer active:translate-y-[.9px]"
          onClick={() => goto("logs")}
        >
          View Logs
        </button>
      </motion.div>
      <motion.div
        variants={childVariant}
        className="h-96 rounded-xl my-2 bg-[#cee6f9] p-8 flex flex-col justify-between"
      >
        <HiOutlineMail className="text-2xl" />
        <div>
          <p className="font-semibold text-xl">Send Alerts</p>
          <div className="mt-4">
            <TbInfoTriangle className="text-red-400" />
            <small className="text-[12px] opacity-85">
              Send reminder of rent/lease expiration to property occupants on
              and before the due date
            </small>
          </div>
        </div>
        <button
          className="p-3 bg-[#3f3d56] text-white rounded-xl font-semibold cursor-pointer active:translate-y-[.9px]"
          onClick={() => goto("alerts")}
        >
          Send Alerts
        </button>
      </motion.div>
    </motion.div>
  );
}
