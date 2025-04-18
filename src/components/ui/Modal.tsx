import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";

type ModalProps = {
  handleClose: () => void;
} & React.PropsWithChildren;

export default function Modal({ children, handleClose }: ModalProps) {
  return createPortal(
    <Backdrop handleClose={handleClose}>{children}</Backdrop>,
    document.getElementById("alt-root")!
  );
}

type BackdropProps = {
  handleClose: () => void;
} & React.PropsWithChildren;

function Backdrop({ children, handleClose }: BackdropProps) {
  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="float-right cursor-pointer" onClick={handleClose}>
          <IoCloseSharp className="text-lg" />
        </button>
        <div className="mt-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}
