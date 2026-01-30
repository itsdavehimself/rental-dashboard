import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useLocation } from "react-router";
import { closeModal } from "../../app/slices/uiSlice";

const NavigationHandler = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(closeModal());
  }, [location.pathname, dispatch]);

  return null;
};

export default NavigationHandler;
