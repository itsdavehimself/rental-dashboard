using server.Models;

namespace server.Data.Seed;

public static class JobTitleData
{
  public static readonly List<JobTitle> JobTitles = new()
  {
    new JobTitle { Title = "General Manager", PayRate = 30.00m },
    new JobTitle { Title = "Delivery Crew", PayRate = 21.00m }
  };
}
