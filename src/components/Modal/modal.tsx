import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./modal.module.scss";

interface ModalPropsBase {
  children: ReactNode;
}

interface ModalProps extends ModalPropsBase {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
}

const ModalBase: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
}) => {
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

const Modal = Object.assign(ModalBase, {
  Header: ({ children }: ModalPropsBase) => (
    <div className={styles.modalHeader}>{children}</div>
  ),
  Body: ({ children }: ModalPropsBase) => (
    <div className={styles.modalBody}>{children}</div>
  ),
  Footer: ({ children }: ModalPropsBase) => (
    <div className={styles.modalFooter}>{children}</div>
  ),
});

export default Modal;
