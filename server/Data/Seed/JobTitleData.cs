using server.Models.User;

namespace server.Data.Seed;

public static class JobTitleData
{
  public static readonly List<JobTitle> JobTitles = new()
  {
    new JobTitle { Title = "Operations Manager"},
    new JobTitle { Title = "Driver/Installer"}
  };
}
