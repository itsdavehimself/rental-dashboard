public class PaginatedResponse<T>
{
  public int Page { get; set; }
  public int PageSize { get; set; }
  public int TotalCount { get; set; }
  public int TotalPages { get; set; }
  public bool HasNextPage => Page < TotalPages;
  public bool HasPreviousPage => Page > 1;
  public IEnumerable<T> Data { get; set; } = [];
}
