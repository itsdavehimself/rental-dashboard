namespace server.Models;
using server.Models.Clients;

public class Address
{
    public int Id { get; set; }
    public string Street { get; set; } = string.Empty;
    public string? Unit { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string NormalizedStreet { get; set; } = string.Empty;
    public string NormalizedCity { get; set; } = string.Empty;
    public List<ClientAddressBookEntry> AddressBookEntries { get; set; } = [];
}
