import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Save,
  PackagePlus,
  PackageMinus,
  Camera,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { openModal, closeModal } from "../../../app/slices/uiSlice";
import { useToast } from "../../../hooks/useToast";
import ActionButton from "../../../components/common/ActionButton";
import ItemInfoCard from "./components/ItemInfoCard";
import ItemLedger from "./components/ItemLedger";
import AddModal from "../../../components/common/AddModal";
import type { ErrorsState } from "../../../helpers/handleError";
import InventoryRetirementForm from "../components/InventoryRetirementForm";
import { type RetirementInput } from "../components/InventoryRetirementForm";
import InventoryPurchaseForm from "../components/InventoryPurchaseForm";
import { type InventoryPurchaseInput } from "../components/InventoryPurchaseForm";
import type { InventoryItemDetails } from "../types/InventoryItem";
import ChipTag from "../../../components/common/ChipTag";
import ItemComponentsList from "./components/ItemComponentsList";
import InventoryComponentForm, {
  type InventoryComponentInput,
} from "../components/InventoryComponentForm";

export type UpdateItemInput = {
  description: string;
  unitPrice: number;
  length: string | number;
  width: string | number;
  height: string | number;
  notes: string;
  variant: string;
};

const ItemDetails: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const [errors, setErrors] = useState<ErrorsState>(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const activeModal = useAppSelector((state) => state.ui.activeModal);

  const [item, setItem] = useState<InventoryItemDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form here so the Save button can access it
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<UpdateItemInput>();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!uid) return;
      try {
        setIsLoading(true);
        const response = await fetch(`${apiUrl}/api/Inventory/${uid}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch item details");

        const data = await response.json();
        setItem(data);

        // Populate the form fields with the fetched data
        reset({
          description: data.description || "",
          unitPrice: data.unitPrice || 0,
          length: data.length || "",
          width: data.width || "",
          height: data.height || "",
          notes: data.notes || "",
          variant: data.variant || "",
        });
      } catch (err: any) {
        console.error(err);
        addToast("Error", "Could not load item details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [uid, apiUrl, addToast, reset]);

  // --- SAVE INFO HANDLER ---
  const handleUpdateItemInfo = async (data: UpdateItemInput) => {
    try {
      // Safely parse empty strings/NaN back to nulls for C# decimals
      const payload = {
        description: data.description,
        unitPrice: data.unitPrice ? Number(data.unitPrice) : 0,
        length:
          data.length === "" || Number.isNaN(Number(data.length))
            ? null
            : Number(data.length),
        width:
          data.width === "" || Number.isNaN(Number(data.width))
            ? null
            : Number(data.width),
        height:
          data.height === "" || Number.isNaN(Number(data.height))
            ? null
            : Number(data.height),
        notes: data.notes,
        variant: data.variant,
      };

      const response = await fetch(`${apiUrl}/api/Inventory/${uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update item");

      // Update the local state so the Header Title instantly updates if changed
      setItem((prev) => (prev ? { ...prev, ...payload } : null));
      addToast("Success", "Item updated successfully.");
    } catch (err) {
      console.error(err);
      addToast("Error", "Failed to update item details.");
    }
  };

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File ready for upload:", file);
    }
  };

  // --- LEDGER API CALLS ---
  const handleRetirement = async (data: RetirementInput) => {
    try {
      const response = await fetch(`${apiUrl}/api/Inventory/${uid}/retire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to record retirement");
      const newRetirement = await response.json();

      setItem((prev) =>
        prev
          ? { ...prev, retirements: [...prev.retirements, newRetirement] }
          : null,
      );
      dispatch(closeModal());
      addToast("Success", "Stock retired successfully.");
    } catch (err) {
      console.error(err);
      addToast("Error", "Failed to retire stock.");
    }
  };

  const handlePurchase = async (data: InventoryPurchaseInput) => {
    try {
      const response = await fetch(`${apiUrl}/api/Inventory/${uid}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to record purchase");
      const newPurchase = await response.json();

      setItem((prev) =>
        prev ? { ...prev, purchases: [...prev.purchases, newPurchase] } : null,
      );
      dispatch(closeModal());
      addToast("Success", "Purchase recorded successfully.");
    } catch (err) {
      console.error(err);
      addToast("Error", "Failed to record purchase.");
    }
  };

  // --- COMPONENT (BOM) API CALLS ---
  const handleAddComponent = async (data: InventoryComponentInput) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/Inventory/${uid}/components`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to link component");
      }

      const newComponent = await response.json();

      setItem((prev) =>
        prev
          ? { ...prev, components: [...prev.components, newComponent] }
          : null,
      );
      dispatch(closeModal());
      addToast("Success", "Component linked successfully.");
    } catch (err: any) {
      console.error(err);
      addToast("Error", err.message || "Failed to link component.");
    }
  };

  const handleRemoveComponent = async (componentId: number) => {
    if (!window.confirm("Are you sure you want to unlink this component?"))
      return;

    try {
      const response = await fetch(
        `${apiUrl}/api/Inventory/components/${componentId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Failed to remove component");

      setItem((prev) =>
        prev
          ? {
              ...prev,
              components: prev.components.filter((c) => c.id !== componentId),
            }
          : null,
      );

      addToast("Success", "Component unlinked.");
    } catch (err) {
      console.error(err);
      addToast("Error", "Failed to unlink component.");
    }
  };

  const currentlyAvailable = item
    ? item.purchases.reduce((s, p) => s + p.quantityPurchased, 0) -
      item.retirements.reduce((s, r) => s + r.quantityRetired, 0)
    : 0;

  if (isLoading)
    return (
      <div className="p-8 flex justify-center text-gray-500">
        Loading item details...
      </div>
    );
  if (!item && !isLoading)
    return (
      <div className="p-8 flex justify-center text-gray-500">
        Item not found.
      </div>
    );

  return (
    <main className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6 overflow-hidden">
      {/* Header */}
      <section className="flex justify-between items-start">
        <div className="flex items-start gap-4 min-w-0">
          <button
            onClick={() => navigate("/inventory")}
            className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            onClick={handleImageClick}
            className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 group cursor-pointer"
          >
            {item?.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.description}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-7 h-7 text-gray-400" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-[10px] font-semibold tracking-wider uppercase">
                {item?.imageUrl ? "Edit" : "Upload"}
              </span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-primary truncate">
                {item?.description || "Item Details"}
              </h1>
              <ChipTag
                label={item?.isActive ? "Active" : "Inactive"}
                color={item?.isActive ? "green" : "red"}
              />
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="font-mono">SKU: {item?.sku}</span>
              {item?.variant && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{item.variant}</span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-400 mt-2">
              Manage item details, stock movement, and included components.
            </p>
          </div>
        </div>

        <ActionButton
          label="Save Changes"
          icon={Save}
          style="filled"
          onClick={handleSubmit(handleUpdateItemInfo)}
        />
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-4 gap-3 shrink-0">
        <div className="border border-gray-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Available
          </p>
          <p className="text-2xl font-semibold text-primary mt-1">
            {currentlyAvailable}
          </p>
        </div>
        <div className="border border-gray-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Rental Price
          </p>
          <p className="text-2xl font-semibold text-primary mt-1">
            ${Number(item?.unitPrice ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Purchased
          </p>
          <p className="text-2xl font-semibold text-primary mt-1">
            {item?.purchases.reduce((s, p) => s + p.quantityPurchased, 0) ?? 0}
          </p>
        </div>
        <div className="border border-gray-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Retired
          </p>
          <p className="text-2xl font-semibold text-primary mt-1">
            {item?.retirements.reduce((s, r) => s + r.quantityRetired, 0) ?? 0}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-[1.15fr_.85fr_1fr] gap-6 min-h-0 flex-1">
        <div className="min-h-0">
          <ItemInfoCard register={register} errors={formErrors} />
        </div>

        <div className="min-h-0">
          <ItemComponentsList
            components={item?.components || []}
            onAddClick={() => dispatch(openModal("ADD_COMPONENT"))}
            onRemoveClick={handleRemoveComponent}
          />
        </div>

        <aside className="flex flex-col gap-4 min-h-0">
          <div className="border border-gray-200 rounded-2xl p-4 flex gap-3 shrink-0">
            <button
              onClick={() => dispatch(openModal("ADD_PURCHASE"))}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 text-primary border border-gray-200 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <PackagePlus className="w-5 h-5" />
              <span className="font-semibold text-sm">Add Stock</span>
            </button>

            <button
              onClick={() => dispatch(openModal("RETIRE_ITEM"))}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 text-red-700 border border-gray-200 rounded-xl hover:bg-red-50 transition cursor-pointer"
            >
              <PackageMinus className="w-5 h-5" />
              <span className="font-semibold text-sm">Retire Stock</span>
            </button>
          </div>

          <div className="min-h-0 flex-1">
            <ItemLedger item={item!} />
          </div>
        </aside>
      </section>

      {/* --- MODALS --- */}
      {activeModal === "RETIRE_ITEM" && (
        <AddModal
          title="Retire Stock"
          modalKey="RETIRE_ITEM"
          setErrors={() => {}}
        >
          <InventoryRetirementForm
            onSubmit={handleRetirement}
            maxQuantity={currentlyAvailable}
          />
        </AddModal>
      )}

      {activeModal === "ADD_PURCHASE" && (
        <AddModal
          title="Record Purchase"
          modalKey="ADD_PURCHASE"
          setErrors={setErrors}
        >
          <InventoryPurchaseForm
            onSubmit={handlePurchase}
            errors={errors}
            item={{ uid: item!.uid, name: item!.description }}
          />
        </AddModal>
      )}

      {activeModal === "ADD_COMPONENT" && (
        <AddModal
          title="Link Component"
          modalKey="ADD_COMPONENT"
          setErrors={setErrors}
        >
          <InventoryComponentForm
            onSubmit={handleAddComponent}
            currentItemUid={uid!}
          />
        </AddModal>
      )}
    </main>
  );
};

export default ItemDetails;
