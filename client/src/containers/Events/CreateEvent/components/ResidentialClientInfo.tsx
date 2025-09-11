import { Mail, PartyPopper, PenSquare, Phone, UserRound } from "lucide-react";
import { formatPhoneNumber } from "../../../../helpers/formatPhoneNumber";
import type { ClientDetail } from "../../../../types/Client";
import ResidentialClientSection from "./ResidentialClientSection";

interface ResidentialClientInfoProps {
  client: ClientDetail | null;
}

const ResidentialClientInfo: React.FC<ResidentialClientInfoProps> = ({
  client,
}) => {
  const primaryBillingAddress = client?.billingAddresses.find(
    (ba) => ba.isPrimary === true
  );
  const primaryDeliveryAddress = client?.deliveryAddresses.find(
    (ba) => ba.isPrimary === true
  );
  return (
    <>
      {client && primaryBillingAddress && primaryDeliveryAddress && (
        <div className="flex flex-col border-1 border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-lg">Client</h4>
          <div className="flex flex-col gap-2 mt-4 mb-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <UserRound className="h-4 w-4 text-gray-400" />
                <p>
                  {client.firstName} {client.lastName}
                </p>
              </div>
              <button className="font-semibold text-xs text-gray-500 hover:text-primary hover:cursor-pointer transition duration-200">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Mail className="h-4 w-4 text-gray-400" />
                <p>{client.email}</p>
              </div>
              <button className="flex justify-center items-center text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200">
                <PenSquare className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-gray-400" />
                <p>{formatPhoneNumber(client.phoneNumber)}</p>
              </div>
              <button className="flex justify-center items-center text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200">
                <PenSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
          <hr className="text-gray-200" />
          <ResidentialClientSection
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
          />
          <ResidentialClientSection
            title="Billing Address"
            children={
              <>
                <p>{primaryDeliveryAddress.street}</p>
                {primaryDeliveryAddress.unit && (
                  <p>{primaryDeliveryAddress.unit}</p>
                )}
                <p>
                  {primaryDeliveryAddress.city}, {primaryDeliveryAddress.state}{" "}
                  {primaryDeliveryAddress.zipCode}
                </p>
              </>
            }
          />
          <ResidentialClientSection
            title="Delivery Address"
            children={
              <>
                <p>{primaryBillingAddress.street}</p>
                {primaryBillingAddress.unit && (
                  <p>{primaryBillingAddress.unit}</p>
                )}
                <p>
                  {primaryBillingAddress.city}, {primaryBillingAddress.state}{" "}
                  {primaryBillingAddress.zipCode}
                </p>
              </>
            }
            lastItem={true}
          />
        </div>
      )}
    </>
  );
};

export default ResidentialClientInfo;
