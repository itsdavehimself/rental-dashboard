public enum ClientType
{
    Residential,
    Business
}
public class Client
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();
    public ClientType Type { get; set; }
    public string? BusinessName { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string? Email { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool? IsTaxExempt { get; set; } = false;
    public List<ClientAddress> ClientAddresses { get; set; } = new();
}