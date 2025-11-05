import { formatPhoneNumber } from "../../../../helpers/formatPhoneNumber";
import ResidentialClientSection from "./ResidentialClientSection";
import type { CreateEventModalType } from "../CreateEvent";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import { useEffect } from "react";

const ResidentialClientInfo: React.FC = () => {
  const {
    client,
    setOpenModal,
    eventBilling,
    setEventBilling,
    eventDelivery,
    setEventDelivery,
  } = useCreateEvent();

  const primaryBillingAddress = client?.billingAddresses.find(
    (ba) => ba.isPrimary === true
  );
  const primaryDeliveryAddress = client?.deliveryAddresses.find(
    (ba) => ba.isPrimary === true
  );

  useEffect(() => {
    if (!eventBilling && primaryBillingAddress)
      setEventBilling(primaryBillingAddress);
    if (!eventDelivery && primaryDeliveryAddress)
      setEventDelivery(primaryDeliveryAddress);
  }, [primaryBillingAddress, primaryDeliveryAddress]);

  return (
    <>
      {client && primaryBillingAddress && primaryDeliveryAddress && (
        <div className="flex flex-col border-1 border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-lg">Client</h4>
          <div className="flex flex-col gap-2 mt-4 mb-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <p>
                  {client.firstName} {client.lastName}
                </p>
              </div>
              <button
                onClick={() => setOpenModal("searchClient")}
                className="font-semibold text-xs text-gray-500 hover:text-primary hover:cursor-pointer transition duration-200"
              >
                Change
              </button>
            </div>
          </div>
          <hr className="text-gray-200" />
          <ResidentialClientSection<CreateEventModalType>
            minHeight={2.5}
            title="Notes"
            children={
              <>
                {client.notes ? (
                  <p>{client.notes}</p>
                ) : (
                  <p className="text-gray-400 text-xs">
                    There are no notes for this client.
                  </p>
                )}
              </>
            }
            setOpenModal={setOpenModal}
            modalKey="editClientNotes"
          />
          <ResidentialClientSection<CreateEventModalType>
            title="Billing Address"
            minHeight={7.7}
            children={
              <>
                <p>
                  {eventBilling?.firstName} {eventBilling?.lastName}
                </p>
                <p>{formatPhoneNumber(eventBilling?.phoneNumber)}</p>
                <p>{eventBilling?.addressLine1}</p>
                {eventBilling?.addressLine2 && (
                  <p>{eventBilling?.addressLine2}</p>
                )}
                <p>
                  {eventBilling?.city}, {eventBilling?.state}{" "}
                  {eventBilling?.zipCode}
                </p>
                <p>{eventBilling?.email}</p>
              </>
            }
            setOpenModal={setOpenModal}
            modalKey="editClientBilling"
          />
          <ResidentialClientSection<CreateEventModalType>
            title="Delivery Address"
            minHeight={7.7}
            children={
              <>
                <p>
                  {eventDelivery?.firstName} {eventDelivery?.lastName}
                </p>
                <p>{formatPhoneNumber(eventDelivery?.phoneNumber)}</p>
                <p>{eventDelivery?.addressLine1}</p>
                {eventDelivery?.addressLine2 && (
                  <p>{eventDelivery?.addressLine2}</p>
                )}
                <p>
                  {eventDelivery?.city}, {eventDelivery?.state}{" "}
                  {eventDelivery?.zipCode}
                </p>
                <p>{eventDelivery?.email}</p>
              </>
            }
            lastItem={true}
            setOpenModal={setOpenModal}
            modalKey="editClientDelivery"
          />
        </div>
      )}
    </>
  );
};

export default ResidentialClientInfo;
