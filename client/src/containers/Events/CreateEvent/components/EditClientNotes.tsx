import SaveButton from "../../../../components/common/SaveButton";
import { Save } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { updateClient } from "../../../../service/clientService";
import { useToast } from "../../../../hooks/useToast";
import TextAreaInputLocal from "../../../../components/common/TextAreaInputLocal";
import XButton from "../../../../components/common/XButton";
import { useCreateEvent } from "../../../../context/useCreateEvent";

interface EditClientNotesProps {
  title: string;
}

const EditClientNotes: React.FC<EditClientNotesProps> = ({ title }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const { client, setClient, setOpenModal } = useCreateEvent();

  const [note, setNote] = useState(client?.notes ?? "");

  const saveNote = async (note: string) => {
    if (!client?.uid) return;
    try {
      // setErrors(null);
      const updatedClient = await updateClient(apiUrl, client?.uid, note);
      setClient((prev) => (prev ? { ...prev, notes: note } : prev));
      setOpenModal(null);
      addToast(
        "Success",
        `${updatedClient.firstName} ${updatedClient.lastName}'s notes successfully updated.`
      );
    } catch (err) {
      // handleError(err, setErrors);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenModal(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenModal]);

  return (
    <div
      ref={ref}
      className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4"
    >
      <div className="flex justify-between items-center pl-6 pr-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        <XButton setIsModalOpen={setOpenModal} />
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
