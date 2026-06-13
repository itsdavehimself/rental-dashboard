import SaveButton from "../../../../components/common/SaveButton";
import { Save } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { updateClient } from "../../../Clients/services/clientService";
import { useToast } from "../../../../hooks/useToast";
import TextAreaInputLocal from "../../../../components/common/TextAreaInputLocal";
import XButton from "../../../../components/common/XButton";
import { useAppDispatch } from "../../../../app/hooks";
import { closeModal } from "../../../../app/slices/uiSlice";

// Safe import for the Event Builder context
import { useCreateEvent } from "../../hooks/useCreateEvent";

interface EditClientNotesProps {
  title: string;
  passedClient?: any;
  onSuccess?: (newNote: string) => void;
}

const EditClientNotes: React.FC<EditClientNotesProps> = ({
  title,
  passedClient,
  onSuccess,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  // Safely consume Event Context if it exists
  let eventContext: any = null;
  try {
    eventContext = useCreateEvent();
  } catch (e) {
    // Component is being used outside of Event Builder
  }

  const client = passedClient || eventContext?.client;
  const [note, setNote] = useState(client?.notes ?? "");

  const saveNote = async (note: string) => {
    if (!client?.uid) return;
    try {
      const updatedClient = await updateClient(apiUrl, client.uid, note);

      // CRM Flow
      if (onSuccess) {
        onSuccess(note);
      }
      // Legacy Event Builder Flow
      else if (eventContext?.setClient) {
        eventContext.setClient((prev: any) =>
          prev ? { ...prev, notes: note } : prev,
        );
        dispatch(closeModal());
      }

      addToast(
        "Success",
        `${updatedClient.firstName} ${updatedClient.lastName}'s notes successfully updated.`,
      );
    } catch (err) {
      addToast("Error", "Failed to update notes.");
    }
  };

  // Click outside logic already handles closing the modal beautifully
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        dispatch(closeModal());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  return (
    <div
      ref={ref}
      className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4"
    >
      <div className="flex justify-between items-center pl-6 pr-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        <XButton />
      </div>
      <div className="flex flex-col justify-center px-6 py-2 gap-4">
        <TextAreaInputLocal
          label="Notes"
          optional
          note={note}
          setNote={setNote}
        />
        <div className="self-end">
          <SaveButton label="Save" action={() => saveNote(note)} Icon={Save} />
        </div>
      </div>
    </div>
  );
};

export default EditClientNotes;
