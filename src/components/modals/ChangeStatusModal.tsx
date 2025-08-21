import Modal from "@/components/ui/Modal";
import { useState } from "react";

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string) => void;
  currentStatus: string;
  itemName: string;
  isLoading?: boolean;
}

export default function ChangeStatusModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  itemName,
  isLoading = false,
}: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statusOptions = [
    {
      value: "Ativa",
      label: "Ativa",
      color: "text-green-600 dark:text-green-400",
    },
    {
      value: "Inativa",
      label: "Inativa",
      color: "text-red-600 dark:text-red-400",
    },
    {
      value: "Pendente",
      label: "Pendente",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      value: "Suspensa",
      label: "Suspensa",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ativa":
        return (
          <svg
            className="h-5 w-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "Inativa":
        return (
          <svg
            className="h-5 w-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "Pendente":
        return (
          <svg
            className="h-5 w-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "Suspensa":
        return (
          <svg
            className="h-5 w-5 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alterar Status" size="sm">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Alterar status da empresa{" "}
            <span className="font-medium">&quot;{itemName}&quot;</span>
          </p>

          <div className="space-y-3">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                />
                <div className="flex items-center space-x-2">
                  {getStatusIcon(option.value)}
                  <span className={`text-sm font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || selectedStatus === currentStatus}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Alterando...</span>
              </div>
            ) : (
              "Confirmar Alteração"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
