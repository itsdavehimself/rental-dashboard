import { useAppDispatch } from "../../../../app/hooks";
import { closeModal } from "../../../../app/slices/uiSlice";
import ActionButton from "../../../../components/common/ActionButton";
import { useEventDetails } from "../../hooks/useEventDetails";
import { splitLogistics } from "../../services/logisticsService";

interface SplitTaskModalProps {
  taskToSplit: string | null;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const SplitTaskModal: React.FC<SplitTaskModalProps> = ({ taskToSplit }) => {
  const { fetchEvent } = useEventDetails();
  const dispatch = useAppDispatch();

  const handleSplitTask = async (taskToSplit: string | null) => {
    if (!taskToSplit) return;

    try {
      // setErrors(null);
      await splitLogistics(apiUrl, taskToSplit);
      fetchEvent();
      dispatch(closeModal());
    } catch (err) {
      // handleError(err, setErrors);
    }
  };
  return (
    <div className="flex flex-col justify-center px-6 pt-4 gap-2">
      <p className="font-semibold">
        Split this trip into two separate assignments?
      </p>
      <div className="w-110">
        <p className="text-sm">
          This will create one trip for{" "}
          <span className="font-semibold">Delivery</span> and one for{" "}
          <span className="font-semibold">Setup</span>. The current truck and
          crew assignments will be copied to both.
        </p>
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
        <ActionButton
          label="Cancel"
          style="outline"
          onClick={() => dispatch(closeModal())}
        />
        <ActionButton
          label="Split"
          style="filled"
          onClick={() => handleSplitTask(taskToSplit)}
        />
      </div>
    </div>
  );
};

export default SplitTaskModal;
