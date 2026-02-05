namespace server.Models.Inventory;

public class InventoryComponent
{
    public int Id { get; set; }
    
    public int ParentItemId { get; set; }
    public InventoryItem ParentItem { get; set; } = null!;

    public int ChildItemId { get; set; }
    public InventoryItem ChildItem { get; set; } = null!;

    public int Quantity { get; set; } = 1;

    public bool IsRequired { get; set; } = true;
}