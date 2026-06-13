import { useState } from "react";
import { useInventoryConfig } from "../hooks/useInventoryConfig";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { openModal, closeModal } from "../../../app/slices/uiSlice";
import AddModal from "../../../components/common/AddModal";
import ConfigItemForm, {
  type ConfigItemInput,
} from "../components/ConfigItemForm";
import type { ErrorsState } from "../../../helpers/handleError";
import { useToast } from "../../../hooks/useToast";
import ConfigListItem from "../components/ConfigListItem";

type ConfigEntityType = "TYPE" | "SUBTYPE" | "MATERIAL" | "COLOR" | "THEME";

interface EditTarget {
  id: number;
  label: string;
  skuCode?: string;
  entityType: ConfigEntityType;
}

const InventorySettings: React.FC = () => {
  const { types, refresh } = useInventoryConfig();
  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);

  const [errors, setErrors] = useState<ErrorsState>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedSubTypeId, setSelectedSubTypeId] = useState<number | null>(
    null,
  );
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  const selectedType = types.find((t) => t.id === selectedTypeId);
  const selectedSubType = selectedType?.subTypes.find(
    (st) => st.id === selectedSubTypeId,
  );

  // --- SUBMIT HANDLERS ---
  const handleCreate = async (
    entityType: ConfigEntityType,
    data: ConfigItemInput,
  ) => {
    try {
      setErrors(null);
      let endpoint = "";
      const payload: Record<string, any> = {
        label: data.label,
        skuCode: data.skuCode,
      };

      switch (entityType) {
        case "TYPE":
          endpoint = "type";
          break;
        case "SUBTYPE":
          endpoint = "subtype";
          if (!selectedTypeId) throw new Error("No Type selected");
          payload.inventoryTypeId = selectedTypeId;
          payload.skuCode = "N/A";
          break;
        case "MATERIAL":
        case "COLOR":
        case "THEME":
          endpoint = entityType.toLowerCase();
          if (!selectedSubTypeId) throw new Error("No Sub-Type selected");
          payload.inventorySubTypeId = selectedSubTypeId;
          break;
      }

      const response = await fetch(
        `${apiUrl}/api/InventoryConfig/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.title || "Failed to create item.",
        );
      }

      addToast("Success", `${data.label} added successfully.`);
      dispatch(closeModal());
      refresh();
    } catch (err: any) {
      console.error(err);
      addToast("Error", err.message || "Something went wrong.");
    }
  };

  const handleUpdate = async (data: ConfigItemInput) => {
    if (!editTarget) return;
    try {
      setErrors(null);
      const endpoint = editTarget.entityType.toLowerCase();

      const response = await fetch(
        `${apiUrl}/api/InventoryConfig/${endpoint}/${editTarget.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            label: data.label,
            skuCode: data.skuCode,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.title || "Failed to update item.",
        );
      }

      addToast("Success", `${data.label} updated successfully.`);
      dispatch(closeModal());
      setEditTarget(null);
      refresh();
    } catch (err: any) {
      console.error(err);
      addToast("Error", err.message || "Something went wrong.");
    }
  };

  const openEditModal = (item: any, entityType: ConfigEntityType) => {
    setEditTarget({
      id: item.id,
      label: item.label,
      skuCode: item.skuCode,
      entityType,
    });
    dispatch(openModal("EDIT_ITEM"));
  };

  return (
    <main className="flex flex-col bg-white h-screen w-full shadow-md rounded-xl p-8 gap-6">
      <section className="flex flex-row w-full">
        <h2 className="text-2xl font-semibold text-primary">
          Inventory Settings
        </h2>
      </section>

      <section className="grid grid-cols-3 gap-6 flex-1 overflow-hidden ">
        {/* COLUMN 1: TYPES */}
        <section className="flex flex-col border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center bg-gray-50 p-3 border-b border-gray-200">
            <h3 className="font-semibold text-primary">Types</h3>
            <button
              onClick={() => dispatch(openModal("ADD_TYPE"))}
              className="font-semibold text-xs text-gray-500 hover:text-primary hover:cursor-pointer transition duration-200"
            >
              Add New Type
            </button>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2">
            {types.map((type) => (
              <ConfigListItem
                key={type.id}
                item={type}
                isActive={type.id === selectedTypeId}
                onClick={() => {
                  setSelectedTypeId(type.id);
                  setSelectedSubTypeId(null);
                }}
                onEdit={() => openEditModal(type, "TYPE")}
                onDelete={() => console.log("Delete", type.id)}
              />
            ))}
          </div>
        </section>

        {/* COLUMN 2: SUBTYPES */}
        <section className="flex flex-col border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center bg-gray-50 p-3 border-b border-gray-200">
            <h3 className="font-semibold text-primary">Sub-Types</h3>
            {selectedType && (
              <button
                onClick={() => dispatch(openModal("ADD_SUBTYPE"))}
                className="font-semibold text-xs text-gray-500 hover:text-primary hover:cursor-pointer transition duration-200"
              >
                Add New Sub-Type
              </button>
            )}
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2">
            {!selectedType && (
              <p className="text-gray-400 text-center mt-4 text-sm">
                Select a type first
              </p>
            )}
            {selectedType?.subTypes.map((subType) => (
              <ConfigListItem
                key={subType.id}
                item={subType}
                isActive={subType.id === selectedSubTypeId}
                onClick={() => {
                  setSelectedSubTypeId(subType.id);
                }}
                onEdit={() => openEditModal(subType, "SUBTYPE")}
                onDelete={() => console.log("Delete", subType.id)}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 overflow-y-auto">
          {/* MATERIALS */}
          <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden max-h-64">
            <div className="flex justify-between items-center bg-gray-50 p-3 border-b border-gray-200">
              <h3 className="font-semibold text-primary">Materials</h3>
              {selectedSubType && (
                <button
                  onClick={() => dispatch(openModal("ADD_MATERIAL"))}
                  className="font-semibold text-xs text-gray-500 hover:text-primary hover:cursor-pointer transition duration-200"
                >
                  Add New Material
                </button>
              )}
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2">
              {!selectedSubType ? (
                <p className="flex justify-center items-center text-sm text-gray-400 text-center h-10">
                  Select a sub-type
                </p>
              ) : selectedSubType.materials.length === 0 ? (
                <p className="flex justify-center items-center text-sm text-gray-400 text-center h-10">
                  No materials available for this sub-type
                </p>
              ) : (
                selectedSubType.materials.map((m) => (
                  <ConfigListItem
                    key={m.id}
                    item={m}
                    isActive={false}
                    onClick={() => {}}
                    onEdit={() => openEditModal(m, "MATERIAL")}
                    onDelete={() => console.log("Delete", m.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* COLORS */}
          <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden max-h-64">
            <div className="flex justify-between items-center bg-gray-50 p-3 border-b border-gray-200">
              <h3 className="font-semibold text-primary">Colors</h3>
              {selectedSubType && (
                <button
                  onClick={() => dispatch(openModal("ADD_COLOR"))}
                  className="font-semibold text-xs text-gray-500 hover:text-primary hover:cursor-pointer transition duration-200"
                >
                  Add New Color
                </button>
              )}
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2">
              {!selectedSubType ? (
                <p className="flex justify-center items-center text-sm text-gray-400 text-center h-10">
                  Select a sub-type
                </p>
              ) : selectedSubType.colors.length === 0 ? (
                <p className="flex justify-center items-center text-sm text-gray-400 text-center h-10">
                  No colors available for this sub-type
                </p>
              ) : (
                selectedSubType.colors.map((c) => (
                  <ConfigListItem
                    key={c.id}
                    item={c}
                    isActive={false}
                    onClick={() => {}}
                    onEdit={() => openEditModal(c, "COLOR")}
                    onDelete={() => console.log("Delete", c.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* THEMES */}
          <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden max-h-64">
            <div className="flex justify-between items-center bg-gray-50 p-3 border-b border-gray-200">
              <h3 className="font-semibold text-primary">Themes/Styles</h3>
              {selectedSubType && (
                <button
                  onClick={() => dispatch(openModal("ADD_THEME"))}
                  className="font-semibold text-xs text-gray-500 hover:text-primary hover:cursor-pointer transition duration-200"
                >
                  Add New Theme
                </button>
              )}
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2">
              {!selectedSubType ? (
                <p className="flex justify-center items-center text-sm text-gray-400 text-center h-10">
                  Select a sub-type
                </p>
              ) : selectedSubType.bounceHouseTypes.length === 0 ? (
                <p className="flex justify-center items-center text-sm text-gray-400 text-center h-10">
                  No themes available for this sub-type
                </p>
              ) : (
                selectedSubType.bounceHouseTypes.map((b) => (
                  <ConfigListItem
                    key={b.id}
                    item={b}
                    isActive={false}
                    onClick={() => {}}
                    onEdit={() => openEditModal(b, "THEME")}
                    onDelete={() => console.log("Delete", b.id)}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </section>

      {/* MODALS */}
      {activeModal === "ADD_TYPE" && (
        <AddModal
          title="Add New Type"
          modalKey="ADD_TYPE"
          setErrors={setErrors}
        >
          <ConfigItemForm
            onSubmit={(data) => handleCreate("TYPE", data)}
            requiresSku={true}
          />
        </AddModal>
      )}

      {activeModal === "ADD_SUBTYPE" && (
        <AddModal
          title={`Add Sub-Type to ${selectedType?.label}`}
          modalKey="ADD_SUBTYPE"
          setErrors={setErrors}
        >
          <ConfigItemForm
            onSubmit={(data) => handleCreate("SUBTYPE", data)}
            requiresSku={false}
          />
        </AddModal>
      )}

      {activeModal === "ADD_MATERIAL" && (
        <AddModal
          title={`Add Material to ${selectedSubType?.label}`}
          modalKey="ADD_MATERIAL"
          setErrors={setErrors}
        >
          <ConfigItemForm
            onSubmit={(data) => handleCreate("MATERIAL", data)}
            requiresSku={false}
          />
        </AddModal>
      )}

      {activeModal === "ADD_COLOR" && (
        <AddModal
          title={`Add Color to ${selectedSubType?.label}`}
          modalKey="ADD_COLOR"
          setErrors={setErrors}
        >
          <ConfigItemForm
            onSubmit={(data) => handleCreate("COLOR", data)}
            requiresSku={false}
          />
        </AddModal>
      )}

      {activeModal === "ADD_THEME" && (
        <AddModal
          title={`Add Theme to ${selectedSubType?.label}`}
          modalKey="ADD_THEME"
          setErrors={setErrors}
        >
          <ConfigItemForm
            onSubmit={(data) => handleCreate("THEME", data)}
            requiresSku={false}
          />
        </AddModal>
      )}

      {activeModal === "EDIT_ITEM" && editTarget && (
        <AddModal
          title={`Edit ${editTarget.label}`}
          modalKey="EDIT_ITEM"
          setErrors={setErrors}
        >
          <ConfigItemForm
            initialData={{
              label: editTarget.label,
              skuCode: editTarget.skuCode,
            }}
            onSubmit={handleUpdate}
            requiresSku={editTarget.entityType === "TYPE"}
          />
        </AddModal>
      )}
    </main>
  );
};

export default InventorySettings;
