import { useAppDispatch } from "../../../../app/hooks";
import { closeModal } from "../../../../app/slices/uiSlice";
import ActionButton from "../../../../components/common/ActionButton";
import { useToast } from "../../../../hooks/useToast";
import { useEventDetails } from "../../hooks/useEventDetails";
import { deleteLogistics } from "../../services/logisticsService";

interface DeleteTaskModalProps {
  taskToDelete: string | null;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({ taskToDelete }) => {
  const { fetchEvent } = useEventDetails();
  const { addToast } = useToast();
  const dispatch = useAppDispatch();

  const handleDeleteTask = async (taskToDelete: string | null) => {
    if (!taskToDelete) return;

    try {
      // setErrors(null);
      await deleteLogistics(apiUrl, taskToDelete);
      console.log("deleted");
      fetchEvent();
      dispatch(closeModal());
      addToast("Success", "Task successfully deleted.");
    } catch (err) {
      // handleError(err, setErrors);
    }
  };
  return (
    <div className="flex flex-col justify-center px-6 pt-4 gap-2">
      <p className="font-semibold">Delete this task?</p>
      <div className="w-110">
        <p className="text-sm">
          Are you sure you want to delete this task?{" "}
          <span className="font-semibold">This action cannot be undone.</span>
        </p>
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
        <ActionButton
          label="Cancel"
          style="outline"
          onClick={() => dispatch(closeModal())}
        />
        <ActionButton
          label="Delete"
          style="filled"
          onClick={() => handleDeleteTask(taskToDelete)}
          type="delete"
        />
      </div>
    </div>
  );
};

export default DeleteTaskModal;
