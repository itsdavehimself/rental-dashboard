using System.ComponentModel.DataAnnotations;

namespace server.Validators;

public class ValidStartDateAttribute : ValidationAttribute
{
  private static readonly DateTime MinDate = new(2025, 8, 1);
  private static readonly DateTime MaxDate = new(2499, 12, 31);

  public override bool IsValid(object? value)
  {
    if (value is null) return true;

    if (value is not DateTime date)
      return false;

    return date >= MinDate && date <= MaxDate;
  }

  public override string FormatErrorMessage(string name)
  {
    return $"{name} must be between {MinDate:yyyy-MM-dd} and {MaxDate:yyyy-MM-dd}.";
  }
}
