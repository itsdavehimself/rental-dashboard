public class Package
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public string Name { get; set; } = string.Empty;
  public string? Description { get; set; }
  public decimal PriceOverride { get; set; }
  public bool IsActive { get; set; } = true;

  public List<PackageItem> Items { get; set; } = [];
}