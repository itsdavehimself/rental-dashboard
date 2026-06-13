import { useParams, useNavigate } from "react-router";
import {
  getClientDetails,
  deleteAddressEntry,
} from "../services/clientService";
import { useToast } from "../../../hooks/useToast";
import { useState, useEffect } from "react";
import type { ErrorsState } from "../../../helpers/handleError";
import { handleError } from "../../../helpers/handleError";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { openModal, closeModal } from "../../../app/slices/uiSlice";
import AddModal from "../../../components/common/AddModal";
import EditModal from "../../../components/common/EditModal";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Plus,
  FileText,
  Clock,
  Trash2,
} from "lucide-react";
import ActionButton from "../../../components/common/ActionButton";
import ChipTag from "../../../components/common/ChipTag";
import { BaseAddressBookForm } from "../../Events/CreateEvent/components/AddressBookForm";
import EditClientNotes from "../../Events/CreateEvent/components/EditClientNotes";
import EditClientProfileForm from "../components/EditClientProfileForm";

export interface ClientAddressProfile {
  uid: string;
  label?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary: boolean;
}

export interface ClientDetail {
  uid: string;
  type: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  createdAt: string;
  isLegacy: boolean;
  billingAddresses: ClientAddressProfile[];
  deliveryAddresses: ClientAddressProfile[];
}

const ResidentialClientDetails: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Address Modal State Manager
  const [addressFormConfig, setAddressFormConfig] = useState<{
    mode: "add" | "edit";
    type: "billing" | "delivery";
    uid: string | null;
  } | null>(null);

  const handleClientFetch = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (uid) {
        const clientData = await getClientDetails(apiUrl, uid);
        setClient(clientData);
      }
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching this client's details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleClientFetch();
  }, [uid]);

  const handleDeleteAddress = async (addressUid: string) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      await deleteAddressEntry(apiUrl, addressUid);
      addToast("Success", "Address removed.");
      handleClientFetch();
    } catch (err: any) {
      console.error(err);
      addToast("Error", err.message || "Failed to delete address.");
    }
  };

  // --- UI HELPERS ---
  const formatPhone = (phone: string) => {
    if (!phone || phone.length !== 10) return phone;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  };

  const openAddressModal = (
    mode: "add" | "edit",
    type: "billing" | "delivery",
    uid: string | null = null,
  ) => {
    setAddressFormConfig({ mode, type, uid });
    dispatch(openModal("ADDRESS_FORM"));
  };

  const renderAddressCard = (
    addr: ClientAddressProfile,
    type: "billing" | "delivery",
  ) => (
    <div
      key={addr.uid}
      className="group flex justify-between gap-3 p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-sm font-semibold text-primary truncate">
              {type === "billing" ? "Billing" : "Delivery"}
            </p>

            {addr.isPrimary && <ChipTag label="Primary" color="blue" />}
          </div>

          <p className="text-sm text-gray-700 truncate mt-1">
            {addr.firstName} {addr.lastName}
          </p>

          <p className="text-xs text-gray-500 truncate">
            {addr.addressLine1}
            {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
          </p>

          <p className="text-xs text-gray-500 truncate">
            {addr.city}, {addr.state} {addr.zipCode}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {formatPhone(addr.phoneNumber)}
          </p>
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0  items-center">
        <button
          onClick={() => openAddressModal("edit", type, addr.uid)}
          className="p-2 text-gray-400 hover:text-primary cursor-pointer rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleDeleteAddress(addr.uid)}
          className="p-2 text-gray-400 hover:text-red-600 cursor-pointer rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (isLoading)
    return (
      <div className="p-8 flex justify-center text-gray-500">
        Loading client details...
      </div>
    );
  if (!client && !isLoading)
    return (
      <div className="p-8 flex justify-center text-gray-500">
        Client not found.
      </div>
    );

  return (
    <main className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6 overflow-hidden">
      {/* --- HEADER --- */}
      <section className="flex justify-between items-center bg-white">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/clients")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
            {client?.firstName.charAt(0)}
            {client?.lastName.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {client?.firstName} {client?.lastName}
              </h1>
              <ChipTag
                label={client?.type === 1 ? "Business" : "Residential"}
                color="blue"
              />
              {client?.isLegacy && <ChipTag label="Legacy" color="gray" />}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Customer since{" "}
                {new Date(client!.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <ActionButton
            label="Edit Profile"
            icon={Edit}
            style="filled"
            onClick={() => dispatch(openModal("EDIT_CLIENT_PROFILE"))}
          />
        </div>
      </section>
      {/* --- MAIN GRID --- */}
      {/* --- SUMMARY CARDS --- */}
      <section className="grid grid-cols-4 gap-3 shrink-0">
        <div className="border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Client Type
          </p>
          <p className="text-xl font-semibold text-primary mt-1">
            {client?.type === 1 ? "Business" : "Residential"}
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Addresses
          </p>
          <p className="text-xl font-semibold text-primary mt-1">
            {(client?.billingAddresses.length ?? 0) +
              (client?.deliveryAddresses.length ?? 0)}
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Total Rentals
          </p>
          <p className="text-xl font-semibold text-primary mt-1">0</p>
        </div>

        <div className="border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Lifetime Value
          </p>
          <p className="text-xl font-semibold text-primary mt-1">$0.00</p>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="grid grid-cols-[.9fr_1.15fr_.95fr] gap-6 min-h-0 flex-1">
        {/* Contact / Notes */}
        <div className="flex flex-col gap-6 min-h-0">
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-gray-800">
              Contact Information
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>

                <div className="flex flex-col min-w-0">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm font-medium text-primary truncate">
                    {client?.email || "No email provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>

                <div className="flex flex-col min-w-0">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {formatPhone(client?.phoneNumber || "") ||
                      "No phone provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 min-h-0 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Internal Notes
              </h3>

              <button
                onClick={() => dispatch(openModal("EDIT_CLIENT_NOTES"))}
                className="text-xs font-semibold text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                Edit Notes
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto pr-1">
              {client?.notes ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {client.notes}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  No internal notes have been added for this client.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4 min-h-0">
          <div className="flex justify-between items-center shrink-0">
            <h3 className="text-lg font-semibold text-gray-800">
              Address Book
            </h3>

            <div className="flex gap-2">
              <ActionButton
                label="Billing"
                icon={Plus}
                style="outline"
                onClick={() => openAddressModal("add", "billing")}
              />

              <ActionButton
                label="Delivery"
                icon={Plus}
                style="outline"
                onClick={() => openAddressModal("add", "delivery")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-0 overflow-y-auto pr-1">
            {client?.billingAddresses.map((addr) =>
              renderAddressCard(addr, "billing"),
            )}

            {client?.deliveryAddresses.map((addr) =>
              renderAddressCard(addr, "delivery"),
            )}

            {client?.billingAddresses.length === 0 &&
              client?.deliveryAddresses.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center text-sm text-gray-400 py-10">
                  <MapPin className="w-10 h-10 text-gray-300 mb-3" />
                  <p>No addresses saved for this client.</p>
                </div>
              )}
          </div>
        </div>

        {/* Activity / Future Functionality */}
        <aside className="flex flex-col gap-6 min-h-0">
          <div className="border border-gray-200 rounded-xl p-4 shrink-0">
            <button
              onClick={() => navigate(`/events/create?clientId=${client?.uid}`)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold text-sm">Create New Event</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col min-h-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-800 shrink-0">
              Rental History
            </h3>

            <div className="flex flex-col items-center justify-center text-center flex-1 opacity-60">
              <Clock className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">
                No rental history found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Past and upcoming events will appear here.
              </p>
            </div>
          </div>
        </aside>
      </section>
      {/* --- MODALS --- */}
      {activeModal === "ADDRESS_FORM" && addressFormConfig && (
        <AddModal
          title={`${addressFormConfig.mode === "add" ? "Add" : "Edit"} ${addressFormConfig.type.charAt(0).toUpperCase() + addressFormConfig.type.slice(1)} Address`}
          modalKey="ADDRESS_FORM"
          setErrors={setErrors}
        >
          <BaseAddressBookForm
            mode={addressFormConfig.mode}
            type={addressFormConfig.type}
            addressEntryUid={addressFormConfig.uid}
            client={client}
            onSuccess={() => {
              dispatch(closeModal());
              handleClientFetch();
            }}
          />
        </AddModal>
      )}
      {activeModal === "EDIT_CLIENT_NOTES" && (
        <EditModal>
          <EditClientNotes
            title="Edit Internal Notes"
            passedClient={client}
            onSuccess={(newNote) => {
              setClient((prev) => (prev ? { ...prev, notes: newNote } : prev));
              dispatch(closeModal());
            }}
          />
        </EditModal>
      )}
      {activeModal === "EDIT_CLIENT_PROFILE" && client && (
        <EditModal>
          <EditClientProfileForm
            client={client}
            onSuccess={(updatedClient) => {
              setClient((prev): ClientDetail | null => {
                if (!prev) return prev;

                return {
                  ...prev,
                  type: updatedClient.type,
                  firstName: updatedClient.firstName ?? prev.firstName,
                  lastName: updatedClient.lastName ?? prev.lastName,
                  email: updatedClient.email ?? prev.email,
                  phoneNumber: updatedClient.phoneNumber ?? prev.phoneNumber,
                  isLegacy: updatedClient.isLegacy ?? prev.isLegacy,
                };
              });
            }}
          />
        </EditModal>
      )}
    </main>
  );
};

export default ResidentialClientDetails;
