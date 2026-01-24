import ResidentialClientSection from "./ResidentialClientSection";
import type { CreateEventModalType } from "../CreateEvent";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import { useEffect } from "react";
import AddressBlock from "../../EventDetails/components/AddressBlock";

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
    (ba) => ba.isPrimary === true,
  );
  const primaryDeliveryAddress = client?.deliveryAddresses.find(
    (ba) => ba.isPrimary === true,
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
        <div className="flex flex-col border-1 border-gray-200 rounded-lg pt-4 px-4 pb-0">
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
          <div className="3xl:inline 4xl:inline">
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
          </div>
          <div className="3xl:grid 3xl:grid-cols-2 3xl:gap-6 4xl:flex 4xl:flex-col">
            <ResidentialClientSection<CreateEventModalType>
              title="Billing Address"
              minHeight={7.7}
              hideDividerOnLarge={true}
              children={
                <>
                  <AddressBlock address={eventBilling} type="Client" />
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
                  <AddressBlock address={eventDelivery} type="Client" />
                </>
              }
              lastItem={true}
              setOpenModal={setOpenModal}
              modalKey="editClientDelivery"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ResidentialClientInfo;
