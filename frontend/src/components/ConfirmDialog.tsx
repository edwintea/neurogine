import React from "react";

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmDialog({
                                          isOpen,
                                          title,
                                          message,
                                          confirmText = "Confirm",
                                          cancelText = "Cancel",
                                          isDanger = false,
                                          onConfirm,
                                          onClose,
                                      }: Props) {
    if (!isOpen) return null;

    return (
        <div style={backdropStyle}>
            <div className="card-container" style={{ maxWidth: "400px", width: "100%", margin: 0, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
                    {title}
                </h3>
                <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#4b5563", lineHeight: "1.5" }}>
                    {message}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-danger-sm"
                        style={{ backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", padding: "8px 16px", fontSize: "14px" }}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={isDanger ? "" : "btn-primary"}
                        style={
                            isDanger
                                ? { padding: "8px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }
                                : { padding: "8px 16px", height: "auto" }
                        }
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

const backdropStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(2px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
};