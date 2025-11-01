public enum ClientAddressType
{
    Delivery,
    Billing
}

public class ClientAddress
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();
    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;
    public ClientAddressType Type { get; set; } = ClientAddressType.Delivery;
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Role { get; set; }
    public string AddressLine1 { get; set; } = "";
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string ZipCode { get; set; } = "";
    public string NormalizedCity { get; set; } = "";
    public string NormalizedStreet { get; set; } = "";
    public bool IsPrimary { get; set; } = false;
    public string? Label { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

