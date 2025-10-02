namespace server.Models.Clients;

public class ClientAddressBookEntry
{
    public int Id { get; set; }

    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;

    public int PersonId { get; set; }
    public Person Person { get; set; } = null!;

    public int AddressId { get; set; }
    public Address Address { get; set; } = null!;

    public string? Label { get; set; }
    public AddressType Type { get; set; } = AddressType.Delivery;
    public bool IsPrimary { get; set; } = false;
}